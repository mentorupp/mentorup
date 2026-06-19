import type { ToolType } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  Calculator,
  FileCheck,
  FileText,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Layers,
  MessageSquare,
  PenLine,
  Scale,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";

export type AreaSlug =
  | "saude"
  | "psicologia-humanas"
  | "engenharia"
  | "direito"
  | "administracao"
  | "biologicas"
  | "comunicacao"
  | "arquitetura";

export interface ToolConfig {
  id: string;
  type: ToolType;
  name: string;
  description: string;
  icon: LucideIcon;
  credits: number;
  href: string;
  category: "core" | "area" | "premium";
  popular?: boolean;
  freeUnlimited?: boolean;
}

export const PLAN_CREDITS = {
  FREE: 15,
  STUDENT: 150,
  PRO: 9999,
} as const;

export const tools: ToolConfig[] = [
  {
    id: "mind-map",
    type: "MIND_MAP",
    name: "Mapa Mental IA",
    description: "Transforme PDFs e textos em mapas interativos com nós expandíveis.",
    icon: GitBranch,
    credits: 3,
    href: "/dashboard/tools/mind-map",
    category: "core",
    popular: true,
  },
  {
    id: "pdf-quiz",
    type: "PDF_QUIZ",
    name: "Questões sobre PDF",
    description: "Gere questões objetivas e dissertativas com gabarito comentado.",
    icon: FileCheck,
    credits: 2,
    href: "/dashboard/tools/pdf-quiz",
    category: "core",
    popular: true,
  },
  {
    id: "rewrite",
    type: "REWRITE",
    name: "Reescrever Texto",
    description: "Melhore clareza, coesão e tom acadêmico do seu texto.",
    icon: PenLine,
    credits: 1,
    href: "/dashboard/tools/rewrite",
    category: "core",
  },
  {
    id: "summarize",
    type: "SUMMARIZE",
    name: "Resumir Material",
    description: "Resumos, tópicos e palavras-chave no padrão acadêmico.",
    icon: FileText,
    credits: 1,
    href: "/dashboard/tools/summarize",
    category: "core",
  },
  {
    id: "flashcards",
    type: "FLASHCARDS",
    name: "Flashcards",
    description: "Cartões de estudo com repetição espaçada automática.",
    icon: Layers,
    credits: 2,
    href: "/dashboard/tools/flashcards",
    category: "core",
  },
  {
    id: "references",
    type: "REFERENCES",
    name: "Referências ABNT/APA",
    description: "Gere referências bibliográficas corretas a partir de DOI, URL ou dados.",
    icon: BookOpen,
    credits: 0,
    href: "/dashboard/tools/references",
    category: "core",
    popular: true,
    freeUnlimited: true,
  },
  {
    id: "grammar",
    type: "GRAMMAR",
    name: "Correção Gramatical",
    description: "Ortografia, concordância, pontuação e clareza acadêmica.",
    icon: Sparkles,
    credits: 1,
    href: "/dashboard/tools/grammar",
    category: "core",
  },
  {
    id: "chat-pdf",
    type: "CHAT_PDF",
    name: "Chat com Documento",
    description: "Converse com seu PDF e receba respostas com citação de trechos.",
    icon: MessageSquare,
    credits: 1,
    href: "/dashboard/tools/chat-pdf",
    category: "core",
  },
  {
    id: "exam-sim",
    type: "EXAM_SIM",
    name: "Simulador de Prova",
    description: "Prova simulada calibrada ao seu material de estudo.",
    icon: GraduationCap,
    credits: 3,
    href: "/dashboard/tools/exam-sim",
    category: "premium",
  },
  {
    id: "case-study",
    type: "CASE_STUDY",
    name: "Estudo de Caso",
    description: "Estruture estudos de caso com metodologia acadêmica.",
    icon: Brain,
    credits: 2,
    href: "/dashboard/tools/case-study",
    category: "premium",
  },
];

export interface AreaConfig {
  slug: AreaSlug;
  name: string;
  icon: LucideIcon;
  color: string;
  tools: {
    id: string;
    name: string;
    description: string;
    credits: number;
    promptHint: string;
  }[];
}

export const areas: AreaConfig[] = [
  {
    slug: "saude",
    name: "Saúde",
    icon: Stethoscope,
    color: "from-rose-500 to-pink-600",
    tools: [
      { id: "drug-cards", name: "Cartões de Fármacos", description: "Mecanismo, dose, contraindicações e interações.", credits: 2, promptHint: "fármaco ou medicamento" },
      { id: "clinical-case", name: "Caso Clínico", description: "Simule diagnóstico diferencial e conduta.", credits: 3, promptHint: "caso clínico" },
      { id: "dose-calc", name: "Cálculo de Doses", description: "Passo a passo de dosagem com fórmulas.", credits: 2, promptHint: "cálculo de dose" },
      { id: "pathology-map", name: "Mapa de Patologias", description: "Sinais, sintomas, exames e tratamento.", credits: 3, promptHint: "patologia" },
      { id: "internship-report", name: "Relatório de Estágio Clínico", description: "Estrutura e reflexão para estágio em saúde.", credits: 2, promptHint: "relatório de estágio clínico" },
    ],
  },
  {
    slug: "psicologia-humanas",
    name: "Psicologia & Humanas",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    tools: [
      { id: "case-analysis", name: "Análise de Caso", description: "Hipóteses, intervenção e referencial teórico.", credits: 2, promptHint: "estudo de caso psicológico" },
      { id: "interview-analysis", name: "Análise de Entrevista", description: "Temas e categorias para pesquisa qualitativa.", credits: 3, promptHint: "transcrição de entrevista" },
      { id: "theory-map", name: "Mapa Teórico", description: "Relações entre teorias, autores e conceitos.", credits: 3, promptHint: "mapa teórico" },
      { id: "reflective-report", name: "Relato Reflexivo", description: "Roteiro para estágio supervisionado.", credits: 2, promptHint: "relato reflexivo de estágio" },
    ],
  },
  {
    slug: "engenharia",
    name: "Engenharia & Exatas",
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    tools: [
      { id: "step-solution", name: "Resolução Passo a Passo", description: "Problemas numéricos com fórmulas e unidades.", credits: 2, promptHint: "problema de engenharia" },
      { id: "formula-cards", name: "Flashcards de Fórmulas", description: "Equações, variáveis e aplicações.", credits: 2, promptHint: "fórmulas de engenharia" },
      { id: "lab-report", name: "Relatório de Laboratório", description: "Introdução, método, resultados e discussão.", credits: 2, promptHint: "relatório de laboratório" },
      { id: "flowchart", name: "Fluxograma / Diagrama", description: "Processos, algoritmos e sistemas.", credits: 2, promptHint: "fluxograma ou diagrama" },
    ],
  },
  {
    slug: "direito",
    name: "Direito",
    icon: Scale,
    color: "from-amber-500 to-orange-600",
    tools: [
      { id: "law-summary", name: "Resumo de Lei / Súmula", description: "Artigos, jurisprudência e aplicação prática.", credits: 2, promptHint: "legislação ou súmula" },
      { id: "legal-petition", name: "Estrutura de Peça", description: "Modelo de petição, contestação ou recurso.", credits: 2, promptHint: "peça jurídica" },
      { id: "legal-map", name: "Mapa de Institutos", description: "Conceitos e relações entre institutos jurídicos.", credits: 3, promptHint: "instituto jurídico" },
      { id: "oab-questions", name: "Questões Jurídicas", description: "Questões objetivas com fundamentação legal.", credits: 2, promptHint: "questões de direito" },
    ],
  },
  {
    slug: "administracao",
    name: "Administração & Negócios",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
    tools: [
      { id: "business-case", name: "Estudo de Caso Empresarial", description: "SWOT, 5 Forças de Porter, Canvas.", credits: 2, promptHint: "caso empresarial" },
      { id: "financial-analysis", name: "Análise Financeira", description: "Interpretação de DRE, balanço e indicadores.", credits: 2, promptHint: "análise financeira" },
      { id: "consulting-report", name: "Relatório de Consultoria", description: "Estrutura executiva e acadêmica.", credits: 2, promptHint: "relatório de consultoria" },
    ],
  },
  {
    slug: "biologicas",
    name: "Ciências Biológicas",
    icon: FlaskConical,
    color: "from-green-500 to-lime-600",
    tools: [
      { id: "cycle-map", name: "Mapa de Ciclos", description: "Ciclos biológicos e químicos interativos.", credits: 3, promptHint: "ciclo biológico ou químico" },
      { id: "article-filing", name: "Fichamento de Artigo", description: "Estrutura IMRaD automática.", credits: 2, promptHint: "artigo científico" },
      { id: "field-report", name: "Relatório de Campo", description: "Metodologia, observações e conclusões.", credits: 2, promptHint: "relatório de campo" },
    ],
  },
  {
    slug: "comunicacao",
    name: "Comunicação & Letras",
    icon: PenLine,
    color: "from-fuchsia-500 to-pink-600",
    tools: [
      { id: "literary-analysis", name: "Análise Literária", description: "Tema, narrativa, intertextualidade.", credits: 2, promptHint: "análise literária" },
      { id: "critical-review", name: "Resenha Crítica", description: "Argumentação e estrutura acadêmica.", credits: 2, promptHint: "resenha crítica" },
      { id: "script-outline", name: "Roteiro / Pauta", description: "Estrutura para trabalhos audiovisuais.", credits: 2, promptHint: "roteiro ou pauta jornalística" },
    ],
  },
  {
    slug: "arquitetura",
    name: "Arquitetura & Design",
    icon: Layers,
    color: "from-slate-500 to-zinc-600",
    tools: [
      { id: "project-analysis", name: "Análise de Projeto", description: "Conceito, partido arquitetônico e referências.", credits: 2, promptHint: "projeto arquitetônico" },
      { id: "descriptive-memorial", name: "Memorial Descritivo", description: "Estrutura ABNT para memorial de projeto.", credits: 2, promptHint: "memorial descritivo" },
      { id: "concept-map", name: "Mapa Conceitual Visual", description: "Referências, movimentos e autores.", credits: 3, promptHint: "mapa conceitual de arquitetura" },
    ],
  },
];

export function getToolById(id: string) {
  return tools.find((t) => t.id === id);
}

export function getAreaBySlug(slug: string) {
  return areas.find((a) => a.slug === slug);
}
