import { differentials } from "@/lib/data";

export default function About() {
  return (
    <section id="sobre" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase">
              Sobre a MentorUp
            </span>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Transformamos a vida acadêmica de{" "}
              <span className="text-gradient">milhares de estudantes</span>
            </h2>
            <p className="mt-5 leading-relaxed text-zinc-600">
              Fundada em 2019 por ex-coordenadores acadêmicos e pesquisadores,
              a MentorUp nasceu da missão de democratizar o acesso à consultoria
              acadêmica de qualidade. Acreditamos que todo estudante merece
              orientação profissional para alcançar seu potencial máximo.
            </p>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Nossa equipe reúne mais de 150 mentores com mestrado e doutorado
              em diversas áreas do conhecimento. Já ajudamos alunos de mais de
              200 instituições de ensino em todo o Brasil a conquistarem notas
              excelentes e aprovações em bancas.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {differentials.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-surface-200 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50"
                  >
                    <Icon size={20} className="text-primary-600" />
                    <h4 className="mt-2 text-sm font-bold text-surface-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-1">
              <div className="rounded-[22px] bg-white p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "6+", label: "Anos de experiência" },
                    { value: "200+", label: "Instituições atendidas" },
                    { value: "80+", label: "Cursos cobertos" },
                    { value: "24/7", label: "Suporte disponível" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-surface-50 p-5 text-center"
                    >
                      <p className="font-display text-3xl font-extrabold text-primary-600">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs font-medium text-zinc-500">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5">
                  <p className="text-sm leading-relaxed text-primary-800 italic">
                    &ldquo;Nossa missão é simples: nenhum estudante deve
                    desistir do sonho de se formar por falta de orientação
                    adequada.&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-primary-700">
                    — Equipe Fundadora, MentorUp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
