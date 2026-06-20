"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Crown, Sparkles, Zap } from "lucide-react";

export default function DashboardUpgradeBar() {
  const { data: session } = useSession();
  const plan = session?.user?.plan ?? "FREE";

  if (plan !== "FREE") return null;

  const credits = session?.user?.credits ?? 15;
  const urgent = credits <= 5;

  return (
    <div
      className={`mb-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
        urgent
          ? "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
          : "border-primary-200 bg-gradient-to-r from-primary-50 to-violet-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            urgent ? "bg-amber-500 text-white" : "bg-primary-600 text-white"
          }`}
        >
          {urgent ? <Zap size={20} /> : <Crown size={20} />}
        </div>
        <div>
          <p className="font-display text-sm font-bold text-surface-900">
            {urgent
              ? `Só ${credits} créditos restantes — assine e não pare no meio da prova`
              : "Plano Grátis: 15 créditos/mês · uma conta por CPF"}
          </p>
          <p className="mt-0.5 text-xs text-zinc-600">
            Estudante <strong>R$ 29/mês</strong> — 150 créditos · Pro{" "}
            <strong>R$ 59/mês</strong> — uso intensivo sem travas.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition hover:bg-primary-700"
        >
          <Sparkles size={16} />
          Ver planos
        </Link>
        <Link
          href="/dashboard/billing"
          className="rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          Assinar agora
        </Link>
      </div>
    </div>
  );
}
