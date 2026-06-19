import type { Metadata } from "next";
import PlanosShowcase from "@/components/PlanosShowcase";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Planos & Valores — MentorUp",
  description:
    "Plataforma IA grátis, plano Estudante R$ 29/mês, consultoria humana por serviço a partir de R$ 22. Preços fixos, prazos claros.",
};

export default function PlanosPage() {
  return (
    <>
      <PageHero
        label="Planos & Valores"
        title={
          <>
            Preços claros para o{" "}
            <span className="text-gradient">bolso do estudante</span>
          </>
        }
        description="IA a partir de R$ 0. Consultoria com valor fixo, prazo e escopo definidos — sem pacotes de R$ 600+."
      />
      <PlanosShowcase />
    </>
  );
}
