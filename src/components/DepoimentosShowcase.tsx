"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { testimonialStats, testimonials, type Testimonial } from "@/lib/data";
import { cn } from "@/lib/utils";

type Filter = "todos" | "consultoria" | "ia" | "ambos";

const filters: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "consultoria", label: "Consultoria" },
  { id: "ia", label: "Plataforma IA" },
  { id: "ambos", label: "IA + Consultoria" },
];

const typeLabels: Record<Testimonial["type"], string> = {
  consultoria: "Consultoria humana",
  ia: "Plataforma IA",
  ambos: "IA + Consultoria",
};

const universities = [
  "USP", "UNICAMP", "UFMG", "UFRJ", "UFPR", "UFPE", "UFBA",
  "UNIFESP", "PUC-Rio", "Estácio", "UFRGS", "UFSC", "UnB",
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

function TypeBadge({ type }: { type: Testimonial["type"] }) {
  const isIa = type === "ia";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        isIa
          ? "bg-primary-50 text-primary-700"
          : type === "ambos"
            ? "bg-violet-50 text-violet-700"
            : "bg-accent-50 text-accent-700"
      )}
    >
      {isIa ? <Sparkles size={10} /> : <GraduationCap size={10} />}
      {typeLabels[type]}
    </span>
  );
}

function StoryCard({
  item,
  featured,
  delay,
  visible,
}: {
  item: Testimonial;
  featured?: boolean;
  delay: number;
  visible: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-500",
        featured
          ? "border-primary-200 shadow-lg shadow-primary-500/8 lg:col-span-2"
          : "border-zinc-200/80 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn("p-5 sm:p-6", featured && "lg:p-8")}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white",
                featured ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm"
              )}
            >
              {item.avatar}
            </div>
            <div>
              <p className="font-display font-bold text-surface-900">{item.name}</p>
              <p className="text-xs text-zinc-500">{item.course}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                <MapPin size={11} />
                {item.university} · {item.city}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <TypeBadge type={item.type} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
            {item.service}
          </span>
          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
            {item.period}
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3">
          <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            Situação
          </p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.situation}</p>
        </div>

        <blockquote
          className={cn(
            "mt-4 leading-relaxed text-zinc-700",
            featured ? "text-base sm:text-lg" : "text-sm"
          )}
        >
          &ldquo;{item.text}&rdquo;
        </blockquote>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent-200/60 bg-accent-50/50 px-4 py-3">
          <Trophy size={16} className="mt-0.5 shrink-0 text-accent-600" />
          <div>
            <p className="text-[11px] font-bold tracking-wider text-accent-700 uppercase">
              Resultado
            </p>
            <p className="mt-0.5 text-sm font-semibold text-surface-900">{item.outcome}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DepoimentosShowcase() {
  const [filter, setFilter] = useState<Filter>("todos");
  const stats = useInView();
  const grid = useInView();

  const featured = testimonials.find((t) => t.featured)!;
  const filtered =
    filter === "todos"
      ? testimonials.filter((t) => !t.featured)
      : testimonials.filter((t) => !t.featured && t.type === filter);

  return (
    <div className="overflow-hidden">
      {/* Stats */}
      <section className="section-padding-sm border-b border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={stats.ref}
            className={cn(
              "grid grid-cols-2 gap-3 lg:grid-cols-4 transition-all duration-700",
              stats.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            {testimonialStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-200/80 bg-gradient-to-br from-white to-primary-50/20 p-4 text-center"
              >
                <p className="font-display text-2xl font-extrabold text-gradient sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p
            className={cn(
              "mt-5 text-center text-xs leading-relaxed text-zinc-400 transition-all duration-700 delay-150",
              stats.visible ? "opacity-100" : "opacity-0"
            )}
          >
            Depoimentos de clientes reais. Nomes, cursos e universidades confirmados no atendimento.
          </p>
        </div>
      </section>

      {/* Universidades */}
      <section className="border-b border-zinc-200/60 bg-[#fafbfc] py-4">
        <div className="container-custom">
          <p className="mb-3 text-center text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            Estudantes de todo o Brasil
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {universities.map((u) => (
              <span key={u} className="text-xs font-semibold text-zinc-500">
                {u}
              </span>
            ))}
            <span className="text-xs font-semibold text-primary-600">+120 instituições</span>
          </div>
        </div>
      </section>

      {/* Featured story */}
      <section className="section-padding-sm bg-white">
        <div className="container-custom">
          <div className="mb-5">
            <span className="section-label">Destaque</span>
            <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
              História completa
            </h2>
          </div>
          <StoryCard item={featured} featured visible={stats.visible} delay={0} />
        </div>
      </section>

      {/* Filter + grid */}
      <section className="section-padding-sm border-t border-zinc-200/60 bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={grid.ref}
            className={cn(
              "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between transition-all duration-700",
              grid.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <div>
              <span className="section-label">Mais histórias</span>
              <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
                Casos por tipo de serviço
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Cada depoimento inclui contexto, o que foi feito e o resultado concreto.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    filter === f.id
                      ? "bg-primary-600 text-white shadow-sm"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-primary-200"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((item, i) => (
              <StoryCard
                key={item.id}
                item={item}
                visible={grid.visible}
                delay={i * 60}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-zinc-500">
              Nenhum depoimento nesta categoria ainda.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Quer ser o próximo caso de sucesso?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Comece grátis com a IA ou peça um orçamento de consultoria — sem compromisso.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-surface-900 shadow-xl transition hover:brightness-105"
            >
              Criar conta grátis
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Solicitar consultoria
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
