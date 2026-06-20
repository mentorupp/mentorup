import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getAppUrl, isPaidPlan, STRIPE_PLANS } from "@/lib/stripe-plans";

const bodySchema = z.object({
  plan: z.enum(["STUDENT", "PRO"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Faça login para assinar" }, { status: 401 });
    }

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const plan = parsed.data.plan;
    if (!isPaidPlan(plan)) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user?.email) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (user.plan === plan) {
      return NextResponse.json({ error: "Você já está neste plano" }, { status: 400 });
    }

    const stripe = getStripe();
    const planConfig = STRIPE_PLANS[plan];
    const appUrl = getAppUrl();

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: planConfig.amountCents,
            recurring: { interval: "month" },
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
        },
      },
      metadata: {
        userId: user.id,
        plan,
        previousSubscriptionId: user.stripeSubscriptionId ?? "",
      },
      success_url: `${appUrl}/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "pt-BR",
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: "Erro ao iniciar pagamento" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[billing/checkout]", err);
    const message =
      err instanceof Error && err.message.includes("STRIPE_SECRET_KEY")
        ? "Pagamentos ainda não configurados no servidor"
        : "Erro ao iniciar checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
