import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { applyPlanToUser, recordPaidOrder } from "@/lib/billing";
import { isPaidPlan } from "@/lib/stripe-plans";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { sessionId } = (await req.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 400 });
    }

    const stripe = getStripe();
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkout.client_reference_id !== session.user.id) {
      return NextResponse.json({ error: "Sessão não pertence a este usuário" }, { status: 403 });
    }

    if (checkout.payment_status !== "paid" && checkout.status !== "complete") {
      return NextResponse.json({ error: "Pagamento ainda não confirmado" }, { status: 400 });
    }

    const plan = checkout.metadata?.plan;
    if (!plan || !isPaidPlan(plan)) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const subscriptionId =
      typeof checkout.subscription === "string"
        ? checkout.subscription
        : checkout.subscription?.id;

    const customerId =
      typeof checkout.customer === "string" ? checkout.customer : checkout.customer?.id;

    await applyPlanToUser(session.user.id, plan, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId ?? null,
    });

    await recordPaidOrder({
      userId: session.user.id,
      plan,
      amountCents: checkout.amount_total ?? 0,
      stripeSessionId: checkout.id,
      stripeSubscriptionId: subscriptionId,
    });

    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error("[billing/verify]", err);
    return NextResponse.json({ error: "Erro ao confirmar pagamento" }, { status: 500 });
  }
}
