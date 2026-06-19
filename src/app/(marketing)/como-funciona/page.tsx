import type { Metadata } from "next";
import ComoFuncionaShowcase from "@/components/ComoFuncionaShowcase";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Como Funciona — MentorUp",
  description:
    "Entenda como usar a plataforma IA e a consultoria humana: passo a passo, quando usar cada um e respostas às dúvidas mais comuns.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero
        label="Como funciona"
        title={
          <>
            Simples de entender,{" "}
            <span className="text-gradient">fácil de usar</span>
          </>
        }
        description="IA para o dia a dia ou mentor humano para entregas importantes — veja exatamente como cada caminho funciona."
      />
      <ComoFuncionaShowcase />
    </>
  );
}
