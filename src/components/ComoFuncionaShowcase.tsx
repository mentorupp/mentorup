"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  GraduationCap,
  History,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Upload,
  UserPlus,
  Wrench,
  Zap,
} from "lucide-react";
import { steps } from "@/lib/data";
import { cn } from "@/lib/utils";

const paths = [
  {
    id: "ia",
    icon: Sparkles,
    label: "Plataforma IA",
    title: "Você usa, a IA entrega na hora",
    description:
      "Ideal para estudar, revisar e produzir rascunhos. Entra no painel, escolhe a ferramenta e recebe o resultado em segundos.",
    highlights: [
      "15 créditos grátis todo mês",
      "ABNT ilimitado sem custo",
      "Ferramentas por área (Saúde e Humanas)",
      "Histórico salvo no painel",
    ],
    tempo: "Segundos a minutos",
    investimento: "Grátis · planos a partir de R$ 29",
    href: "/ferramentas",
    cta: "Ver ferramentas IA",
    accent: "from-primary-600 to-primary-500",
    ring: "ring-primary-100",
  },
  {
    id: "consultoria",
    icon: GraduationCap,
    label: "Consultoria humana",
    title: "Mentor especialista conduz sua entrega",
    description:
      "Para TCC, estágio, relatórios e trabalhos completos. Um profissional da sua área acompanha do pedido à entrega final.",
    highlights: [
      "Mentores de mestrado e doutorado",
      "Preço fixo antes de começar",
      "Originalidade e anti-plágio",
      "1 revisão gratuita inclusa",
    ],
    tempo: "24h a alguns dias",
    investimento: "A partir de R$ 22",
    href: "/consultoria",
    cta: "Ver consultoria",
    accent: "from-accent-600 to-accent-500",
    ring: "ring-accent-100",
  },
];

const iaSteps = [
  {
    step: "01",
    title: "Crie sua conta grátis",
    description: "Cadastro em 30 segundos. Sem cartão, sem pegadinha.",
    detail: "Você já começa com 15 créditos/mês e ABNT ilimitado.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Escolha a ferramenta",
    description: "Mapa mental, questões, flashcards ou ferramenta da sua área.",
    detail: "Mais de 40 ferramentas para Saúde e Psicologia & Humanas.",
    icon: Wrench,
  },
  {
    step: "03",
    title: "Envie o material",
    description: "Envie PDF, Word (.docx) ou cole o texto diretamente no campo.",
    detail: "A IA processa e estrutura o conteúdo com base no seu input.",
    icon: Upload,
  },
  {
    step: "04",
    title: "Use, salve e exporte",
    description: "Resultado na tela, histórico automático no painel.",
    detail: "Copie, baixe ou volte depois — tudo fica registrado.",
    icon: History,
  },
];

const whenToUse = [
  {
    need: "Formatar referências ABNT",
    ia: "Ideal — grátis e ilimitado",
    consultoria: "Só se for monografia inteira",
  },
  {
    need: "Mapa mental ou flashcards de prova",
    ia: "Ideal — instantâneo",
    consultoria: "Não necessário",
  },
  {
    need: "TCC ou monografia completa",
    ia: "Apoio em rascunhos",
    consultoria: "Ideal — mentor dedicado",
  },
  {
    need: "Relatório de estágio pronto",
    ia: "Estrutura inicial",
    consultoria: "Ideal — entrega completa",
  },
  {
    need: "Revisão de texto curto",
    ia: "Rápido no painel",
    consultoria: "Revisão profunda ABNT",
  },
  {
    need: "Artigo científico ou TCC por etapas",
    ia: "Pesquisa e organização",
    consultoria: "Ideal — acompanhamento contínuo",
  },
];

const guarantees = [
  { icon: ShieldCheck, title: "Originalidade", text: "Anti-plágio em toda consultoria" },
  { icon: Clock, title: "Prazo combinado", text: "Cronograma claro na proposta" },
  { icon: CreditCard, title: "Preço fixo", text: "Sem taxas escondidas" },
  { icon: MessageSquare, title: "Suporte humano", text: "WhatsApp e painel" },
];

const faqQuick = [
  {
    q: "Preciso pagar para começar?",
    a: "Não. A conta grátis já inclui 15 créditos/mês e ABNT ilimitado. Consultoria só cobra se você solicitar um serviço.",
  },
  {
    q: "Posso usar IA e consultoria juntos?",
    a: "Sim — muitos alunos usam a IA no dia a dia e contratam mentores para entregas importantes como TCC e estágio.",
  },
  {
    q: "Quanto tempo demora a consultoria?",
    a: "Depende do serviço. Atividades em 24–48h; TCC e projetos maiores seguem cronograma acordado na proposta.",
  },
  {
    q: "Como recebo o material?",
    a: "Consultoria: arquivo finalizado por e-mail/WhatsApp. IA: resultado instantâneo no painel com histórico.",
  },
];

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function StepTimeline({
  items,
  visible,
  variant,
}: {
  items: typeof iaSteps | typeof steps;
  visible: boolean;
  variant: "ia" | "consultoria";
}) {
  return (
    <div className="relative">
      <div className="absolute top-8 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-accent-200 lg:block" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          const isConsultoria = "description" in item && !("detail" in item);
          const desc = isConsultoria
            ? (item as (typeof steps)[0]).description
            : (item as (typeof iaSteps)[0]).description;
          const detail = !isConsultoria ? (item as (typeof iaSteps)[0]).detail : undefined;

          return (
            <div
              key={item.step}
              className={cn(
                "relative rounded-2xl border bg-white p-5 transition-all duration-500",
                variant === "ia"
                  ? "border-primary-100 hover:border-primary-200 hover:shadow-md hover:shadow-primary-500/5"
                  : "border-accent-100 hover:border-accent-200 hover:shadow-md hover:shadow-accent-500/5",
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div
                className={cn(
                  "relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm",
                  variant === "ia"
                    ? "bg-gradient-to-br from-primary-500 to-primary-600"
                    : "bg-gradient-to-br from-accent-500 to-accent-600"
                )}
              >
                <Icon size={18} />
              </div>
              <span
                className={cn(
                  "font-display text-2xl font-black",
                  variant === "ia" ? "text-primary-100" : "text-accent-100"
                )}
              >
                {item.step}
              </span>
              <h3 className="font-display mt-1 text-sm font-bold text-surface-900">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{desc}</p>
              {detail && (
                <p className="mt-2 rounded-lg bg-zinc-50 px-2.5 py-2 text-[11px] leading-relaxed text-zinc-600">
                  {detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComoFuncionaShowcase() {
  const overview = useInView();
  const ia = useInView();
  const consult = useInView();
  const compare = useInView();
  const extra = useInView();

  return (
    <div className="overflow-hidden">
      {/* Dois caminhos — overview compacto */}
      <section className="section-padding-sm border-b border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={overview.ref}
            className={cn(
              "mb-6 text-center transition-all duration-700 sm:text-left",
              overview.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <span className="section-label">Visão geral</span>
            <h2 className="section-title mt-2 text-2xl sm:text-3xl">
              Dois caminhos,{" "}
              <span className="text-gradient">uma plataforma</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              A MentorUp combina IA para o dia a dia e mentores humanos para entregas que exigem
              profundidade. Escolha conforme sua necessidade — ou use os dois.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {paths.map((path, i) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 ring-4 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg",
                    path.ring,
                    overview.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  )}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                        path.accent
                      )}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                        {path.label}
                      </span>
                      <h3 className="font-display mt-0.5 text-lg font-bold text-surface-900">
                        {path.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                        {path.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                    {path.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-zinc-600">
                        <Check size={13} className="shrink-0 text-accent-500" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-3 border-t border-zinc-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                      <Clock size={12} className="text-primary-500" />
                      {path.tempo}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                      <CreditCard size={12} className="text-primary-500" />
                      {path.investimento}
                    </span>
                  </div>

                  <Link
                    href={path.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition group-hover:gap-2.5"
                  >
                    {path.cta}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fluxo IA */}
      <section className="section-padding-sm bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={ia.ref}
            className={cn(
              "mb-6 flex flex-col gap-4 transition-all duration-700 sm:flex-row sm:items-end sm:justify-between",
              ia.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Sparkles size={16} />
                </div>
                <span className="text-xs font-bold tracking-wider text-primary-600 uppercase">
                  Plataforma IA
                </span>
              </div>
              <h2 className="font-display text-xl font-extrabold sm:text-2xl">
                Do cadastro ao resultado em 4 passos
              </h2>
              <p className="mt-1 max-w-lg text-sm text-zinc-500">
                Self-service no painel — você controla tudo, sem esperar ninguém.
              </p>
            </div>
            <Link href="/register" className="btn-primary shrink-0 py-2.5 text-sm">
              Criar conta grátis
              <ArrowRight size={15} />
            </Link>
          </div>
          <StepTimeline items={iaSteps} visible={ia.visible} variant="ia" />
        </div>
      </section>

      {/* Fluxo Consultoria */}
      <section className="section-padding-sm border-y border-zinc-200/60 bg-white">
        <div className="container-custom">
          <div
            ref={consult.ref}
            className={cn(
              "mb-6 flex flex-col gap-4 transition-all duration-700 sm:flex-row sm:items-end sm:justify-between",
              consult.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                  <GraduationCap size={16} />
                </div>
                <span className="text-xs font-bold tracking-wider text-accent-600 uppercase">
                  Consultoria humana
                </span>
              </div>
              <h2 className="font-display text-xl font-extrabold sm:text-2xl">
                Do pedido à entrega com mentor dedicado
              </h2>
              <p className="mt-1 max-w-lg text-sm text-zinc-500">
                Orçamento grátis em até 2h. Você aprova antes de qualquer cobrança.
              </p>
            </div>
            <Link href="/contato" className="btn-secondary shrink-0 py-2.5 text-sm">
              Solicitar orçamento
              <ArrowRight size={15} />
            </Link>
          </div>
          <StepTimeline items={steps} visible={consult.visible} variant="consultoria" />
        </div>
      </section>

      {/* Quando usar cada um */}
      <section className="section-padding-sm bg-[#fafbfc]">
        <div className="container-custom">
          <div
            ref={compare.ref}
            className={cn(
              "mb-6 text-center transition-all duration-700",
              compare.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <span className="section-label">Qual escolher?</span>
            <h2 className="section-title mt-2 text-2xl sm:text-3xl">
              IA, consultoria ou os dois?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-500">
              Guia rápido para não errar na hora de decidir.
            </p>
          </div>

          <div
            className={cn(
              "card-premium overflow-hidden transition-all duration-700 delay-100",
              compare.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <div className="grid grid-cols-[1fr_auto_auto] gap-0 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3 text-[11px] font-bold tracking-wider text-zinc-500 uppercase sm:px-5">
              <span>Necessidade</span>
              <span className="w-24 text-center sm:w-28">IA</span>
              <span className="w-28 text-center sm:w-36">Consultoria</span>
            </div>
            {whenToUse.map((row, i) => (
              <div
                key={row.need}
                className={cn(
                  "grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-3.5 sm:px-5",
                  i < whenToUse.length - 1 && "border-b border-zinc-100"
                )}
              >
                <span className="text-sm font-medium text-zinc-800">{row.need}</span>
                <span className="w-24 text-center text-[11px] leading-snug text-primary-700 sm:w-28 sm:text-xs">
                  {row.ia}
                </span>
                <span className="w-28 text-center text-[11px] leading-snug text-accent-700 sm:w-36 sm:text-xs">
                  {row.consultoria}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantias + FAQ compacto */}
      <section className="section-padding-sm bg-white">
        <div className="container-custom">
          <div
            ref={extra.ref}
            className={cn(
              "grid gap-8 lg:grid-cols-2 transition-all duration-700",
              extra.visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <div>
              <span className="section-label">Por trás do processo</span>
              <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
                O que você pode esperar
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {guarantees.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-900">{title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-primary-200 bg-primary-50/40 p-4">
                <div className="flex items-start gap-3">
                  <Zap size={18} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-sm font-bold text-surface-900">Dica: combine os dois</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                      Use flashcards e mapas mentais na IA durante o semestre. Na reta final do TCC,
                      chame um mentor — você chega preparado e economiza tempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="section-label">Dúvidas frequentes</span>
              <h2 className="font-display mt-2 text-xl font-extrabold sm:text-2xl">
                Respostas rápidas
              </h2>
              <div className="mt-4 space-y-3">
                {faqQuick.map((item) => (
                  <div key={item.q} className="rounded-xl border border-zinc-200/80 bg-white p-4">
                    <p className="text-sm font-bold text-surface-900">{item.q}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{item.a}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:gap-2"
              >
                Ver FAQ completo
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Pronto para começar?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Crie sua conta grátis agora ou peça um orçamento de consultoria — sem compromisso.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-surface-900 shadow-xl transition hover:brightness-105"
            >
              <Sparkles size={16} />
              Começar com IA grátis
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <MessageSquare size={16} />
              Falar com consultor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
