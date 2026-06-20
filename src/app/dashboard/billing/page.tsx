import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { TrackBillingView } from "@/components/dashboard/TrackBilling";
import BillingPlanCards from "@/components/dashboard/BillingPlanCards";
import { BillingStatusBanner } from "@/components/dashboard/BillingStatusBanner";
import { StripeCheckoutButton, StripePortalButton } from "@/components/dashboard/StripeCheckoutButton";

const plans = [
  {
    id: "FREE" as const,
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    credits: "15 créditos/mês · 1 conta por CPF",
    features: [
      "Ferramentas essenciais de estudo",
      "Referências ABNT ilimitadas",
      "Ideal para testar a plataforma",
      "Renovação mensal automática",
    ],
  },
  {
    id: "STUDENT" as const,
    name: "Estudante",
    price: "R$ 29",
    period: "/mês",
    credits: "150 créditos/mês",
    features: [
      "10× mais créditos que o Grátis",
      "Simulador de prova e correção por foto",
      "Ferramentas por área (Saúde e Humanas)",
      "Exportação de mapas e flashcards",
      "Suporte prioritário",
    ],
    popular: true,
  },
  {
    id: "PRO" as const,
    name: "Pro",
    price: "R$ 59",
    period: "/mês",
    credits: "Créditos ilimitados*",
    features: [
      "Uso intensivo sem travas de crédito",
      "Prioridade na fila de IA",
      "Consultoria acadêmica com desconto",
      "Revisão humana de TCC (consultar)",
      "Para semestre pesado e TCC",
    ],
  },
];

export default async function BillingPage() {
  const session = await auth();
  const currentPlan = (session?.user?.plan ?? "FREE") as "FREE" | "STUDENT" | "PRO";
  const isFree = currentPlan === "FREE";

  return (
    <div>
      <TrackBillingView />
      <h1 className="font-display text-3xl font-extrabold">Planos & Assinatura</h1>
      <p className="mt-1 text-zinc-600">
        Assinatura mensal com cartão ou PIX via Stripe. Cancele quando quiser.
      </p>

      <Suspense fallback={null}>
        <BillingStatusBanner />
      </Suspense>

      {currentPlan !== "FREE" && (
        <div className="mt-6 rounded-2xl border border-surface-200 bg-white p-4">
          <p className="text-sm text-zinc-600">
            Plano ativo: <strong>{currentPlan === "PRO" ? "Pro" : "Estudante"}</strong>
          </p>
          <StripePortalButton className="mt-3 rounded-xl border border-surface-200 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-surface-50" />
        </div>
      )}

      {isFree && (
        <div className="mt-6 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-600 to-violet-600 p-6 text-white">
          <h2 className="font-display text-lg font-bold">Você está no plano Grátis</h2>
          <p className="mt-2 text-sm text-primary-100">
            Com 15 créditos/mês dá para testar — mas na semana de prova ou TCC, quem assina não fica
            na mão. <strong>Estudante por R$ 29/mês</strong> é o custo de um lanche e cobre o mês
            inteiro.
          </p>
          <StripeCheckoutButton
            plan="STUDENT"
            label="Assinar Estudante — R$ 29/mês"
            className="mt-4 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-700 hover:brightness-105 disabled:opacity-70"
          />
        </div>
      )}

      <div className="mt-4 rounded-xl bg-surface-50 p-4 text-sm text-zinc-700">
        Você tem <strong>{session?.user?.credits ?? 15} créditos</strong> neste ciclo.
        {isFree && (
          <>
            {" "}
            Créditos do plano Grátis renovam a cada 30 dias — escolha um plano abaixo para não depender desse limite.
          </>
        )}
      </div>

      <BillingPlanCards plans={plans} currentPlan={currentPlan} />

      <div className="mt-10 rounded-2xl border border-surface-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold">Por que assinar?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-zinc-600">
          <li>✓ Simulado de prova completo (18+ questões) consome 3 créditos — no Grátis, 5 usos e acabou.</li>
          <li>✓ Mapa mental + flashcards + resumo na mesma semana esgota créditos grátis.</li>
          <li>✓ Plano Estudante paga por si no primeiro trabalho entregue com IA.</li>
          <li>✓ Uma conta por CPF — plano justo para quem estuda de verdade.</li>
        </ul>
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
            ["Correção de Prova (foto)", "2 créditos"],
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
        Dúvidas sobre planos ou consultoria para TCC?{" "}
        <Link href="/contato" className="font-semibold text-primary-600 hover:underline">
          Fale conosco — respondemos em minutos
        </Link>
      </p>
    </div>
  );
}
