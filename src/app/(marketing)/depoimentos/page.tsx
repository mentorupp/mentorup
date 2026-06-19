import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Depoimentos — MentorUp",
  description: "Histórias reais de estudantes que usam a MentorUp em universidades de todo o Brasil.",
};

export default function DepoimentosPage() {
  return (
    <>
      <PageHero
        label="Depoimentos"
        title={
          <>
            Aprovado por quem{" "}
            <span className="text-gradient">usa todo dia</span>
          </>
        }
        description="Histórias reais de graduandos em USP, UFMG, PUC e mais."
      />
      <Testimonials hideHeader />
    </>
  );
}
