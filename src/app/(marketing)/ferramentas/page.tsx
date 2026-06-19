import type { Metadata } from "next";
import FerramentasShowcase from "@/components/FerramentasShowcase";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Ferramentas IA — MentorUp",
  description:
    "Mais de 39 ferramentas de IA para estudantes: mapas mentais, questões, flashcards, ABNT e ferramentas por área do conhecimento.",
};

export default function FerramentasPage() {
  return (
    <>
      <PageHero
        label="Plataforma IA"
        title={
          <>
            Mais de{" "}
            <span className="text-gradient">39 ferramentas</span> para você
          </>
        }
        description="Do PDF ao mapa mental, da prova simulada ao relatório de estágio — tudo pensado para a vida real da faculdade."
      />
      <FerramentasShowcase />
    </>
  );
}
