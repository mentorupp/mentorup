import type { Plan } from "@prisma/client";
import { prisma } from "./prisma";
import { PLAN_CREDITS } from "./tools-config";

export async function applyPlanToUser(
  userId: string,
  plan: Plan,
  opts?: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string | null;
    resetCredits?: boolean;
  }
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      ...(opts?.resetCredits !== false
        ? { credits: PLAN_CREDITS[plan], creditsReset: new Date() }
        : {}),
      ...(opts?.stripeCustomerId ? { stripeCustomerId: opts.stripeCustomerId } : {}),
      ...(opts?.stripeSubscriptionId !== undefined
        ? { stripeSubscriptionId: opts.stripeSubscriptionId }
        : {}),
    },
  });
}

export async function recordPaidOrder(input: {
  userId: string;
  plan: Plan;
  amountCents: number;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
}) {
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: input.stripeSessionId },
  });
  if (existing) return existing;

  return prisma.order.create({
    data: {
      userId: input.userId,
      description: `Assinatura ${input.plan}`,
      plan: input.plan,
      amountCents: input.amountCents,
      status: "PAID",
      paidAt: new Date(),
      stripeSessionId: input.stripeSessionId,
      stripeSubscriptionId: input.stripeSubscriptionId,
    },
  });
}

export async function downgradeToFree(userId: string) {
  return applyPlanToUser(userId, "FREE", {
    stripeSubscriptionId: null,
    resetCredits: true,
  });
}
