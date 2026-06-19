import { differentials } from "@/lib/data";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section id="sobre" className="section-padding bg-[#f8f9fb]">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeader
              align="left"
              label="Sobre"
              title={
                <>
                  IA + humanos para{" "}
                  <span className="text-gradient">resultados reais</span>
                </>
              }
              description="Fundada por ex-coordenadores acadêmicos. Mais de 150 mentores especialistas e 200+ instituições atendidas."
              className="mb-6"
            />

            <div className="grid grid-cols-2 gap-3">
              {differentials.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-premium p-4">
                    <Icon size={18} className="text-primary-600" />
                    <h4 className="mt-2 text-sm font-bold">{item.title}</h4>
                    <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-premium overflow-hidden p-1">
            <div className="rounded-[14px] bg-gradient-to-br from-primary-600 to-accent-500 p-6 text-white">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "6+", label: "Anos" },
                  { value: "200+", label: "Instituições" },
                  { value: "80+", label: "Cursos" },
                  { value: "24/7", label: "Suporte" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/15 p-4 text-center backdrop-blur-sm">
                    <p className="font-display text-2xl font-extrabold">{item.value}</p>
                    <p className="text-xs text-white/80">{item.label}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-relaxed text-white/90">
                &ldquo;Nenhum estudante deve desistir de se formar por falta de orientação adequada.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
