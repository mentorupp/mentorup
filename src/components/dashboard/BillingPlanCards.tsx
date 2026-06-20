"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { StripeCheckoutButton } from "./StripeCheckoutButton";

type PlanId = "FREE" | "STUDENT" | "PRO";

interface PlanCard {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  credits: string;
  features: string[];
  popular?: boolean;
}

interface BillingPlanCardsProps {
  plans: PlanCard[];
  currentPlan: PlanId;
}

export default function BillingPlanCards({ plans, currentPlan }: BillingPlanCardsProps) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        const isUpgrade = plan.id !== "FREE" && !isCurrent;

        return (
          <div
            key={plan.id}
            className={`relative rounded-2xl border p-6 ${
              plan.popular
                ? "border-primary-300 bg-gradient-to-b from-primary-50 to-white shadow-xl ring-2 ring-primary-200"
                : "border-surface-200 bg-white"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-bold text-white">
                Mais escolhido
              </span>
            )}
            <h2 className="font-display text-xl font-bold">{plan.name}</h2>
            <div className="mt-2">
              <span className="font-display text-4xl font-extrabold">{plan.price}</span>
              <span className="text-sm text-zinc-500">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-primary-600">{plan.credits}</p>
            <ul className="mt-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent-500" />
                  {f}
                </li>
              ))}
            </ul>
            {isCurrent ? (
              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-xl bg-surface-100 py-3 text-sm font-semibold text-zinc-400"
              >
                Plano atual
              </button>
            ) : isUpgrade ? (
              <StripeCheckoutButton
                plan={plan.id as "STUDENT" | "PRO"}
                label={`Assinar ${plan.name}`}
                className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-70"
                    : "border border-primary-200 text-primary-700 hover:bg-primary-50 disabled:opacity-70"
                }`}
              />
            ) : (
              <Link
                href="/register"
                className="mt-6 block w-full rounded-xl border border-surface-200 py-3 text-center text-sm font-semibold hover:bg-surface-50"
              >
                Começar grátis
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
