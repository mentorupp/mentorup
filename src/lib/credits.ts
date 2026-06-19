import type { Plan, ToolType, Prisma } from "@prisma/client";
import { PLAN_CREDITS } from "./tools-config";
import { prisma } from "./prisma";

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export async function resetCreditsIfNeeded(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const now = new Date();
  const elapsed = now.getTime() - user.creditsReset.getTime();

  if (elapsed >= MONTH_MS) {
    const maxCredits = PLAN_CREDITS[user.plan];
    return prisma.user.update({
      where: { id: userId },
      data: {
        credits: maxCredits,
        creditsReset: now,
      },
    });
  }

  return user;
}

export async function checkAndDeductCredits(
  userId: string,
  tool: ToolType,
  cost: number,
  title?: string,
  inputMeta?: Prisma.InputJsonValue
) {
  const user = await resetCreditsIfNeeded(userId);
  if (!user) throw new Error("Usuário não encontrado");

  if (cost > 0 && user.credits < cost) {
    throw new Error("CREDITS_INSUFFICIENT");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      credits: cost > 0 ? { decrement: cost } : undefined,
    },
  });

  await prisma.usageLog.create({
    data: {
      userId,
      tool,
      creditsUsed: cost,
      title,
      inputMeta: inputMeta ?? {},
    },
  });

  return updated;
}

export function getPlanLabel(plan: Plan) {
  const labels: Record<Plan, string> = {
    FREE: "Grátis",
    STUDENT: "Estudante",
    PRO: "Pro",
  };
  return labels[plan];
}

export function getPlanPrice(plan: Plan) {
  const prices: Record<Plan, string> = {
    FREE: "R$ 0",
    STUDENT: "R$ 29/mês",
    PRO: "R$ 59/mês",
  };
  return prices[plan];
}
