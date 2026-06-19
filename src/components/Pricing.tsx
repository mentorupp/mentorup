import { Check } from "lucide-react";
import Link from "next/link";
import { pricingPlans } from "@/lib/data";

export default function Pricing() {
  return (
    <section id="planos" className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase">
            Planos & Investimento
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Escolha o plano ideal para{" "}
            <span className="text-gradient">seu momento</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Valores transparentes e personalizados conforme complexidade. Orçamento
            gratuito e sem compromisso.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary-300 bg-gradient-to-b from-primary-50 to-white shadow-xl shadow-primary-500/10"
                  : "border-surface-200 bg-white hover:border-primary-200 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                  Mais escolhido
                </span>
              )}

              <div>
                <h3 className="font-display text-xl font-bold text-surface-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
              </div>

              <div className="mt-6">
                <span className="text-sm text-zinc-500">{plan.period}</span>
                <p className="font-display text-4xl font-extrabold text-surface-900">
                  {plan.price}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-zinc-600"
                  >
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        plan.popular ? "text-primary-600" : "text-accent-500"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="#contato"
                className={`mt-8 block rounded-xl py-3.5 text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:brightness-110"
                    : "border border-surface-200 bg-white text-surface-800 hover:border-primary-200 hover:bg-primary-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          * Valores de referência. O orçamento final depende da complexidade,
          prazo e volume do trabalho. Consulte-nos para proposta personalizada.
        </p>
      </div>
    </section>
  );
}
