import {
  ArrowRight,
  CheckCircle2,
  Play,
  Star,
} from "lucide-react";
import Link from "next/link";
import { stats } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100/20 blur-3xl" />
      </div>

      <div className="container-custom relative px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
              <Star size={14} className="fill-primary-500 text-primary-500" />
              Consultoria acadêmica #1 do Brasil
            </div>

            <h1 className="font-display text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Sua jornada acadêmica com{" "}
              <span className="text-gradient">mentoria de excelência</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              TCC, estágio, relatórios, artigos e muito mais. A MentorUp
              conecta você a especialistas que transformam desafios acadêmicos
              em conquistas — com qualidade, prazo e total originalidade.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#contato"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-500/25 transition-all hover:shadow-2xl hover:shadow-primary-500/30 hover:brightness-110"
              >
                Começar agora
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white px-7 py-3.5 text-base font-semibold text-surface-800 transition-all hover:border-primary-200 hover:bg-primary-50"
              >
                <Play size={18} className="text-primary-600" />
                Ver serviços
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                "Originalidade garantida",
                "Mentores especialistas",
                "Suporte 7 dias/semana",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 size={16} className="text-accent-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="animate-float relative mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl shadow-primary-500/10 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-lg font-bold text-white">
                    M
                  </div>
                  <div>
                    <p className="font-display font-bold text-surface-900">
                      MentorUp
                    </p>
                    <p className="text-sm text-zinc-500">
                      Consultoria Acadêmica
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "TCC — Metodologia", progress: 85, color: "bg-primary-500" },
                    { label: "Revisão ABNT", progress: 100, color: "bg-accent-500" },
                    { label: "Slides — Defesa", progress: 60, color: "bg-primary-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-medium text-surface-800">
                          {item.label}
                        </span>
                        <span className="text-zinc-500">{item.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-100">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-primary-50 p-4">
                  <div>
                    <p className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                      Próxima entrega
                    </p>
                    <p className="font-display text-lg font-bold text-surface-900">
                      Capítulo 3 — Resultados
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {["CR", "RM", "JF"].map((initials) => (
                      <div
                        key={initials}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-[10px] font-bold text-white ring-2 ring-white"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-900">
                      +2.500 alunos
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3 shadow-lg">
                <p className="text-2xl font-bold text-accent-600">98%</p>
                <p className="text-xs font-medium text-accent-700">
                  Taxa de aprovação
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-surface-200 pt-12 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-3xl font-extrabold text-gradient lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
