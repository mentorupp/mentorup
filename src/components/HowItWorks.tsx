import { steps } from "@/lib/data";
import SectionHeader from "./SectionHeader";

export default function HowItWorks({
  hideHeader = false,
  label = "Consultoria humana",
  title = (
    <>
      Do pedido à{" "}
      <span className="text-gradient">entrega final</span>
    </>
  ),
  description = "Quatro passos. Sem complicação.",
}: {
  hideHeader?: boolean;
  label?: string;
  title?: React.ReactNode;
  description?: string;
}) {
  return (
    <section className="section-padding bg-[#f8f9fb]">
      <div className="container-custom">
        {!hideHeader && (
          <SectionHeader
            label={label}
            title={title}
            description={description}
          />
        )}
        {hideHeader && (
          <div className="mb-8">
            <span className="section-label">{label}</span>
            <h2 className="section-title mt-2">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-zinc-500">{description}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="card-premium relative p-5">
                <span className="absolute top-4 right-4 font-display text-3xl font-black text-primary-100">
                  {item.step}
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-sm font-bold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.description}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-primary-200 lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
