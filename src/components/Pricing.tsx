import { Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  consultancyPackages,
  platformPlans,
  servicePriceCategories,
  servicePrices,
} from "@/lib/data";
import SectionHeader from "./SectionHeader";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function Pricing({ hideHeader = false }: { hideHeader?: boolean }) {
  const categories = ["rapido", "entrega", "projeto", "tcc"] as const;

  return (
    <section className="section-padding bg-[#f8f9fb]">
      <div className="container-custom">
        {!hideHeader && (
          <SectionHeader
          label="Planos & Valores"
          title={
            <>
              Preços pensados para o{" "}
              <span className="text-gradient">bolso do estudante</span>
            </>
          }
          description="Ferramentas IA a partir de R$ 0. Consultoria humana a partir de R$ 22 — sem pacotes de R$ 600+."
          />
        )}

        {/* Plataforma IA */}
        <div className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-surface-900">
                Plataforma IA
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Assinatura mensal · cancele quando quiser
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {platformPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-5 transition-all hover:-translate-y-0.5 ${
                  plan.popular
                    ? "border-primary-300 bg-white shadow-lg shadow-primary-500/10"
                    : "card-premium"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-3 py-0.5 text-[11px] font-bold text-white">
                    Mais popular
                  </span>
                )}

                <h4 className="font-display font-bold">{plan.name}</h4>
                <p className="mt-0.5 text-xs text-zinc-500">{plan.description}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>

                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-600"
                    >
                      <Check size={15} className="mt-0.5 shrink-0 text-accent-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-5 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    plan.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela consultoria avulsa */}
        <div className="mb-14">
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-surface-900">
              Consultoria humana — por serviço
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Valor fixo · 1 revisão inclusa · PIX ou cartão em até 6x
            </p>
          </div>

          <div className="card-premium overflow-hidden">
            {categories.map((cat, catIndex) => {
              const items = servicePrices.filter((s) => s.category === cat);
              return (
                <div key={cat}>
                  {catIndex > 0 && <div className="border-t border-zinc-100" />}
                  <div className="bg-zinc-50/80 px-4 py-2.5">
                    <span className="text-[11px] font-bold tracking-wider text-primary-600 uppercase">
                      {servicePriceCategories[cat]}
                    </span>
                  </div>
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
                        i < items.length - 1 ? "border-b border-zinc-100" : ""
                      }`}
                    >
                      <span className="text-sm font-medium text-zinc-800">
                        {item.name}
                      </span>
                      {item.price !== null ? (
                        <span className="shrink-0 font-display text-base font-bold text-primary-600">
                          {formatPrice(item.price)}
                        </span>
                      ) : (
                        <Link
                          href="/contato"
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                        >
                          <MessageCircle size={13} />
                          Orçamento grátis
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pacotes com desconto */}
        <div>
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold text-surface-900">
              Pacotes com desconto
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Combos dos serviços mais pedidos — economize até R$ 21
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {consultancyPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border p-5 ${
                  pkg.popular
                    ? "border-primary-300 bg-white shadow-md shadow-primary-500/10"
                    : "card-premium"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Mais pedido
                  </span>
                )}

                <h4 className="font-display font-bold">{pkg.name}</h4>
                <p className="mt-0.5 text-xs text-zinc-500">{pkg.description}</p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-extrabold text-primary-600">
                    {pkg.price}
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    {pkg.originalPrice}
                  </span>
                </div>

                <ul className="mt-4 flex-1 space-y-1.5">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-zinc-600"
                    >
                      <Check size={12} className="shrink-0 text-accent-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/contato" className="btn-secondary mt-4 py-2.5 text-xs">
                  Pedir este pacote
                </Link>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          * Créditos IA no plano Pro conforme uso justo. Valores de consultoria
          podem variar conforme extensão (páginas) e urgência — sempre confirmados
          antes do pagamento.
        </p>
      </div>
    </section>
  );
}
