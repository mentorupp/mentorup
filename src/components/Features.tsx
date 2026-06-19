import Link from "next/link";
import { tools } from "@/lib/tools-config";
import {
  ArrowRight,
  Brain,
  GitBranch,
  Sparkles,
  Zap,
} from "lucide-react";

const highlights = [
  {
    icon: GitBranch,
    title: "Mapa Mental IA",
    description: "PDF ou texto → mapa interativo com nós expandíveis e modo prova.",
  },
  {
    icon: Brain,
    title: "Questões sobre PDF",
    description: "Gere provas com gabarito comentado a partir do seu material.",
  },
  {
    icon: Sparkles,
    title: "Referências ABNT Grátis",
    description: "Gere referências bibliográficas corretas sem gastar créditos.",
  },
  {
    icon: Zap,
    title: "8 Áreas do Conhecimento",
    description: "Ferramentas especializadas para saúde, engenharia, direito e mais.",
  },
];

export default function Features() {
  const coreTools = tools.filter((t) => t.category === "core").slice(0, 8);

  return (
    <section id="ferramentas" className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase">
            Plataforma IA
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Ferramentas que{" "}
            <span className="text-gradient">transformam seu estudo</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Teste grátis com 15 créditos mensais. Referências ABNT ilimitadas.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-surface-200 p-5 transition hover:border-primary-200 hover:shadow-lg"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href="/register"
                className="group flex items-center gap-3 rounded-xl border border-surface-200 p-4 transition hover:border-primary-200 hover:bg-primary-50/50"
              >
                <Icon size={18} className="text-primary-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-surface-900">{tool.name}</p>
                  <p className="text-xs text-zinc-500">
                    {tool.freeUnlimited ? "Grátis" : `${tool.credits} cr`}
                  </p>
                </div>
                <ArrowRight size={14} className="text-zinc-300 transition group-hover:text-primary-600" />
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary-500/25 transition hover:brightness-110"
          >
            Criar conta grátis — 15 créditos
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
