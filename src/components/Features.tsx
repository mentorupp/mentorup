import Link from "next/link";
import { tools } from "@/lib/tools-config";
import { ArrowRight, Brain, GitBranch, Sparkles, Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";

const highlights = [
  {
    icon: GitBranch,
    title: "Mapa Mental IA",
    description: "Transforme PDFs em mapas interativos com nós expandíveis.",
    className: "sm:col-span-2 lg:row-span-1",
    featured: true,
  },
  {
    icon: Brain,
    title: "Questões sobre PDF",
    description: "Provas com gabarito comentado do seu material.",
    className: "",
  },
  {
    icon: Sparkles,
    title: "Referências ABNT",
    description: "Ilimitadas e gratuitas — sempre.",
    className: "",
  },
  {
    icon: Zap,
    title: "8 Áreas do Conhecimento",
    description: "Saúde e Psicologia & Humanas — casos clínicos, pesquisa qualitativa e TCC.",
    className: "sm:col-span-2",
  },
];

export default function Features({ hideHeader = false }: { hideHeader?: boolean }) {
  const coreTools = tools.filter((t) => t.category === "core");

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {!hideHeader && (
          <SectionHeader
          label="Plataforma IA"
          title={
            <>
              Tudo para estudar e produzir{" "}
              <span className="text-gradient">em um só lugar</span>
            </>
          }
          description="15 créditos mensais grátis. Sem cartão. Comece em segundos."
          />
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`card-premium group p-5 transition hover:border-primary-200/80 hover:shadow-md ${item.className} ${item.featured ? "bg-gradient-to-br from-primary-50/50 to-white" : ""}`}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-base font-bold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {coreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href="/register"
                className="group flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-surface-50/50 px-3 py-2.5 transition hover:border-primary-200 hover:bg-white hover:shadow-sm"
              >
                <Icon size={15} className="shrink-0 text-primary-600" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-zinc-800">{tool.name}</p>
                  <p className="text-[10px] text-zinc-400">
                    {tool.freeUnlimited ? "Grátis" : `${tool.credits} cr`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/register" className="btn-primary">
            Criar conta grátis
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
