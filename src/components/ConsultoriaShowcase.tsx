"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  MessageCircle,
  Quote,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import {
  consultancyPackages,
  differentials,
  serviceCategoryMeta,
  servicePrices,
  services,
  stats,
  steps,
  testimonials,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const serviceGroups = [
  {
    id: "formacao",
    label: "Formação & TCC",
    description: "Acompanhamento por etapa até a banca",
    ids: ["tcc"],
  },
  {
    id: "completos",
    label: "Entregas completas",
    description: "Trabalhos prontos para entregar na instituição",
    ids: ["estagio", "relatorios", "artigos", "pesquisa"],
  },
  {
    id: "apoio",
    label: "Apoio no dia a dia",
    description: "Atividades, revisões e materiais de apoio",
    ids: ["atividades", "fichamento", "slides", "revisao"],
  },
];

function useInView(threshold = 0.1) {
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

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const numeric = parseFloat(target.replace(/[^\d.]/g, ""));
  const prefix = target.match(/^[^\d]*/)?.[0] ?? "";
  const postfix = target.match(/[^\d.]*$/)?.[0] ?? "";
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible || Number.isNaN(numeric)) return;
    let frame = 0;
    const total = 45;
    const tick = () => {
      frame++;
      setCount(Math.round((numeric * frame) / total));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, numeric]);

  if (Number.isNaN(numeric)) {
    return <span ref={ref}>{target}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {postfix}
      {suffix}
    </span>
  );
}

function ServiceCard({
  service,
  featured,
  delay,
  visible,
}: {
  service: (typeof services)[0];
  featured?: boolean;
  delay: number;
  visible: boolean;
}) {
  const Icon = service.icon;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white transition-all duration-500",
        featured
          ? "border-primary-200 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 p-8 text-white shadow-xl shadow-primary-500/25 lg:col-span-2"
          : "border-zinc-200/80 p-6 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/8",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {!featured && (
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary-500/5 transition-transform duration-700 group-hover:scale-150" />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            featured
              ? "bg-white/20 text-white backdrop-blur-sm"
              : "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20"
          )}
        >
          <Icon size={22} />
        </div>
        {(service.priceFrom || service.priceNote) && (
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
              featured ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700"
            )}
          >
            {service.priceFrom ?? service.priceNote}
          </span>
        )}
      </div>

      <h3
        className={cn(
          "font-display relative mt-5 text-xl font-bold",
          featured ? "text-white" : "text-surface-900"
        )}
      >
        {service.title}
      </h3>
      <p
        className={cn(
          "relative mt-2 text-sm leading-relaxed",
          featured ? "text-primary-100" : "text-zinc-500"
        )}
      >
        {service.description}
      </p>

      <ul className="relative mt-5 space-y-2.5">
        {service.features.slice(0, featured ? 5 : 4).map((f) => (
          <li
            key={f}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              featured ? "text-white/90" : "text-zinc-600"
            )}
          >
            <CheckCircle2
              size={16}
              className={cn("mt-0.5 shrink-0", featured ? "text-accent-300" : "text-accent-500")}
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/contato"
        className={cn(
          "relative mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all",
          featured
            ? "rounded-xl bg-white px-5 py-2.5 text-primary-600 hover:brightness-105"
            : "text-primary-600 opacity-0 group-hover:opacity-100"
        )}
      >
        Solicitar orçamento
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function ConsultoriaShowcase() {
  const trust = useInView(0.05);
  const why = useInView();
  const servicos = useInView();
  const precos = useInView();
  const processo = useInView();
  const pacotes = useInView();

  const tcc = services.find((s) => s.id === "tcc")!;
  const featuredStory = testimonials.find((t) => t.featured)!;
  const consultReviews = testimonials
    .filter((t) => t.type === "consultoria")
    .slice(0, 3);

  const priceGroups = ["rapido", "entrega", "projeto", "tcc"] as const;

  return (
    <div className="overflow-hidden">
      {/* Trust stats */}
      <section className="section-padding-sm border-b border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={trust.ref}
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700",
              trust.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-primary-50/30 p-5 text-center"
              >
                <p className="font-display text-3xl font-extrabold text-gradient">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p
            className={cn(
              "mt-6 text-center text-sm text-zinc-500 transition-all duration-700 delay-200",
              trust.visible ? "opacity-100" : "opacity-0"
            )}
          >
            Consultoria acadêmica com mentores de mestrado e doutorado —{" "}
            <span className="font-semibold text-zinc-700">
              referência para estudantes em todo o Brasil
            </span>
          </p>
        </div>
      </section>

      {/* Por que MentorUp */}
      <section className="section-padding bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={why.ref}
            className={cn(
              "mx-auto mb-12 max-w-2xl text-center transition-all duration-700",
              why.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Por que a MentorUp</span>
            <h2 className="section-title mt-2">
              A consultoria que o aluno{" "}
              <span className="text-gradient">confia de verdade</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Preço fixo, mentor da sua área, originalidade garantida e suporte humano —
              sem pacotes escondidos ou surpresas na hora de pagar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "card-premium p-6 transition-all duration-500 hover:border-primary-200/80 hover:shadow-lg",
                    why.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  )}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display font-bold text-surface-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "mt-8 flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-300",
              why.visible ? "opacity-100" : "opacity-0"
            )}
          >
            {[
              { icon: ShieldCheck, text: "100% original — anti-plágio incluso" },
              { icon: Award, text: "1 revisão gratuita por entrega" },
              { icon: MessageCircle, text: "Suporte direto via WhatsApp" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-2 text-sm font-medium text-zinc-600"
              >
                <Icon size={16} className="text-accent-500" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços — TCC featured + grouped */}
      <section className="section-padding border-y border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={servicos.ref}
            className={cn(
              "mb-10 transition-all duration-700",
              servicos.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Nossos serviços</span>
            <h2 className="section-title mt-2">Do TCC ao fichamento — cobertura total</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Nove linhas de serviço para cada momento da sua graduação. Escolha o que precisa
              agora.
            </p>
          </div>

          <div className="mb-10 grid gap-4 lg:grid-cols-2">
            <ServiceCard service={tcc} featured visible={servicos.visible} delay={0} />
            <div className="flex flex-col justify-center rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 p-8">
              <Quote size={32} className="text-primary-300" />
              <p className="mt-4 line-clamp-4 text-lg leading-relaxed font-medium text-zinc-700">
                &ldquo;{featuredStory.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
                  {featuredStory.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold">{featuredStory.name}</p>
                  <p className="text-xs text-zinc-500">
                    {featuredStory.course} · {featuredStory.university}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-accent-700">{featuredStory.outcome}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {serviceGroups.slice(1).map((group) => {
            const groupServices = services.filter((s) => group.ids.includes(s.id));
            return (
              <div key={group.id} className="mb-12 last:mb-0">
                <div className="mb-5">
                  <h3 className="font-display text-lg font-bold text-surface-900">{group.label}</h3>
                  <p className="text-sm text-zinc-500">{group.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                  {groupServices.map((service, i) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      visible={servicos.visible}
                      delay={i * 60}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabela de valores */}
      <section className="section-padding bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={precos.ref}
            className={cn(
              "mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end transition-all duration-700",
              precos.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <div>
              <span className="section-label">Valores transparentes</span>
              <h2 className="section-title mt-2">Preço fixo, sem surpresas</h2>
              <p className="mt-2 max-w-lg text-sm text-zinc-500">
                Valores pensados para o bolso do estudante. PIX, cartão em até 6x nos pacotes.
              </p>
            </div>
            <Link href="/planos" className="btn-secondary shrink-0 text-sm">
              Ver pacotes com desconto
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Entregas rápidas — cards */}
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold">{serviceCategoryMeta.rapido.label}</h3>
            <p className="mt-0.5 text-sm text-zinc-500">{serviceCategoryMeta.rapido.subtitle}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {servicePrices
                .filter((s) => s.category === "rapido")
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-primary-100 bg-white p-4 transition hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-surface-900">{item.name}</h4>
                      {item.price !== null && (
                        <span className="font-display shrink-0 text-lg font-extrabold text-primary-600">
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-primary-600">
                      <Clock size={11} />
                      {item.delivery}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                      {item.description}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {item.includes.slice(0, 2).map((inc) => (
                        <li key={inc} className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                          <Check size={10} className="shrink-0 text-accent-500" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          {/* Demais categorias — lista enriquecida */}
          <div
            className={cn(
              "card-premium overflow-hidden transition-all duration-700 delay-100",
              precos.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            {priceGroups
              .filter((cat) => cat !== "rapido")
              .map((cat, catIndex) => {
              const items = servicePrices.filter((s) => s.category === cat);
              return (
                <div key={cat}>
                  {catIndex > 0 && <div className="border-t border-zinc-100" />}
                  <div className="bg-zinc-50/90 px-5 py-3">
                    <span className="text-[11px] font-bold tracking-wider text-primary-600 uppercase">
                      {serviceCategoryMeta[cat].label}
                    </span>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {serviceCategoryMeta[cat].subtitle}
                    </p>
                  </div>
              {items.map((item, i) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
                        i < items.length - 1 && "border-b border-zinc-100"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-zinc-800">{item.name}</span>
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{item.description}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary-600">
                          <Clock size={11} />
                          {item.delivery}
                        </span>
                      </div>
                      {item.price !== null ? (
                        <span className="font-display shrink-0 text-base font-bold text-primary-600">
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      ) : (
                        <Link
                          href="/contato"
                          className="shrink-0 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                        >
                          Orçamento grátis
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div
            ref={processo.ref}
            className={cn(
              "mb-10 text-center transition-all duration-700",
              processo.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Como funciona</span>
            <h2 className="section-title mt-2">Simples do pedido à entrega</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={cn(
                    "relative card-premium p-6 transition-all duration-500",
                    processo.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  )}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="font-display text-4xl font-black text-primary-100">
                    {step.step}
                  </span>
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display mt-4 font-bold text-surface-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pacotes */}
      <section className="section-padding border-t border-zinc-200/60 bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={pacotes.ref}
            className={cn(
              "mb-10 text-center transition-all duration-700",
              pacotes.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Pacotes</span>
            <h2 className="section-title mt-2">Combos com desconto</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Os serviços mais pedidos juntos — economize até R$ 21.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {consultancyPackages.map((pkg, i) => (
              <div
                key={pkg.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
                  pkg.popular ? "border-primary-300 shadow-md shadow-primary-500/10" : "border-zinc-200/80",
                  pacotes.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Mais pedido
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
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-zinc-600">
                      <CheckCircle2 size={12} className="shrink-0 text-accent-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/contato" className="btn-secondary mt-4 py-2.5 text-xs">
                  Pedir pacote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos mini */}
      <section className="section-padding-sm border-t border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div className="grid gap-4 md:grid-cols-3">
            {consultReviews.map((t) => (
              <div key={t.id} className="card-premium p-5">
                <div className="mb-2 flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="line-clamp-2 text-xs text-zinc-500">{t.situation}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold text-accent-700">{t.outcome}</p>
                <p className="mt-3 text-xs font-semibold text-zinc-800">
                  {t.name} · {t.university}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-padding-sm bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Pronto para entregar com excelência?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
            Orçamento gratuito em até 2 horas. Mentores da sua área, preço justo e originalidade
            garantida — a consultoria que estudantes de todo o Brasil recomendam.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-surface-900 shadow-xl transition hover:brightness-105"
            >
              Solicitar orçamento grátis
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver tabela de valores
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
