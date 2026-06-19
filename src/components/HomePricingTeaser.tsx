import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Grátis",
    price: "R$ 0",
    note: "Plataforma IA",
    highlights: ["15 créditos/mês", "ABNT ilimitado"],
  },
  {
    name: "Estudante",
    price: "R$ 29",
    note: "/mês · IA",
    highlights: ["150 créditos/mês", "Todas as áreas"],
    popular: true,
  },
  {
    name: "Consultoria",
    price: "R$ 22",
    note: "a partir de",
    highlights: ["Por serviço", "Pacotes a partir de R$ 45"],
  },
];

export default function HomePricingTeaser() {
  return (
    <section className="section-padding-sm bg-[#f8f9fb]">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <span className="section-label">Valores</span>
          <h2 className="section-title mt-2">Acessível para o bolso do estudante</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-500">
            IA grátis para começar. Consultoria com preço fixo — sem planos de R$ 600+.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-5 ${
                tier.popular
                  ? "border-primary-300 bg-white shadow-md shadow-primary-500/10"
                  : "card-premium"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  Popular
                </span>
              )}
              <p className="text-sm font-semibold text-zinc-600">{tier.name}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-2xl font-extrabold">{tier.price}</span>
                <span className="text-xs text-zinc-400">{tier.note}</span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {tier.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-zinc-600">
                    <Check size={13} className="shrink-0 text-accent-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/planos" className="btn-secondary text-sm">
            Ver tabela completa de valores
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
