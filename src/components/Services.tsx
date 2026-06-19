import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section id="servicos" className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase">
            Nossos Serviços
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Tudo que você precisa para{" "}
            <span className="text-gradient">arrasar na faculdade</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Oferecemos consultoria completa em todas as etapas da sua vida
            acadêmica, com mentores especializados em mais de 80 cursos.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  service.highlight
                    ? "border-primary-200 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-500/5"
                    : "border-surface-200 bg-white hover:border-primary-200 hover:shadow-primary-500/5"
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

                <h3 className="font-display text-lg font-bold text-surface-900">
                  {service.title}
                </h3>
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
                  href="#contato"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  Solicitar orçamento
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
