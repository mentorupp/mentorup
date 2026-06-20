import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import MentorUpLogo from "@/components/MentorUpLogo";
import { stats } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-[4.5rem] pb-10 lg:pt-24 lg:pb-14">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />

      <div className="container-custom relative px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-primary-700 shadow-sm backdrop-blur-sm">
              <Sparkles size={13} className="text-primary-500" />
              15 créditos grátis · Referências ABNT ilimitadas
            </div>

            <h1 className="font-display max-w-xl text-[2.35rem] leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[3.25rem]">
              A plataforma acadêmica que{" "}
              <span className="text-gradient">transforma seu estudo</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-zinc-500 sm:text-base">
              IA especializada em Saúde e Psicologia & Humanas — casos clínicos, flashcards,
              pesquisa qualitativa e TCC. Consultoria humana quando precisar ir além.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/register" className="btn-primary px-7 py-3.5 text-[15px]">
                Começar grátis
                <ArrowRight size={17} />
              </Link>
              <Link href="/planos" className="btn-secondary px-7 py-3.5 text-[15px]">
                Ver planos — R$ 29/mês
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {["15 créditos grátis", "ABNT ilimitado", "Assine quando precisar"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-500"
                  >
                    <CheckCircle2 size={14} className="text-accent-500" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[420px] lg:block">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-500/20 via-transparent to-accent-500/15 blur-2xl" />
            <div className="animate-float relative card-premium overflow-hidden p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MentorUpLogo variant="icon" size="md" href={null} className="shrink-0" />
                  <div>
                    <p className="font-display text-sm font-bold">Painel MentorUp</p>
                    <p className="text-xs text-zinc-400">Engenharia Civil · 12 créditos</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-bold text-accent-600">
                  PRO
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: "Mapa Mental — Termodinâmica", pct: 100, c: "bg-accent-500" },
                  { label: "Questões PDF — Cap. 4", pct: 72, c: "bg-primary-500" },
                  { label: "Referências ABNT", pct: 100, c: "bg-primary-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-surface-50 p-3">
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-medium text-zinc-700">{item.label}</span>
                      <span className="text-zinc-400">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200/80">
                      <div className={`h-full rounded-full ${item.c}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { v: "3", l: "Mapas" },
                  { v: "12", l: "Questões" },
                  { v: "∞", l: "ABNT" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-primary-50/80 py-2 text-center">
                    <p className="font-display text-lg font-bold text-primary-600">{s.v}</p>
                    <p className="text-[10px] text-zinc-500">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-3 -right-3 card-premium px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {["A", "B", "C"].map((l) => (
                    <div
                      key={l}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[9px] font-bold text-white ring-2 ring-white"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-semibold">+2.500 alunos</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={9} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 backdrop-blur-sm sm:grid-cols-4 lg:mt-12 lg:p-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-2xl font-extrabold text-gradient lg:text-3xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
