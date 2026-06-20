import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { applyPlanToUser, downgradeToFree, recordPaidOrder } from "@/lib/billing";
import { isPaidPlan } from "@/lib/stripe-plans";

export const runtime = "nodejs";

async function cancelPreviousSubscription(stripe: Stripe, subscriptionId: string) {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
  } catch {
    /* já cancelada ou inexistente */
  }
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id ?? session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan || !isPaidPlan(plan)) return;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  const previousSubId = session.metadata?.previousSubscriptionId;
  if (previousSubId) {
    await cancelPreviousSubscription(stripe, previousSubId);
  }

  await applyPlanToUser(userId, plan, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId ?? null,
  });

  const amountCents = session.amount_total ?? 0;
  await recordPaidOrder({
    userId,
    plan,
    amountCents,
    stripeSessionId: session.id,
    stripeSubscriptionId: subscriptionId,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });
    if (user) await downgradeToFree(user.id);
    return;
  }
  await downgradeToFree(userId);
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[billing/webhook] STRIPE_WEBHOOK_SECRET ausente");
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[billing/webhook] assinatura inválida", err);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status === "active" && sub.metadata?.userId && isPaidPlan(sub.metadata.plan)) {
          await applyPlanToUser(sub.metadata.userId, sub.metadata.plan, {
            stripeSubscriptionId: sub.id,
            resetCredits: false,
          });
        }
        if (sub.status === "canceled" || sub.status === "unpaid") {
          await handleSubscriptionDeleted(sub);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[billing/webhook]", event.type, err);
    return NextResponse.json({ error: "Erro ao processar evento" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
