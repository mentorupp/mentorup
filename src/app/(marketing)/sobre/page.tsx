import type { Metadata } from "next";
import About from "@/components/About";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Sobre — MentorUp",
  description: "Conheça a MentorUp — IA + mentores humanos para estudantes universitários.",
};

export default function SobrePage() {
  return (
    <>
      <PageHero
        label="Sobre"
        title={
          <>
            IA + humanos para{" "}
            <span className="text-gradient">resultados reais</span>
          </>
        }
        description="Fundada por ex-coordenadores acadêmicos. Mais de 150 mentores e 200+ instituições."
      />
      <About hideHeader />
    </>
  );
}
