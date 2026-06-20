import type { Plan } from "@prisma/client";

export type PaidPlan = Extract<Plan, "STUDENT" | "PRO">;

export const STRIPE_PLANS: Record<
  PaidPlan,
  { name: string; description: string; amountCents: number }
> = {
  STUDENT: {
    name: "MentorUp Estudante",
    description: "150 créditos por mês · ferramentas completas",
    amountCents: 2900,
  },
  PRO: {
    name: "MentorUp Pro",
    description: "Créditos ilimitados · uso intensivo sem travas",
    amountCents: 5900,
  },
};

export function isPaidPlan(plan: string): plan is PaidPlan {
  return plan === "STUDENT" || plan === "PRO";
}

export function getAppUrl() {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
