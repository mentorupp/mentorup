import type { Metadata } from "next";
import DepoimentosShowcase from "@/components/DepoimentosShowcase";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Depoimentos — MentorUp",
  description:
    "Histórias detalhadas de estudantes da USP, UFMG, UNICAMP e mais. Contexto, serviço usado e resultado concreto em cada caso.",
};

export default function DepoimentosPage() {
  return (
    <>
      <PageHero
        label="Depoimentos"
        title={
          <>
            Histórias reais,{" "}
            <span className="text-gradient">resultados concretos</span>
          </>
        }
        description="Cada depoimento traz contexto, o que foi feito e o resultado — de TCC e estágio até flashcards e mapas mentais."
      />
      <DepoimentosShowcase />
    </>
  );
}
