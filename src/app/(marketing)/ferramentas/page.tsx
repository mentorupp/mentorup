import type { Metadata } from "next";
import FerramentasShowcase from "@/components/FerramentasShowcase";
import PageHero from "@/components/PageHero";
import { areas, tools } from "@/lib/tools-config";

const totalTools = tools.length + areas.reduce((n, a) => n + a.tools.length, 0);

export const metadata: Metadata = {
  title: "Ferramentas IA — MentorUp",
  description:
    "Ferramentas de IA para Saúde e Psicologia & Humanas: mapas mentais, flashcards, casos clínicos, codificação qualitativa, TCC e mais.",
};

export default function FerramentasPage() {
  return (
    <>
      <PageHero
        label="Plataforma IA"
        title={
          <>
            <span className="text-gradient">{totalTools}+ ferramentas</span> para Saúde e Humanas
          </>
        }
        description="Do caso clínico ao fichamento, do plano NANDA ao roteiro de entrevista — feito para quem estuda e cuida de pessoas."
      />
      <FerramentasShowcase />
    </>
  );
}
