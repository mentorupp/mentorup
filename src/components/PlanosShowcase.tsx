"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Layers,
  MessageCircle,
  Microscope,
  PenLine,
  Presentation,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  consultancyPackages,
  faqItems,
  platformPlans,
  serviceCategoryMeta,
  servicePrices,
  type ServicePrice,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const categories = ["rapido", "entrega", "projeto", "tcc"] as const;

const serviceIcons: Record<string, typeof FileText> = {
  resumo: FileText,
  fichamento: BookOpen,
  lista: PenLine,
  slides: Presentation,
  atividade: Layers,
  revisao: PenLine,
  abnt: FileText,
  relatorio: FileText,
  estagio: GraduationCap,
  extensao: Layers,
  artigo: Microscope,
  pesquisa: Microscope,
  tcc: GraduationCap,
};

const iaCompareRows = [
  { label: "Créditos IA / mês", free: "15", student: "150", pro: "Generosos*" },
  { label: "ABNT ilimitado", free: true, student: true, pro: true },
  { label: "Ferramentas por área", free: false, student: true, pro: true },
  { label: "Simulador de prova", free: false, student: true, pro: true },
  { label: "Desconto consultoria", free: false, student: false, pro: "10%" },
  { label: "Mentor dedicado", free: false, student: false, pro: "1h/mês" },
];

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

function CompareCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} className="mx-auto text-accent-500" />;
  if (value === false) return <span className="text-zinc-300">—</span>;
  return <span className="text-xs font-semibold text-zinc-700">{value}</span>;
}

function ServiceCard({
  item,
  variant,
  delay,
  visible,
}: {
  item: ServicePrice;
  variant: "rapido" | "default" | "tcc";
  delay: number;
  visible: boolean;
}) {
  const Icon = serviceIcons[item.id] ?? FileText;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-500",
        variant === "rapido"
          ? "border-primary-100 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10"
          : variant === "tcc"
            ? "border-primary-200 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/30 lg:col-span-3"
            : "border-zinc-200/80 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {item.popular && (
        <span className="absolute top-3 right-3 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
          Popular
        </span>
      )}

      <div
        className={cn(
          "h-1 w-full",
          variant === "rapido"
            ? "bg-gradient-to-r from-primary-500 to-accent-400"
            : "bg-gradient-to-r from-zinc-200 to-zinc-100 group-hover:from-primary-400 group-hover:to-accent-300"
        )}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
              variant === "rapido"
                ? "bg-gradient-to-br from-primary-500 to-primary-600"
                : "bg-gradient-to-br from-zinc-700 to-zinc-800 group-hover:from-primary-500 group-hover:to-primary-600"
            )}
          >
            <Icon size={20} />
          </div>
          {item.price !== null ? (
            <div className="text-right">
              <p className="font-display text-2xl font-extrabold text-primary-600">
                {formatPrice(item.price)}
              </p>
              <p className="text-[10px] font-medium text-zinc-400">valor fixo</p>
            </div>
          ) : (
            <span className="rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary-700">
              Orçamento grátis
            </span>
          )}
        </div>

        <h3 className="font-display mt-4 font-bold text-surface-900">{item.name}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-600">
          <Clock size={12} />
          Prazo: {item.delivery}
        </p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">{item.description}</p>

        <ul className="mt-4 space-y-1.5 border-t border-zinc-100 pt-4">
          {item.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2 text-xs text-zinc-600">
              <Check size={12} className="mt-0.5 shrink-0 text-accent-500" />
              {inc}
            </li>
          ))}
        </ul>

        <Link
          href="/contato"
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all",
            variant === "rapido" ? "btn-primary" : "btn-secondary"
          )}
        >
          {item.price !== null ? "Pedir este serviço" : "Solicitar orçamento"}
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function PlanosShowcase() {
  const [activeCat, setActiveCat] = useState<(typeof categories)[number]>("rapido");
  const intro = useInView();
  const ia = useInView();
  const consult = useInView();

  const pricingFaq = faqItems.filter((f) =>
    /preço|plágio|pagamento|crédito|consultoria/i.test(f.question)
  ).slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Trust bar */}
      <section className="border-b border-zinc-200/60 bg-white py-4">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { icon: CreditCard, text: "PIX ou cartão em até 6x" },
              { icon: ShieldCheck, text: "Preço fixo — sem surpresas" },
              { icon: Check, text: "1 revisão inclusa por entrega" },
              { icon: Clock, text: "Orçamento grátis em até 2h" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-2 text-xs font-medium text-zinc-600"
              >
                <Icon size={14} className="text-primary-500" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Plataforma IA */}
      <section className="section-padding-sm bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={intro.ref}
            className={cn(
              "mb-6 transition-all duration-700",
              intro.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Sparkles size={16} />
              </div>
              <span className="text-xs font-bold tracking-wider text-primary-600 uppercase">
                Plataforma IA
              </span>
            </div>
            <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
              Assinatura mensal — cancele quando quiser
            </h2>
            <p className="mt-1 max-w-xl text-sm text-zinc-500">
              Comece grátis. Upgrade só se usar IA toda semana. ABNT ilimitado em todos os planos.
            </p>
          </div>

          <div
            className={cn(
              "grid gap-4 lg:grid-cols-3 transition-all duration-700 delay-100",
              intro.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {platformPlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-5 transition-all hover:-translate-y-0.5 sm:p-6",
                  plan.popular
                    ? "border-primary-300 bg-white shadow-lg shadow-primary-500/10 ring-4 ring-primary-50"
                    : "border-zinc-200/80 bg-white hover:shadow-md"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-3 py-0.5 text-[11px] font-bold text-white">
                    Mais popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-500">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                      <Check size={15} className="mt-0.5 shrink-0 text-accent-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={cn(
                    "mt-5 block rounded-xl py-3 text-center text-sm font-semibold",
                    plan.popular ? "btn-primary" : "btn-secondary"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div
            ref={ia.ref}
            className={cn(
              "mt-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-700",
              ia.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3 sm:px-5">
              <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                Compare os planos IA
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 sm:px-5">
                      Recurso
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-zinc-600">Grátis</th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-primary-600">
                      Estudante
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-zinc-600">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {iaCompareRows.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-50 last:border-0">
                      <td className="px-4 py-3 text-zinc-700 sm:px-5">{row.label}</td>
                      <td className="px-3 py-3 text-center">
                        <CompareCell value={row.free} />
                      </td>
                      <td className="bg-primary-50/40 px-3 py-3 text-center">
                        <CompareCell value={row.student} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <CompareCell value={row.pro} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Consultoria — nav + sections */}
      <section className="section-padding-sm border-t border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={consult.ref}
            className={cn(
              "mb-5 transition-all duration-700",
              consult.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                <GraduationCap size={16} />
              </div>
              <span className="text-xs font-bold tracking-wider text-accent-600 uppercase">
                Consultoria humana
              </span>
            </div>
            <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
              Valor fixo por serviço — pague só o que precisa
            </h2>
            <p className="mt-1 max-w-xl text-sm text-zinc-500">
              Sem pacotes de R$ 600+. Cada serviço tem preço, prazo e escopo definidos antes do
              pagamento.
            </p>
          </div>

          {/* Category tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const meta = serviceCategoryMeta[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-left transition-all",
                    activeCat === cat
                      ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                      : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-primary-200"
                  )}
                >
                  <span className="block text-xs font-bold">{meta.label}</span>
                  <span
                    className={cn(
                      "block text-[10px]",
                      activeCat === cat ? "text-primary-100" : "text-zinc-400"
                    )}
                  >
                    {meta.turnaround}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active category header */}
          <div className="mb-4 rounded-xl bg-zinc-50 px-4 py-3 sm:px-5">
            <h3 className="font-display font-bold text-surface-900">
              {serviceCategoryMeta[activeCat].label}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              {serviceCategoryMeta[activeCat].subtitle}
            </p>
          </div>

          {/* Service cards grid */}
          <div
            className={cn(
              activeCat === "rapido"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : activeCat === "tcc"
                  ? "grid gap-4 lg:grid-cols-3"
                  : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {servicePrices
              .filter((s) => s.category === activeCat)
              .map((item, i) => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  variant={activeCat === "rapido" ? "rapido" : activeCat === "tcc" ? "tcc" : "default"}
                  visible={consult.visible}
                  delay={i * 50}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Pacotes */}
      <section className="section-padding-sm border-t border-zinc-200/60 bg-[#fafbfc]">
        <div className="container-custom">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-label">Economize mais</span>
              <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
                Pacotes com desconto
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Os combos mais pedidos — até R$ 21 de economia.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-accent-200 bg-accent-50 px-3 py-2">
              <Zap size={16} className="text-accent-600" />
              <span className="text-xs font-semibold text-accent-800">
                Pacote Atividade = mais pedido
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {consultancyPackages.map((pkg) => {
              const savings =
                parseInt(pkg.originalPrice.replace(/\D/g, ""), 10) -
                parseInt(pkg.price.replace(/\D/g, ""), 10);
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg",
                    pkg.popular
                      ? "border-primary-300 shadow-md shadow-primary-500/10 ring-4 ring-primary-50"
                      : "border-zinc-200/80"
                  )}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      Mais pedido
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="absolute top-3 right-3 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      −R$ {savings}
                    </span>
                  )}
                  <h3 className="font-display font-bold">{pkg.name}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{pkg.description}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-extrabold text-primary-600">
                      {pkg.price}
                    </span>
                    <span className="text-sm text-zinc-400 line-through">{pkg.originalPrice}</span>
                  </div>
                  <ul className="mt-4 flex-1 space-y-1.5">
                    {pkg.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-2 text-xs text-zinc-600">
                        <Check size={12} className="shrink-0 text-accent-500" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contato" className="btn-secondary mt-4 py-2.5 text-xs">
                    Pedir pacote
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ + nota */}
      <section className="section-padding-sm border-t border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <span className="section-label">Dúvidas sobre valores</span>
              <h2 className="font-display mt-2 text-xl font-extrabold">Perguntas frequentes</h2>
              <div className="mt-4 space-y-3">
                {pricingFaq.map((item) => (
                  <div key={item.question} className="rounded-xl border border-zinc-200/80 p-4">
                    <p className="text-sm font-bold text-surface-900">{item.question}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{item.answer}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600"
              >
                Ver FAQ completo
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-dashed border-primary-200 bg-primary-50/30 p-6">
              <MessageCircle size={24} className="text-primary-500" />
              <h3 className="font-display mt-3 text-lg font-bold">Não achou o que precisa?</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Descreva seu trabalho no formulário ou WhatsApp. Enviamos proposta com escopo, prazo
                e valor fixo — grátis e sem compromisso.
              </p>
              <Link href="/contato" className="btn-primary mt-4 text-sm">
                Pedir orçamento grátis
                <ArrowRight size={15} />
              </Link>
              <p className="mt-4 text-[11px] leading-relaxed text-zinc-400">
                * Créditos IA no plano Pro conforme uso justo. Valores podem variar conforme
                extensão (páginas) e urgência — sempre confirmados antes do pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Comece grátis ou peça um orçamento
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            IA a partir de R$ 0. Consultoria a partir de R$ 22. Preço justo, entrega de qualidade.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-surface-900 shadow-xl transition hover:brightness-105"
            >
              <Sparkles size={16} />
              Criar conta grátis
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Consultoria a partir de R$ 22
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
