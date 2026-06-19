import type { Metadata } from "next";
import CTA from "@/components/CTA";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Consultoria Acadêmica — MentorUp",
  description:
    "TCC, estágio, relatórios e artigos com mentores especialistas. Valores a partir de R$ 22.",
};

export default function ConsultoriaPage() {
  return (
    <>
      <PageHero
        label="Consultoria humana"
        title={
          <>
            Mentoria para{" "}
            <span className="text-gradient">entregas que importam</span>
          </>
        }
        description="Especialistas de mestrado e doutorado. Preço fixo por serviço — TCC com orçamento gratuito por etapa."
      />
      <Services hideHeader />
      <CTA />
    </>
  );
}
