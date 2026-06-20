import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/stripe-plans";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Faça login" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura Stripe encontrada para esta conta" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${getAppUrl()}/dashboard/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("[billing/portal]", err);
    return NextResponse.json({ error: "Erro ao abrir portal de assinatura" }, { status: 500 });
  }
}
