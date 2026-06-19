import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Planos & Valores — MentorUp",
  description:
    "Plataforma IA grátis, plano Estudante R$ 29/mês e consultoria humana a partir de R$ 22.",
};

export default function PlanosPage() {
  return (
    <>
      <PageHero
        label="Planos & Valores"
        title={
          <>
            Preços pensados para o{" "}
            <span className="text-gradient">bolso do estudante</span>
          </>
        }
        description="IA a partir de R$ 0. Consultoria com valor fixo — sem surpresas."
      />
      <Pricing hideHeader />
    </>
  );
}
