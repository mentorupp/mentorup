import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "FAQ — MentorUp",
  description: "Perguntas frequentes sobre a plataforma IA, consultoria acadêmica e pagamentos.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        label="FAQ"
        title={<>Perguntas frequentes</>}
        description="Tudo que você precisa saber antes de começar."
      />
      <FAQ hideHeader />
    </>
  );
}
