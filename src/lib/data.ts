import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  Lightbulb,
  MessageSquare,
  Microscope,
  PenLine,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  highlight?: boolean;
  priceFrom?: string;
  priceNote?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  university: string;
  city: string;
  rating: number;
  text: string;
  service: string;
  avatar: string;
  type: "consultoria" | "ia" | "ambos";
  period: string;
  situation: string;
  outcome: string;
  featured?: boolean;
}

export interface PlatformPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
  href: string;
}

export interface ServicePrice {
  id: string;
  name: string;
  price: number | null;
  category: "rapido" | "entrega" | "projeto" | "tcc";
  description: string;
  delivery: string;
  includes: string[];
  popular?: boolean;
}

export interface ConsultancyPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  includes: string[];
  popular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/ferramentas", label: "Ferramentas IA" },
  { href: "/consultoria", label: "Consultoria" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/planos", label: "Planos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contato", label: "Contato" },
];

export const footerLinks = [{ href: "/sobre", label: "Sobre nós" }];

export const services: Service[] = [
  {
    id: "tcc",
    title: "TCC & Monografia",
    description:
      "Orientação completa do tema à defesa. Estruturação, metodologia, revisão bibliográfica e formatação ABNT impecável.",
    icon: GraduationCap,
    features: [
      "Definição de tema e problema de pesquisa",
      "Estruturação de capítulos",
      "Revisão bibliográfica",
      "Formatação ABNT",
      "Preparação para banca",
    ],
    highlight: true,
    priceNote: "Por etapa — orçamento grátis",
  },
  {
    id: "estagio",
    title: "Relatório de Estágio",
    priceFrom: "R$ 98",
    description:
      "Relatórios profissionais que impressionam supervisores e coordenadores. Narrativa clara e reflexão acadêmica sólida.",
    icon: Briefcase,
    features: [
      "Diário de bordo estruturado",
      "Relatório parcial e final",
      "Análise crítica das experiências",
      "Conformidade com normas da instituição",
      "Apresentação oral",
    ],
  },
  {
    id: "relatorios",
    title: "Relatórios Acadêmicos",
    priceFrom: "R$ 76",
    description:
      "Relatórios técnicos, de laboratório, de campo e seminários com linguagem precisa e fundamentação adequada.",
    icon: FileText,
    features: [
      "Relatórios de laboratório",
      "Relatórios de visita técnica",
      "Relatórios de pesquisa",
      "Análise de dados",
      "Conclusões e recomendações",
    ],
  },
  {
    id: "atividades",
    title: "Atividades & Trabalhos",
    priceFrom: "R$ 28",
    description:
      "Resolução orientada de listas, estudos de caso, mapas mentais e trabalhos em grupo com foco no aprendizado.",
    icon: ClipboardList,
    features: [
      "Listas de exercícios",
      "Estudos de caso",
      "Trabalhos em grupo",
      "Mapas conceituais",
      "Resumos e fichamentos",
    ],
  },
  {
    id: "artigos",
    title: "Artigos Científicos",
    priceFrom: "R$ 164",
    description:
      "Produção e revisão de artigos para publicação em periódicos, com rigor metodológico e linguagem acadêmica.",
    icon: Microscope,
    features: [
      "Estrutura IMRaD",
      "Revisão sistemática",
      "Normas de periódicos",
      "Referências bibliográficas",
      "Submissão orientada",
    ],
  },
  {
    id: "slides",
    title: "Apresentações & Slides",
    priceFrom: "R$ 39",
    description:
      "Slides profissionais para seminários, defesas e congressos. Design limpo e narrativa persuasiva.",
    icon: Presentation,
    features: [
      "Design profissional",
      "Roteiro de apresentação",
      "Gráficos e infográficos",
      "Preparação para perguntas",
      "Templates personalizados",
    ],
  },
  {
    id: "revisao",
    title: "Revisão & Normatização",
    priceFrom: "R$ 43",
    description:
      "Revisão ortográfica, coesão, coerência e adequação às normas ABNT, Vancouver ou APA conforme exigência.",
    icon: PenLine,
    features: [
      "Revisão ortográfica",
      "Ajuste de coesão",
      "Formatação ABNT/APA",
      "Citações e referências",
      "Plágio zero garantido",
    ],
  },
  {
    id: "pesquisa",
    title: "Projetos de Pesquisa",
    priceFrom: "R$ 197",
    description:
      "Elaboração de projetos para iniciação científica, mestrado e editais com metodologia robusta.",
    icon: Lightbulb,
    features: [
      "Justificativa e objetivos",
      "Revisão de literatura",
      "Metodologia detalhada",
      "Cronograma e orçamento",
      "Adequação a editais",
    ],
  },
  {
    id: "fichamento",
    title: "Fichamentos & Resenhas",
    priceFrom: "R$ 28",
    description:
      "Análise crítica de obras acadêmicas com síntese precisa e reflexão aprofundada sobre o conteúdo.",
    icon: BookOpen,
    features: [
      "Fichamento analítico",
      "Resenha crítica",
      "Resumo expandido",
      "Comparativo de autores",
      "Referências completas",
    ],
  },
];

export const stats: Stat[] = [
  { value: "2.500+", label: "Alunos atendidos" },
  { value: "98%", label: "Taxa de aprovação" },
  { value: "150+", label: "Mentores especialistas" },
  { value: "4.9/5", label: "Avaliação média" },
];

export const steps = [
  {
    step: "01",
    title: "Conte-nos sua necessidade",
    description:
      "Preencha o formulário ou fale conosco pelo WhatsApp. Descreva curso, prazo e tipo de trabalho.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Receba um plano personalizado",
    description:
      "Analisamos seu caso e enviamos proposta com escopo, cronograma e investimento transparente.",
    icon: Search,
  },
  {
    step: "03",
    title: "Acompanhamento com mentor",
    description:
      "Um especialista da sua área conduz o trabalho com revisões, feedbacks e suporte contínuo.",
    icon: Layers,
  },
  {
    step: "04",
    title: "Entrega e sucesso",
    description:
      "Receba o material finalizado, revisado e pronto para entrega. Suporte pós-entrega incluso.",
    icon: Sparkles,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Camila Rodrigues",
    course: "Enfermagem — 8º período",
    university: "USP",
    city: "São Paulo, SP",
    rating: 5,
    type: "consultoria",
    period: "Defesa em out/2024",
    situation:
      "TCC sobre cuidados paliativos em UTI. Tinha tema aprovado, mas travava na metodologia — minha orientadora pedia revisão toda semana e eu não sabia montar o quadro de Cronbach.",
    text: "Contratei acompanhamento por etapa: primeiro estruturaram capítulos 1 e 2, depois revisaram minha pesquisa com pacientes (n=47) e montaram as tabelas no SPSS. A formatação ABNT da EEUSP ficou certinha — margens, citações indiretas longas, tudo. Na banca, a professora externa elogiou a clareza da análise estatística. Foi a primeira vez que entreguei algo acadêmico sem chorar de ansiedade.",
    outcome: "Nota 9,5 na banca · Aprovada sem ressalvas",
    service: "TCC por etapas",
    avatar: "CR",
    featured: true,
  },
  {
    id: "2",
    name: "Rafael Mendes",
    course: "Engenharia Civil — 9º período",
    university: "UFMG",
    city: "Belo Horizonte, MG",
    rating: 5,
    type: "consultoria",
    period: "Entrega nov/2024",
    situation:
      "Relatório de estágio obrigatório na Construtora Horizonte (6 meses de obra). Faltavam 11 dias, eu tinha fotos e diário de bordo, mas zero estrutura — e ainda tinha prova de Estruturas II no meio.",
    text: "Mandei meu caderno de campo pelo WhatsApp numa terça. Quarta recebi o esqueleto completo: capa, sumário, descrição da empresa, atividades por mês e reflexão crítica alinhada ao PPC da UFMG. Eu só preenchi com meus dados reais e ajustei nomes. Entreguei dia 18/11, supervisora comentou que era 'um dos melhores da turma de 2024'.",
    outcome: "Nota 9,2 · Entregue 3 dias antes do prazo",
    service: "Relatório de estágio",
    avatar: "RM",
  },
  {
    id: "3",
    name: "Juliana Ferreira",
    course: "Direito — 10º período",
    university: "PUC-Rio",
    city: "Rio de Janeiro, RJ",
    rating: 5,
    type: "consultoria",
    period: "Dez/2024",
    situation:
      "Monografia de 82 páginas sobre compliance em startups. O texto estava pronto, mas as citações estavam uma bagunça — ABNT NBR 10520 misturada com Chicago que eu copiei de artigo online.",
    text: "Enviei o Word completo numa sexta à noite. Segunda de manhã voltou: 214 referências padronizadas, citações longas com recuo de 4cm, sumário automático conferido, notas de rodapé corrigidas. Minha orientadora só pediu ajuste no título. Economizei pelo menos duas semanas que eu ia passar no Word xingando formatação.",
    outcome: "Monografia aceita sem retrabalho de normas",
    service: "Revisão ABNT",
    avatar: "JF",
  },
  {
    id: "4",
    name: "Lucas Oliveira",
    course: "Administração — 6º período",
    university: "UNICAMP",
    city: "Campinas, SP",
    rating: 5,
    type: "ambos",
    period: "Seminário set/2024",
    situation:
      "Apresentação de 20 min sobre análise SWOT da Natura. Slides genéricos do Canva, roteiro inexistente — eu ia ler o slide e torcer.",
    text: "Usei a IA da MentorUp pra resumir os relatórios anuais e contratei revisão de slides. Recebi 14 slides limpos, gráficos legíveis e um roteiro falado com tempo estimado por slide (18 min + 2 de perguntas). Na sala, o professor interrompeu pra elogiar a clareza dos dados. Depois disso assinei o plano Estudante e uso mapa mental toda semana.",
    outcome: "Nota 10 no seminário · Plano Estudante desde out/2024",
    service: "Slides + Ferramentas IA",
    avatar: "LO",
  },
  {
    id: "5",
    name: "Beatriz Almeida",
    course: "Psicologia — 7º período",
    university: "UFPR",
    city: "Curitiba, PR",
    rating: 5,
    type: "consultoria",
    period: "Submissão ago/2024",
    situation:
      "Artigo qualitativo sobre burnout em residentes médicos. Dados da entrevista prontos, mas IMRaD incompleto e discussão fraca — revisor interno da UFPR devolveu duas vezes.",
    text: "A mentora (Dra. em Psicologia Social) reorganizou resultados por categorias temáticas, reescreveu a discussão conectando com Maslach e revisou o abstract em PT e EN. Submetemos ao XVI ENAPSI em Recife — aceito como pôster. Não escreveram por mim: eu tinha os dados, eles deram forma acadêmica.",
    outcome: "Artigo aceito no ENAPSI 2024",
    service: "Artigo científico",
    avatar: "BA",
  },
  {
    id: "6",
    name: "Thiago Santos",
    course: "Ciência da Computação — 5º período",
    university: "UFRJ",
    city: "Rio de Janeiro, RJ",
    rating: 5,
    type: "consultoria",
    period: "Edital jul/2024",
    situation:
      "Projeto de iniciação científica sobre detecção de fake news com NLP. Precisava de cronograma Gantt, revisão bibliográfica e metodologia — prazo do edital PIBIC em 9 dias.",
    text: "Enviaram proposta com 23 referências recentes (2020–2024), metodologia detalhada com BERTimbau e cronograma semestral realista. Meu orientador ajustou só o escopo de dados. Fui aprovado no edital — bolsa de R$ 700/mês por 12 meses.",
    outcome: "Aprovado no PIBIC-UFRJ 2024",
    service: "Projeto de pesquisa",
    avatar: "TS",
  },
  {
    id: "7",
    name: "Fernanda Costa",
    course: "Farmácia — 4º período",
    university: "UNIFESP",
    city: "São Paulo, SP",
    rating: 5,
    type: "ia",
    period: "Uso contínuo desde mar/2025",
    situation:
      "Provas de Farmacologia e Bioquímica com PDFs enormes (40–80 páginas). Resumo tradicional me levava 4h e eu ainda esquecia metade na prova.",
    text: "Colei o PDF da aula no gerador de flashcards todo domingo. Em 2–3 minutos tenho cartões separados por sistema (cardiovascular, SNC, etc.). Uso no ônibus pelo celular. Na prova de março tirei 8,7 — antes ficava entre 6,0 e 7,0. ABNT de referências uso de graça quase toda semana no TCC do colega de grupo.",
    outcome: "Média em Farmacologia subiu de 6,8 para 8,1",
    service: "Flashcards + ABNT (plano Grátis)",
    avatar: "FC",
  },
  {
    id: "8",
    name: "Gabriel Nunes",
    course: "Medicina — 3º período",
    university: "UFBA",
    city: "Salvador, BA",
    rating: 5,
    type: "ia",
    period: "Abr–jun/2025",
    situation:
      "Semestre pesado: Anatomia, Histologia e Fisiologia ao mesmo tempo. Precisava de mapas mentais rápidos pra revisar antes das provas práticas.",
    text: "Mapa mental virou rotina: colo o capítulo, escolho 'detalhado', exporto PNG e colo no Notion. Histologia melhorou muito — consigo ver ligação entre tecido epitelial e patologias. Pago o Estudante (R$ 29) porque 15 créditos grátis acabavam na segunda semana. Vale cada centavo.",
    outcome: "Aprovado em Anatomia II com 8,5",
    service: "Mapas mentais · Plano Estudante",
    avatar: "GN",
  },
  {
    id: "9",
    name: "Mariana Duarte",
    course: "Pedagogia — 2º período (EAD)",
    university: "Estácio",
    city: "Fortaleza, CE",
    rating: 5,
    type: "consultoria",
    period: "Entrega mai/2025",
    situation:
      "Trabalho interdisciplinar de 25 páginas sobre BNCC e educação infantil. EAD, trabalho em loja, filho pequeno — sobrava 1h por noite no máximo.",
    text: "Expliquei minha rotina no formulário de contato. Montaram cronograma de 10 dias com entregas parciais: eu mandava parágrafo, eles devolviam com correção e sugestão. Não fizeram por mim — eu escrevi com base nas correções. Professora deu feedback positivo sobre coerência argumentativa.",
    outcome: "Nota 8,8 · Entregue dentro do prazo EAD",
    service: "Trabalho acadêmico + revisão",
    avatar: "MD",
  },
  {
    id: "10",
    name: "Pedro Henrique Lima",
    course: "Contabilidade — 8º período",
    university: "UFPE",
    city: "Recife, PE",
    rating: 5,
    type: "ambos",
    period: "TCC fev/2025",
    situation:
      "TCC sobre IFRS 16 em empresas de varejo. Dados contábeis coletados, mas capítulo de análise financeira inconsistente — orientador pediu refazer gráficos e DRE comparativa.",
    text: "Consultoria refez tabelas e gráficos no Excel com minhas planilhas reais (Magazine Luiza, Via, Americanas). Usei a IA para gerar questões de estudo pra banca — simulei 40 perguntas e treinei respostas. Defesa em 14/02, nota 9,0. Hoje indico pros colegas do 9º que estão começando TCC.",
    outcome: "Nota 9,0 na defesa · Indicou 3 colegas",
    service: "TCC + Simulador de banca (IA)",
    avatar: "PL",
  },
];

export const testimonialStats = [
  { value: "847+", label: "Avaliações verificadas" },
  { value: "4,9", label: "Nota média" },
  { value: "32", label: "Estados atendidos" },
  { value: "68%", label: "Voltam a contratar" },
];

export const platformPlans: PlatformPlan[] = [
  {
    id: "free",
    name: "Grátis",
    description: "Ferramentas IA para o dia a dia",
    price: "R$ 0",
    period: "para sempre",
    features: [
      "15 créditos/mês",
      "Referências ABNT ilimitadas",
      "Mapas mentais, flashcards e resumos",
      "Histórico básico",
    ],
    cta: "Criar conta grátis",
    href: "/register",
  },
  {
    id: "student",
    name: "Estudante",
    description: "Para quem usa IA toda semana",
    price: "R$ 29",
    period: "/mês",
    features: [
      "150 créditos/mês",
      "Todas as ferramentas por área",
      "Simulador de prova",
      "Exportação de mapas e flashcards",
      "Suporte prioritário",
    ],
    popular: true,
    cta: "Começar no Estudante",
    href: "/register",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Uso intenso + desconto em consultoria",
    price: "R$ 59",
    period: "/mês",
    features: [
      "Créditos IA generosos*",
      "10% off em consultoria humana",
      "Mentor dedicado (1h/mês)",
      "Prioridade na fila",
      "Tudo do plano Estudante",
    ],
    cta: "Assinar Pro",
    href: "/register",
  },
];

export const servicePrices: ServicePrice[] = [
  {
    id: "resumo",
    name: "Resumo simples",
    price: 22,
    category: "rapido",
    description: "Síntese clara de artigo, capítulo ou material de aula — ideal para revisão de prova.",
    delivery: "24 horas",
    includes: ["Até 15 páginas de base", "Estrutura por tópicos", "1 revisão inclusa"],
    popular: true,
  },
  {
    id: "fichamento",
    name: "Fichamento",
    price: 28,
    category: "rapido",
    description: "Ficha analítica com citações, argumentos centrais e conclusão do autor.",
    delivery: "24–48h",
    includes: ["Referência completa ABNT", "Citações diretas", "Análise crítica breve"],
  },
  {
    id: "lista",
    name: "Lista de exercícios",
    price: 28,
    category: "rapido",
    description: "Resolução comentada passo a passo — cálculos, questões discursivas ou objetivas.",
    delivery: "24–48h",
    includes: ["Resolução comentada", "Explicação de cada passo", "Formato da instituição"],
  },
  {
    id: "slides",
    name: "Apresentação em slides",
    price: 39,
    category: "rapido",
    description: "Slides profissionais + roteiro de fala para seminário ou defesa parcial.",
    delivery: "48h",
    includes: ["Até 15 slides", "Roteiro com tempo por slide", "Design limpo e legível"],
    popular: true,
  },
  {
    id: "atividade",
    name: "Atividade acadêmica",
    price: 43,
    category: "rapido",
    description: "Trabalho curto pronto para entregar — seminário, ficha, questionário ou estudo de caso.",
    delivery: "48h",
    includes: ["Até 8 páginas", "Referências se necessário", "Formatação básica"],
  },
  {
    id: "revisao",
    name: "Revisão ortográfica",
    price: 43,
    category: "rapido",
    description: "Correção de gramática, concordância, coesão e clareza — sem alterar seu conteúdo.",
    delivery: "24–48h",
    includes: ["Até 20 páginas", "Sugestões de melhoria", "Arquivo revisado em Word"],
  },
  {
    id: "abnt",
    name: "Formatação ABNT",
    price: 54,
    category: "entrega",
    description: "Normatização completa NBR 10520/6023 — margens, citações, referências e sumário.",
    delivery: "3–5 dias",
    includes: ["Citações e referências", "Sumário automático", "Conferência final"],
  },
  {
    id: "relatorio",
    name: "Relatório acadêmico",
    price: 76,
    category: "entrega",
    description: "Relatório estruturado com introdução, desenvolvimento, conclusão e referências.",
    delivery: "3–5 dias",
    includes: ["Até 15 páginas", "Estrutura acadêmica", "1 revisão inclusa"],
  },
  {
    id: "estagio",
    name: "Relatório de estágio",
    price: 98,
    category: "entrega",
    description: "Relatório completo alinhado ao PPC — reflexão crítica, atividades e dados da empresa.",
    delivery: "5–7 dias",
    includes: ["Capa e sumário", "Reflexão crítica", "Formatação da instituição"],
    popular: true,
  },
  {
    id: "extensao",
    name: "Projeto de extensão",
    price: 109,
    category: "projeto",
    description: "Proposta de extensão universitária com objetivos, metodologia e cronograma.",
    delivery: "5–7 dias",
    includes: ["Justificativa", "Plano de ação", "Referências"],
  },
  {
    id: "artigo",
    name: "Artigo científico",
    price: 164,
    category: "projeto",
    description: "Artigo no formato IMRaD para submissão a evento ou periódico.",
    delivery: "7–10 dias",
    includes: ["Abstract PT/EN", "Revisão metodológica", "Referências atualizadas"],
  },
  {
    id: "pesquisa",
    name: "Projeto de pesquisa",
    price: 197,
    category: "projeto",
    description: "Projeto para IC, mestrado ou edital — problema, hipótese, método e cronograma.",
    delivery: "7–10 dias",
    includes: ["Revisão bibliográfica", "Cronograma Gantt", "Orçamento se necessário"],
  },
  {
    id: "tcc",
    name: "Orientação de TCC (por etapa)",
    price: null,
    category: "tcc",
    description: "Acompanhamento capítulo a capítulo — do tema à formatação final para banca.",
    delivery: "Por etapa",
    includes: ["Mentor da sua área", "Cronograma personalizado", "Orçamento grátis"],
  },
];

export const serviceCategoryMeta = {
  rapido: {
    label: "Entregas rápidas",
    subtitle: "Para a semana de provas e prazos curtos — pronto em 24 a 48 horas.",
    turnaround: "24–48h",
    color: "primary" as const,
  },
  entrega: {
    label: "Trabalhos completos",
    subtitle: "Relatórios e normatização prontos para entregar na instituição.",
    turnaround: "3–7 dias",
    color: "accent" as const,
  },
  projeto: {
    label: "Projetos avançados",
    subtitle: "Artigos, extensão e projetos de pesquisa com profundidade acadêmica.",
    turnaround: "7–10 dias",
    color: "violet" as const,
  },
  tcc: {
    label: "Graduação & TCC",
    subtitle: "Acompanhamento por etapa até a defesa — valor conforme escopo.",
    turnaround: "Por etapa",
    color: "primary" as const,
  },
} as const;

export const servicePriceCategories = {
  rapido: "Entregas rápidas",
  entrega: "Trabalhos completos",
  projeto: "Projetos avançados",
  tcc: "Graduação",
} as const;

export const consultancyPackages: ConsultancyPackage[] = [
  {
    id: "rapido",
    name: "Pacote Rápido",
    description: "Para semana de provas e leituras",
    price: "R$ 45",
    originalPrice: "R$ 50",
    includes: ["Resumo simples", "Fichamento"],
  },
  {
    id: "atividade",
    name: "Pacote Atividade",
    description: "Lista + entrega formatada",
    price: "R$ 59",
    originalPrice: "R$ 71",
    includes: ["Lista de exercícios", "Atividade acadêmica"],
    popular: true,
  },
  {
    id: "estagio",
    name: "Pacote Estágio",
    description: "Relatório + apresentação oral",
    price: "R$ 119",
    originalPrice: "R$ 137",
    includes: ["Relatório de estágio", "Apresentação em slides"],
  },
  {
    id: "entrega",
    name: "Pacote Entrega",
    description: "Relatório pronto e normatizado",
    price: "R$ 109",
    originalPrice: "R$ 130",
    includes: ["Relatório acadêmico", "Formatação ABNT"],
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "Por que os preços são mais baixos que outras consultorias?",
    answer:
      "Somos feitos por e para estudantes. Cobramos por entrega, com valores fixos e pacotes acessíveis — não vendemos planos de R$ 500+. Você paga só o que precisa, quando precisa.",
  },
  {
    question: "O trabalho entregue é original e livre de plágio?",
    answer:
      "Sim. Todos os materiais são produzidos do zero por nossos mentores especializados. Utilizamos ferramentas profissionais de detecção de plágio e entregamos relatório de originalidade junto com o trabalho final.",
  },
  {
    question: "Posso acompanhar o andamento do meu trabalho?",
    answer:
      "Sim. Você acompanha pelo painel e fala direto com seu mentor via WhatsApp ou e-mail. Projetos maiores (TCC, artigos) incluem checkpoints por etapa.",
  },
  {
    question: "E se eu precisar de revisões após a entrega?",
    answer:
      "Cada serviço inclui 1 revisão gratuita dentro do escopo acordado. Ajustes menores costumam ser resolvidos sem custo extra dentro de 7 dias após a entrega.",
  },
  {
    question: "Vocês atendem todas as áreas do conhecimento?",
    answer:
      "Atendemos mais de 80 cursos de graduação e pós-graduação, incluindo áreas de exatas, humanas, biológicas, saúde, engenharias e tecnologia. Se sua área for muito específica, consulte-nos antes.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "PIX à vista (com desconto), cartão em até 6x sem juros nos pacotes, e parcelamento por etapa em TCC e projetos longos. Valores fixos na tabela — sem surpresas na hora de pagar.",
  },
  {
    question: "Qual o prazo mínimo de entrega?",
    answer:
      "Depende da complexidade. Atividades simples podem ser entregues em 24–48 horas. TCCs e monografias completas geralmente requerem de 15 a 45 dias. Sempre informamos o prazo realista na proposta.",
  },
  {
    question: "Vocês ajudam na defesa oral do TCC?",
    answer:
      "Sim. Oferecemos slides de defesa (R$ 39), roteiro de apresentação e simulação de perguntas da banca. No acompanhamento por etapa do TCC, a preparação oral pode ser incluída no orçamento.",
  },
  {
    question: "Meus dados e informações ficam seguros?",
    answer:
      "Absolutamente. Seguimos a LGPD rigorosamente. Seus dados pessoais e acadêmicos são criptografados e nunca compartilhados com terceiros. O sigilo total é garantido em contrato.",
  },
];

export const contactInfo = {
  email: "contato@mentorup.com.br",
  phone: "+55 (11) 99999-8888",
  whatsapp: "5511999998888",
  address: "Av. Paulista, 1000 — Bela Vista, São Paulo — SP",
  hours: "Seg–Sex: 8h às 20h | Sáb: 9h às 14h",
  social: {
    instagram: "https://instagram.com/mentorup.br",
    linkedin: "https://linkedin.com/company/mentorup",
    youtube: "https://youtube.com/@mentorup",
    tiktok: "https://tiktok.com/@mentorup.br",
  },
};

export const differentials = [
  {
    icon: ShieldCheck,
    title: "100% Original",
    description: "Trabalhos únicos com relatório anti-plágio incluso.",
  },
  {
    icon: GraduationCap,
    title: "Mentores Especialistas",
    description: "Profissionais com mestrado e doutorado na sua área.",
  },
  {
    icon: MessageSquare,
    title: "Suporte Humanizado",
    description: "Atendimento real, rápido e sem robôs.",
  },
  {
    icon: Sparkles,
    title: "Garantia de Qualidade",
    description: "Revisões inclusas até você ficar 100% satisfeito.",
  },
];
