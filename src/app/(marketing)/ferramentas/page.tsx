import type { Metadata } from "next";
import Features from "@/components/Features";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Ferramentas IA — MentorUp",
  description:
    "Mapas mentais, questões de PDF, flashcards, referências ABNT e ferramentas por área. 15 créditos grátis por mês.",
};

export default function FerramentasPage() {
  return (
    <>
      <PageHero
        label="Plataforma IA"
        title={
          <>
            Ferramentas de IA para{" "}
            <span className="text-gradient">estudar melhor</span>
          </>
        }
        description="Tudo que você precisa no dia a dia acadêmico — comece grátis, sem cartão."
      />
      <Features hideHeader />
    </>
  );
}
