import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="section-padding-sm pb-14 lg:pb-16">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-6 py-12 text-center sm:px-10 lg:py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Comece hoje com 15 créditos grátis
            </h2>
            <p className="mt-3 text-sm text-primary-100 sm:text-base">
              Junte-se a +2.500 estudantes. Sem cartão, sem compromisso.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-lg transition-all hover:brightness-105"
              >
                Criar conta grátis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="https://wa.me/5511999998888?text=Olá! Quero saber mais sobre a MentorUp."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
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
