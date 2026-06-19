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
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  university: string;
  rating: number;
  text: string;
  service: string;
  avatar: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
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
  { href: "#inicio", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#sobre", label: "Sobre" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
  { href: "#contato", label: "Contato" },
];

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
  },
  {
    id: "estagio",
    title: "Relatório de Estágio",
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
    course: "Enfermagem",
    university: "USP",
    rating: 5,
    text: "Estava completamente perdida com meu TCC sobre cuidados paliativos. A equipe da MentorUp me ajudou desde a escolha do tema até a formatação final. Passei na banca com nota 9,5 e recebi elogios pela metodologia!",
    service: "TCC & Monografia",
    avatar: "CR",
  },
  {
    id: "2",
    name: "Rafael Mendes",
    course: "Engenharia Civil",
    university: "UFMG",
    rating: 5,
    text: "Precisava entregar o relatório de estágio em uma semana e estava sobrecarregado com provas. O mentor estruturou tudo de forma impecável. Meu supervisor elogiou a qualidade da reflexão crítica.",
    service: "Relatório de Estágio",
    avatar: "RM",
  },
  {
    id: "3",
    name: "Juliana Ferreira",
    course: "Direito",
    university: "PUC-Rio",
    rating: 5,
    text: "Contratei a revisão ABNT para minha monografia de 80 páginas. Voltou perfeita — citações, referências, margens, tudo conforme as normas. Economizei semanas de trabalho e evitei retrabalho.",
    service: "Revisão & Normatização",
    avatar: "JF",
  },
  {
    id: "4",
    name: "Lucas Oliveira",
    course: "Administração",
    university: "UNICAMP",
    rating: 5,
    text: "Os slides para minha apresentação de seminário ficaram incríveis. O roteiro que recebi me deu segurança total na hora de falar. Tirei nota máxima na disciplina!",
    service: "Apresentações & Slides",
    avatar: "LO",
  },
  {
    id: "5",
    name: "Beatriz Almeida",
    course: "Psicologia",
    university: "UFPR",
    rating: 5,
    text: "Meu artigo foi aceito em um evento nacional depois da orientação da MentorUp. A ajuda com metodologia qualitativa e estrutura IMRaD fez toda a diferença na qualidade do texto.",
    service: "Artigos Científicos",
    avatar: "BA",
  },
  {
    id: "6",
    name: "Thiago Santos",
    course: "Ciência da Computação",
    university: "UFRJ",
    rating: 5,
    text: "Tinha um projeto de iniciação científica para submeter e não sabia por onde começar. Recebi um projeto completo com cronograma, referências e metodologia sólida. Fui aprovado no edital!",
    service: "Projetos de Pesquisa",
    avatar: "TS",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "basico",
    name: "Essencial",
    description: "Ideal para trabalhos pontuais e entregas rápidas",
    price: "R$ 97",
    period: "a partir de",
    features: [
      "Atividades e listas de exercícios",
      "Resumos e fichamentos",
      "Revisão ortográfica básica",
      "Suporte por e-mail",
      "Entrega em até 5 dias úteis",
      "1 revisão inclusa",
    ],
    cta: "Solicitar orçamento",
  },
  {
    id: "profissional",
    name: "Profissional",
    description: "O mais escolhido por graduandos",
    price: "R$ 297",
    period: "a partir de",
    features: [
      "Relatórios e seminários completos",
      "Relatório de estágio",
      "Formatação ABNT completa",
      "Mentor dedicado da sua área",
      "Suporte WhatsApp prioritário",
      "Entrega em até 10 dias úteis",
      "3 revisões inclusas",
      "Garantia de originalidade",
    ],
    popular: true,
    cta: "Começar agora",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Acompanhamento completo do início ao fim",
    price: "R$ 697",
    period: "a partir de",
    features: [
      "TCC e monografias completas",
      "Artigos científicos",
      "Projetos de pesquisa",
      "Mentor sênior exclusivo",
      "Reuniões semanais online",
      "Preparação para banca/defesa",
      "Revisões ilimitadas",
      "Suporte 24/7",
      "Garantia de aprovação",
    ],
    cta: "Falar com consultor",
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "O trabalho entregue é original e livre de plágio?",
    answer:
      "Sim. Todos os materiais são produzidos do zero por nossos mentores especializados. Utilizamos ferramentas profissionais de detecção de plágio e entregamos relatório de originalidade junto com o trabalho final.",
  },
  {
    question: "Posso acompanhar o andamento do meu trabalho?",
    answer:
      "Com certeza. Você tem acesso a um painel de acompanhamento e pode conversar diretamente com seu mentor via WhatsApp ou e-mail. Nos planos Premium, realizamos reuniões semanais por videoconferência.",
  },
  {
    question: "E se eu precisar de revisões após a entrega?",
    answer:
      "Cada plano inclui um número de revisões gratuitas. Caso precise de alterações adicionais, nossa equipe avalia e, na maioria dos casos, ajustes menores são feitos sem custo extra dentro do prazo acordado.",
  },
  {
    question: "Vocês atendem todas as áreas do conhecimento?",
    answer:
      "Atendemos mais de 80 cursos de graduação e pós-graduação, incluindo áreas de exatas, humanas, biológicas, saúde, engenharias e tecnologia. Se sua área for muito específica, consulte-nos antes.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Aceitamos PIX, cartão de crédito (parcelado em até 12x), boleto bancário e transferência. Para projetos maiores, oferecemos pagamento em etapas conforme o cronograma de entrega.",
  },
  {
    question: "Qual o prazo mínimo de entrega?",
    answer:
      "Depende da complexidade. Atividades simples podem ser entregues em 24–48 horas. TCCs e monografias completas geralmente requerem de 15 a 45 dias. Sempre informamos o prazo realista na proposta.",
  },
  {
    question: "Vocês ajudam na defesa oral do TCC?",
    answer:
      "Sim! Nos planos Profissional e Premium incluímos preparação para apresentação oral: roteiro, slides, simulação de perguntas da banca e dicas de postura e argumentação.",
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
