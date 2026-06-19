import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-8 py-16 text-center sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Pronto para alcançar a excelência acadêmica?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Junte-se a mais de 2.500 estudantes que confiaram na MentorUp.
              Orçamento gratuito, resposta em até 2 horas.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#contato"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-600 shadow-xl transition-all hover:shadow-2xl hover:brightness-105"
              >
                Solicitar orçamento grátis
                <ArrowRight size={18} />
              </Link>
              <Link
                href={`https://wa.me/5511999998888?text=Olá! Quero saber mais sobre a MentorUp.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                Falar no WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
