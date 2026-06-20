import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";

const products = [
  {
    href: "/ferramentas",
    icon: Sparkles,
    label: "Plataforma IA",
    title: "Estude com IA no dia a dia",
    description:
      "Mapas mentais, questões, flashcards, ABNT grátis e ferramentas para Saúde e Humanas. 15 créditos/mês sem pagar nada.",
    cta: "Ver ferramentas",
    accent: "from-primary-600 to-primary-500",
  },
  {
    href: "/consultoria",
    icon: GraduationCap,
    label: "Consultoria humana",
    title: "Mentores para entregas importantes",
    description:
      "TCC por etapa, estágio, relatórios e artigos — com especialistas. Valores a partir de R$ 22.",
    cta: "Ver consultoria",
    accent: "from-accent-600 to-accent-500",
  },
];

export default function HomeProductCards() {
  return (
    <section className="section-padding-sm bg-white">
      <div className="container-custom">
        <div className="grid gap-4 lg:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Link
                key={product.href}
                href={product.href}
                className="group card-premium flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-primary-200/80 hover:shadow-lg sm:p-8"
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${product.accent} text-white shadow-md`}
                >
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-bold tracking-wider text-primary-600 uppercase">
                  {product.label}
                </span>
                <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
                  {product.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                  {product.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5">
                  {product.cta}
                  <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
