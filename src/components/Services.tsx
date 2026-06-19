import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/data";
import SectionHeader from "./SectionHeader";

export default function Services() {
  return (
    <section id="servicos" className="section-padding border-t border-zinc-200/60 bg-white">
      <div className="container-custom">
        <SectionHeader
          label="Consultoria humana"
          title={
            <>
              Mentoria especializada para{" "}
              <span className="text-gradient">entregas que importam</span>
            </>
          }
          description="Preços a partir de R$ 22. TCC por etapa com orçamento gratuito."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  service.highlight
                    ? "border-primary-200 bg-gradient-to-br from-primary-50/60 to-white shadow-sm"
                    : "card-premium hover:border-primary-200/80"
                }`}
              >
                {service.highlight && (
                  <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-3 py-1 text-xs font-semibold text-white">
                    Mais popular
                  </span>
                )}

                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    service.highlight
                      ? "bg-primary-600 text-white"
                      : "bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-surface-900">
                    {service.title}
                  </h3>
                  {(service.priceFrom || service.priceNote) && (
                    <span className="shrink-0 rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                      {service.priceFrom
                        ? `a partir de ${service.priceFrom}`
                        : service.priceNote}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {service.features.slice(0, 3).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-600"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 shrink-0 text-accent-500"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="#planos"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  Ver valores
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
