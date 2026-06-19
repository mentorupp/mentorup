import Link from "next/link";
import { auth } from "@/lib/auth";
import { TrackBillingView } from "@/components/dashboard/TrackBilling";
import { Check } from "lucide-react";

const plans = [
  {
    id: "FREE",
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    credits: "15 créditos/mês",
    features: [
      "Todas as ferramentas essenciais",
      "Referências ABNT ilimitadas",
      "2 mapas mentais/mês",
      "Histórico básico",
    ],
    cta: "Plano atual",
    current: true,
  },
  {
    id: "STUDENT",
    name: "Estudante",
    price: "R$ 29",
    period: "/mês",
    credits: "150 créditos/mês",
    features: [
      "Tudo do plano Grátis",
      "Ferramentas por área ilimitadas",
      "Simulador de prova",
      "Exportação de mapas e flashcards",
      "Suporte prioritário",
      "Sem anúncios",
    ],
    cta: "Em breve — Stripe/PIX",
    popular: true,
  },
  {
    id: "PRO",
    name: "Pro",
    price: "R$ 59",
    period: "/mês",
    credits: "Créditos ilimitados*",
    features: [
      "Tudo do plano Estudante",
      "Consultoria acadêmica com desconto",
      "Mentor dedicado (1h/mês)",
      "Revisão humana de TCC",
      "API de integração",
      "Prioridade máxima na fila IA",
    ],
    cta: "Em breve — Stripe/PIX",
  },
];

export default async function BillingPage() {
  const session = await auth();
  const currentPlan = session?.user?.plan ?? "FREE";

  return (
    <div>
      <TrackBillingView />
      <h1 className="font-display text-3xl font-extrabold">Planos & Créditos</h1>
      <p className="mt-1 text-zinc-600">
        Escolha o plano ideal. Pagamento via PIX e cartão em breve.
      </p>

      <div className="mt-4 rounded-xl bg-primary-50 p-4 text-sm text-primary-800">
        Você tem <strong>{session?.user?.credits ?? 15} créditos</strong> restantes neste mês.
        Créditos renovam automaticamente a cada 30 dias.
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 ${
                plan.popular
                  ? "border-primary-300 bg-gradient-to-b from-primary-50 to-white shadow-xl"
                  : "border-surface-200 bg-white"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-bold text-white">
                  Recomendado
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
              <button
                type="button"
                disabled={isCurrent}
                className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition ${
                  isCurrent
                    ? "bg-surface-100 text-zinc-400"
                    : plan.popular
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "border border-surface-200 hover:bg-surface-50"
                }`}
              >
                {isCurrent ? "Plano atual" : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-surface-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold">Tabela de Créditos</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Mapa Mental", "3 créditos"],
            ["Questões PDF", "2 créditos"],
            ["Reescrever / Resumir", "1 crédito"],
            ["Flashcards", "2 créditos"],
            ["Referências ABNT", "Grátis"],
            ["Ferramentas por Área", "2-4 créditos"],
            ["Simulador de Prova", "3 créditos"],
            ["Chat com Documento", "1 crédito"],
          ].map(([name, cost]) => (
            <div key={name} className="flex justify-between rounded-lg bg-surface-50 px-4 py-2 text-sm">
              <span>{name}</span>
              <span className="font-semibold text-primary-600">{cost}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Precisa de consultoria humana para TCC ou monografia?{" "}
        <Link href="/contato" className="font-semibold text-primary-600 hover:underline">
          Fale conosco
        </Link>
      </p>
    </div>
  );
}
