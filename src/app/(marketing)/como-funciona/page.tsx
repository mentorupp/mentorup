import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Como Funciona — MentorUp",
  description: "Entenda como usar a plataforma IA e como funciona a consultoria humana na MentorUp.",
};

const iaSteps = [
  { step: "01", title: "Crie sua conta grátis", desc: "15 créditos/mês, ABNT ilimitado, sem cartão." },
  { step: "02", title: "Escolha a ferramenta", desc: "Mapa mental, questões, flashcards ou ferramenta da sua área." },
  { step: "03", title: "Cole o material", desc: "Texto, PDF (.txt) ou conteúdo da aula — a IA processa em segundos." },
  { step: "04", title: "Use e salve", desc: "Resultado no painel, histórico automático e exportação." },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero
        label="Como funciona"
        title={
          <>
            Simples de usar,{" "}
            <span className="text-gradient">do início ao resultado</span>
          </>
        }
        description="Dois caminhos: IA self-service no painel ou consultoria com mentor humano."
      />

      <section className="section-padding border-t border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Plataforma IA</h2>
              <p className="text-sm text-zinc-500">Em 4 passos, no seu ritmo</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {iaSteps.map((item) => (
              <div key={item.step} className="card-premium p-5">
                <span className="font-display text-2xl font-extrabold text-primary-200">
                  {item.step}
                </span>
                <h3 className="font-display mt-2 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/register" className="btn-primary text-sm">
              Criar conta grátis
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks hideHeader />
    </>
  );
}
