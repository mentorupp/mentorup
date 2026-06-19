import { steps } from "@/lib/data";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-padding bg-surface-50">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase">
            Como Funciona
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Simples, rápido e{" "}
            <span className="text-gradient">100% personalizado</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Em quatro passos você sai da dúvida para a entrega finalizada com
            qualidade profissional.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute top-1/2 right-0 left-0 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary-200 via-primary-400 to-accent-400 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative text-center">
                  <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30">
                    <Icon size={24} />
                  </div>
                  <span className="font-display text-xs font-bold tracking-widest text-primary-400 uppercase">
                    Passo {item.step}
                  </span>
                  <h3 className="font-display mt-2 text-lg font-bold text-surface-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
