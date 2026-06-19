"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Brain,
  Calculator,
  FlaskConical,
  GitBranch,
  Layers,
  PenLine,
  Scale,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import { areas, tools } from "@/lib/tools-config";
import { cn } from "@/lib/utils";

const coreTools = tools.filter((t) => t.category === "core");
const premiumTools = tools.filter((t) => t.category === "premium");
const areaToolCount = areas.reduce((n, a) => n + a.tools.length, 0);
const totalTools = tools.length + areaToolCount;

const areaIcons: Record<string, typeof Brain> = {
  saude: Stethoscope,
  "psicologia-humanas": Brain,
  engenharia: Calculator,
  direito: Scale,
  administracao: Zap,
  biologicas: FlaskConical,
  comunicacao: PenLine,
  arquitetura: Layers,
};

function useInView(threshold = 0.12) {
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

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const total = 40;
    const tick = () => {
      frame++;
      setCount(Math.round((target * frame) / total));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function ToolCard({
  name,
  description,
  icon: Icon,
  popular,
  freeUnlimited,
  featured,
  delay,
  visible,
}: {
  name: string;
  description: string;
  icon: typeof GitBranch;
  popular?: boolean;
  freeUnlimited?: boolean;
  featured?: boolean;
  delay: number;
  visible: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 transition-all duration-500",
        "hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        featured && "sm:col-span-2 lg:row-span-1 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/30"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary-500/5 transition-transform duration-700 group-hover:scale-150" />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-all duration-300",
            "bg-gradient-to-br from-primary-500 to-primary-600 text-white",
            "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/30"
          )}
        >
          <Icon size={22} />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {popular && (
            <span className="rounded-full bg-primary-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
              Popular
            </span>
          )}
          {freeUnlimited && (
            <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-[10px] font-bold text-accent-700 uppercase">
              Grátis
            </span>
          )}
        </div>
      </div>

      <h3 className="font-display relative mt-4 text-lg font-bold text-surface-900">{name}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>

      <Link
        href="/register"
        className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        Experimentar grátis
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function FerramentasShowcase() {
  const hero = useInView(0.05);
  const essentials = useInView();
  const premium = useInView();
  const areasSection = useInView();
  const [activeArea, setActiveArea] = useState(areas[0].slug);

  const selectedArea = areas.find((a) => a.slug === activeArea) ?? areas[0];

  return (
    <div className="overflow-hidden">
      {/* Stats */}
      <section className="section-padding-sm border-b border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={hero.ref}
            className={cn(
              "grid gap-4 sm:grid-cols-3 transition-all duration-700",
              hero.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {[
              { value: tools.length, label: "Ferramentas principais", sub: "Estudo e produção", suffix: "" },
              { value: areaToolCount, label: "Ferramentas por área", sub: "Especializadas no seu curso", suffix: "" },
              { value: totalTools, label: "Total na plataforma", sub: "E crescendo", suffix: "+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-primary-50/20 p-6 text-center"
              >
                <p className="font-display text-4xl font-extrabold text-gradient">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-800">{stat.label}</p>
                <p className="text-xs text-zinc-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Essenciais — bento */}
      <section className="section-padding bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={essentials.ref}
            className={cn(
              "mb-10 transition-all duration-700",
              essentials.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Essenciais</span>
            <h2 className="section-title mt-2">Para o dia a dia da faculdade</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Mapas, questões, resumos, flashcards e referências — tudo que você usa toda semana.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreTools.map((tool, i) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                popular={tool.popular}
                freeUnlimited={tool.freeUnlimited}
                featured={tool.popular && i < 2}
                delay={i * 60}
                visible={essentials.visible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Avançadas */}
      <section className="section-padding border-y border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={premium.ref}
            className={cn(
              "mb-10 transition-all duration-700",
              premium.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Avançadas</span>
            <h2 className="section-title mt-2">Quando a prova ou o TCC aperta</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Simulados completos e estudos de caso com metodologia acadêmica.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {premiumTools.map((tool, i) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                featured
                delay={i * 80}
                visible={premium.visible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Por área — interactive */}
      <section className="section-padding bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={areasSection.ref}
            className={cn(
              "mb-10 transition-all duration-700",
              areasSection.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <span className="section-label">Por área do conhecimento</span>
            <h2 className="section-title mt-2">
              <span className="text-gradient">{areaToolCount}+ ferramentas</span> do seu curso
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Saúde, engenharia, direito, humanas e mais — cada área com ferramentas feitas para
              aquela disciplina.
            </p>
          </div>

          <div
            className={cn(
              "grid gap-6 lg:grid-cols-[280px_1fr] transition-all duration-700 delay-150",
              areasSection.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {areas.map((area) => {
                const Icon = areaIcons[area.slug] ?? Sparkles;
                const active = activeArea === area.slug;
                return (
                  <button
                    key={area.slug}
                    type="button"
                    onClick={() => setActiveArea(area.slug)}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 lg:flex-none lg:w-full",
                      active
                        ? "bg-white text-primary-700 shadow-md shadow-primary-500/10 ring-1 ring-primary-200"
                        : "text-zinc-600 hover:bg-white/80 hover:text-zinc-900"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white transition-transform",
                        area.color,
                        active && "scale-110"
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{area.name}</p>
                      <p className="text-xs text-zinc-400">{area.tools.length} ferramentas</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="card-premium min-h-[320px] p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                    selectedArea.color
                  )}
                >
                  {(() => {
                    const Icon = areaIcons[selectedArea.slug] ?? Sparkles;
                    return <Icon size={26} />;
                  })()}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{selectedArea.name}</h3>
                  <p className="text-sm text-zinc-500">
                    {selectedArea.tools.length} ferramentas especializadas
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selectedArea.tools.map((tool, i) => (
                  <div
                    key={tool.id}
                    className="group rounded-xl border border-zinc-100 bg-surface-50/80 p-4 transition-all duration-300 hover:border-primary-200 hover:bg-white hover:shadow-md"
                    style={{
                      animation: areasSection.visible
                        ? `fade-up 0.5s ease-out ${i * 50}ms both`
                        : undefined,
                    }}
                  >
                    <p className="font-display text-sm font-bold text-zinc-800">{tool.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Marquee de nomes */}
          <div className="relative mt-12 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
            <div className="animate-marquee flex w-max gap-8 px-4">
              {[...tools, ...areas.flatMap((a) => a.tools.map((t) => ({ name: t.name })))].map(
                (t, i) => (
                  <span
                    key={`${t.name}-${i}`}
                    className="flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-500"
                  >
                    <Sparkles size={12} className="text-primary-400" />
                    {t.name}
                  </span>
                )
              )}
              {[...tools, ...areas.flatMap((a) => a.tools.map((t) => ({ name: t.name })))].map(
                (t, i) => (
                  <span
                    key={`dup-${t.name}-${i}`}
                    className="flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-500"
                  >
                    <Sparkles size={12} className="text-primary-400" />
                    {t.name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            {totalTools}+ ferramentas esperando por você
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-100">
            Crie sua conta grátis e use mapas mentais, questões, ABNT e ferramentas da sua área —
            sem cartão.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary-600 shadow-xl transition hover:brightness-105"
          >
            Começar grátis agora
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
