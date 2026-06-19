import type { Metadata } from "next";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contato — MentorUp",
  description: "Fale com a MentorUp. Orçamento gratuito e resposta em até 2 horas úteis.",
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        label="Contato"
        title={
          <>
            Fale com a gente em{" "}
            <span className="text-gradient">minutos</span>
          </>
        }
        description="Orçamento gratuito. Resposta em até 2 horas úteis."
      />
      <Contact hideHeader />
    </>
  );
}
