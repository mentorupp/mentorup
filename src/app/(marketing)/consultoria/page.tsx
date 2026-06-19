import type { Metadata } from "next";
import ConsultoriaShowcase from "@/components/ConsultoriaShowcase";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Consultoria Acadêmica — MentorUp",
  description:
    "TCC, estágio, relatórios e artigos com mentores especialistas. 98% de aprovação, preços transparentes a partir de R$ 22.",
};

export default function ConsultoriaPage() {
  return (
    <>
      <PageHero
        label="Consultoria humana"
        title={
          <>
            A consultoria acadêmica{" "}
            <span className="text-gradient">referência do Brasil</span>
          </>
        }
        description="Mentores de mestrado e doutorado. Preço fixo, originalidade garantida e suporte real — do fichamento ao TCC."
      />
      <ConsultoriaShowcase />
    </>
  );
}
