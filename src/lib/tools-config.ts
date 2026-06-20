import type { ToolGroup } from "@/lib/tool-categories";
import type { ToolType } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  Calendar,
  ClipboardList,
  FileCheck,
  FileText,
  GitBranch,
  GraduationCap,
  Languages,
  Layers,
  Lightbulb,
  MessageSquare,
  PenLine,
  Presentation,
  Quote,
  ScrollText,
  Search,
  Sparkles,
  Stethoscope,
  ScanLine,
} from "lucide-react";

export type { ToolGroup };
export { toolGroups } from "@/lib/tool-categories";

/** Plataforma focada em Saúde e Psicologia & Humanas */
export type AreaSlug = "saude" | "psicologia-humanas";

export interface ToolConfig {
  id: string;
  type: ToolType;
  name: string;
  description: string;
  icon: LucideIcon;
  credits: number;
  href: string;
  category: "core" | "premium";
  group: ToolGroup;
  popular?: boolean;
  freeUnlimited?: boolean;
}

export interface AreaToolConfig {
  id: string;
  name: string;
  description: string;
  credits: number;
  promptHint: string;
  systemPrompt?: string;
  popular?: boolean;
}

export interface AreaConfig {
  slug: AreaSlug;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  courses: string[];
  tools: AreaToolConfig[];
}

export const PLAN_CREDITS = {
  FREE: 15,
  STUDENT: 150,
  PRO: 9999,
} as const;

export const tools: ToolConfig[] = [
  // —— Apoio ao estudo (mais usados) ——
  {
    id: "summarize",
    type: "SUMMARIZE",
    name: "Resumir PDF e Artigos",
    description: "Resumo estruturado de artigos, capítulos e apostilas — #1 entre universitários.",
    icon: FileText,
    credits: 1,
    href: "/dashboard/tools/summarize",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "explain-content",
    type: "CHAT_PDF",
    name: "Explicar Conteúdo",
    description: "Explica conceitos difíceis de forma didática — como um tutor particular.",
    icon: Lightbulb,
    credits: 1,
    href: "/dashboard/tools/explain-content",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "mind-map",
    type: "MIND_MAP",
    name: "Mapa Mental IA",
    description: "Transforme PDFs e aulas em mapas — Farmacologia, Semiologia, Teorias.",
    icon: GitBranch,
    credits: 3,
    href: "/dashboard/tools/mind-map",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "flashcards",
    type: "FLASHCARDS",
    name: "Flashcards",
    description: "Cartões para memorizar fármacos, teorias, diagnósticos e autores.",
    icon: Layers,
    credits: 2,
    href: "/dashboard/tools/flashcards",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "pdf-quiz",
    type: "PDF_QUIZ",
    name: "Questões para Estudo",
    description: "Questões objetivas e dissertativas com gabarito comentado.",
    icon: FileCheck,
    credits: 2,
    href: "/dashboard/tools/pdf-quiz",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "exam-sim",
    type: "EXAM_SIM",
    name: "Simulador de Prova",
    description: "Simulado completo — ENADE, residência ou avaliação da disciplina.",
    icon: GraduationCap,
    credits: 3,
    href: "/dashboard/tools/exam-sim",
    category: "premium",
    group: "estudo",
    popular: true,
  },
  {
    id: "exam-correction",
    type: "EXAM_CORRECT",
    name: "Correção de Prova",
    description: "Tire foto ou envie imagem da prova — gabarito com ou sem explicação.",
    icon: ScanLine,
    credits: 2,
    href: "/dashboard/tools/exam-correction",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "exercise-solution",
    type: "REWRITE",
    name: "Exercícios Comentados",
    description: "Resolução passo a passo de listas, casos e questões discursivas.",
    icon: PenLine,
    credits: 2,
    href: "/dashboard/tools/exercise-solution",
    category: "core",
    group: "estudo",
  },
  {
    id: "study-schedule",
    type: "CASE_STUDY",
    name: "Cronograma de Estudo",
    description: "Planejamento semestral: provas, trabalhos, leituras e revisões.",
    icon: Calendar,
    credits: 1,
    href: "/dashboard/tools/study-schedule",
    category: "core",
    group: "estudo",
    popular: true,
  },
  {
    id: "chat-pdf",
    type: "CHAT_PDF",
    name: "Chat com Documento",
    description: "Tire dúvidas do PDF ou artigo — respostas com trechos citados.",
    icon: MessageSquare,
    credits: 1,
    href: "/dashboard/tools/chat-pdf",
    category: "core",
    group: "estudo",
  },

  // —— Produção acadêmica ——
  {
    id: "references",
    type: "REFERENCES",
    name: "Referências ABNT/APA",
    description: "Referências bibliográficas a partir de DOI, URL ou dados do artigo.",
    icon: BookOpen,
    credits: 0,
    href: "/dashboard/tools/references",
    category: "core",
    group: "producao",
    popular: true,
    freeUnlimited: true,
  },
  {
    id: "citations",
    type: "REFERENCES",
    name: "Citações Diretas e Indiretas",
    description: "Formata citações longas, curtas e indiretas conforme ABNT NBR 10520.",
    icon: Quote,
    credits: 0,
    href: "/dashboard/tools/citations",
    category: "core",
    group: "producao",
    popular: true,
    freeUnlimited: true,
  },
  {
    id: "abnt-format",
    type: "GRAMMAR",
    name: "Formatação ABNT",
    description: "Checklist e orientação de margens, fontes, citações, sumário e elementos pré-textuais.",
    icon: ClipboardList,
    credits: 1,
    href: "/dashboard/tools/abnt-format",
    category: "core",
    group: "producao",
    popular: true,
  },
  {
    id: "rewrite",
    type: "REWRITE",
    name: "Reescrever Texto",
    description: "Melhore clareza, coesão e tom acadêmico mantendo o sentido original.",
    icon: PenLine,
    credits: 1,
    href: "/dashboard/tools/rewrite",
    category: "core",
    group: "producao",
    popular: true,
  },
  {
    id: "grammar",
    type: "GRAMMAR",
    name: "Correção Gramatical",
    description: "Ortografia, concordância, pontuação e clareza para TCC e artigos.",
    icon: Sparkles,
    credits: 1,
    href: "/dashboard/tools/grammar",
    category: "core",
    group: "producao",
    popular: true,
  },
  {
    id: "scientific-language",
    type: "REWRITE",
    name: "Linguagem Científica",
    description: "Adequa texto informal ao padrão acadêmico-científico exigido na graduação.",
    icon: ScrollText,
    credits: 1,
    href: "/dashboard/tools/scientific-language",
    category: "core",
    group: "producao",
  },
  {
    id: "translate",
    type: "REWRITE",
    name: "Tradução Científica",
    description: "Traduza artigos PT↔EN preservando termos técnicos e registro acadêmico.",
    icon: Languages,
    credits: 2,
    href: "/dashboard/tools/translate",
    category: "core",
    group: "producao",
    popular: true,
  },
  {
    id: "expand-text",
    type: "REWRITE",
    name: "Expandir Texto Acadêmico",
    description: "Desenvolve parágrafos e argumentos para atingir extensão mínima com qualidade.",
    icon: FileText,
    credits: 2,
    href: "/dashboard/tools/expand-text",
    category: "core",
    group: "producao",
  },
  {
    id: "fichamento",
    type: "SUMMARIZE",
    name: "Fichamento de Artigo",
    description: "Ficha analítica com referência ABNT, citações, argumentos e crítica.",
    icon: ScrollText,
    credits: 2,
    href: "/dashboard/tools/fichamento",
    category: "core",
    group: "producao",
    popular: true,
  },

  // —— Pesquisa científica ——
  {
    id: "literature-synthesis",
    type: "SUMMARIZE",
    name: "Síntese Bibliográfica",
    description: "Integra múltiplos artigos em uma síntese coerente com pontos convergentes e divergentes.",
    icon: BookOpen,
    credits: 3,
    href: "/dashboard/tools/literature-synthesis",
    category: "premium",
    group: "pesquisa",
    popular: true,
  },
  {
    id: "research-gap",
    type: "CASE_STUDY",
    name: "Lacunas de Pesquisa",
    description: "Identifica o que falta na literatura e justifica a originalidade do seu trabalho.",
    icon: Search,
    credits: 2,
    href: "/dashboard/tools/research-gap",
    category: "premium",
    group: "pesquisa",
  },
  {
    id: "article-search",
    type: "CASE_STUDY",
    name: "Busca de Artigos",
    description: "Estratégia de busca em SciELO, PubMed, CAPES — operadores, filtros e strings.",
    icon: Search,
    credits: 1,
    href: "/dashboard/tools/article-search",
    category: "core",
    group: "pesquisa",
    popular: true,
  },

  // —— TCC e projetos ——
  {
    id: "research-theme",
    type: "CASE_STUDY",
    name: "Escolha de Tema",
    description: "Sugere temas viáveis, delimitados e alinhados ao seu curso e interesse.",
    icon: Lightbulb,
    credits: 1,
    href: "/dashboard/tools/research-theme",
    category: "core",
    group: "tcc",
    popular: true,
  },
  {
    id: "research-problem",
    type: "CASE_STUDY",
    name: "Problema e Objetivos",
    description: "Formula problema de pesquisa, objetivo geral, específicos e justificativa.",
    icon: ClipboardList,
    credits: 2,
    href: "/dashboard/tools/research-problem",
    category: "core",
    group: "tcc",
    popular: true,
  },
  {
    id: "methodology-builder",
    type: "CASE_STUDY",
    name: "Metodologia de Pesquisa",
    description: "Tipo de estudo, amostra, instrumentos, procedimentos e análise de dados.",
    icon: ClipboardList,
    credits: 2,
    href: "/dashboard/tools/methodology-builder",
    category: "premium",
    group: "tcc",
  },
  {
    id: "tcc-structure",
    type: "CASE_STUDY",
    name: "Estrutura de TCC",
    description: "Esqueleto capítulo a capítulo: introdução, metodologia, resultados e referencial.",
    icon: ClipboardList,
    credits: 2,
    href: "/dashboard/tools/tcc-structure",
    category: "premium",
    group: "tcc",
    popular: true,
  },
  {
    id: "case-study",
    type: "CASE_STUDY",
    name: "Estudo de Caso",
    description: "Estruture casos clínicos ou psicológicos com análise e referencial teórico.",
    icon: Brain,
    credits: 2,
    href: "/dashboard/tools/case-study",
    category: "premium",
    group: "tcc",
  },

  // —— Apresentações ——
  {
    id: "slides-builder",
    type: "CASE_STUDY",
    name: "Slides e Roteiro",
    description: "Estrutura de slides + roteiro de fala com tempo por slide para seminário ou banca.",
    icon: Presentation,
    credits: 2,
    href: "/dashboard/tools/slides-builder",
    category: "core",
    group: "apresentacao",
    popular: true,
  },
  {
    id: "defense-sim",
    type: "EXAM_SIM",
    name: "Simulação de Banca",
    description: "Perguntas prováveis da banca com sugestões de resposta para defesa de TCC.",
    icon: GraduationCap,
    credits: 3,
    href: "/dashboard/tools/defense-sim",
    category: "premium",
    group: "apresentacao",
    popular: true,
  },
];

export const areas: AreaConfig[] = [
  {
    slug: "saude",
    name: "Saúde",
    subtitle: "Medicina, Enfermagem, Farmácia, Fisioterapia, Nutrição, Odonto e áreas afins",
    icon: Stethoscope,
    color: "from-rose-500 to-pink-600",
    courses: ["Medicina", "Enfermagem", "Farmácia", "Fisioterapia", "Nutrição", "Odontologia", "Biomedicina"],
    tools: [
      {
        id: "drug-cards",
        name: "Cartões de Fármacos",
        description: "Mecanismo de ação, indicação, dose, contraindicações e interações.",
        credits: 2,
        promptHint: "medicamento ou princípio ativo",
        popular: true,
        systemPrompt:
          "Gere cartões de estudo farmacológico em markdown: nome, classe, mecanismo, indicações, dose usual, contraindicações, interações relevantes e cuidados de enfermagem. Baseie-se em evidências. Português BR.",
      },
      {
        id: "clinical-case",
        name: "Caso Clínico",
        description: "História clínica, hipóteses diagnósticas, exames e conduta.",
        credits: 3,
        promptHint: "caso clínico ou queixa principal",
        popular: true,
        systemPrompt:
          "Estruture caso clínico acadêmico: QP/HDA, antecedentes, exame físico sugerido, hipóteses diagnósticas diferenciais, exames complementares, conduta e discussão. Não substitui avaliação médica. Português BR.",
      },
      {
        id: "care-plan",
        name: "Plano de Cuidados",
        description: "Diagnósticos NANDA, intervenções NIC e resultados NOC.",
        credits: 3,
        promptHint: "cenário clínico ou diagnóstico de enfermagem",
        popular: true,
        systemPrompt:
          "Elabore plano de cuidados de enfermagem com: dados do caso, diagnósticos NANDA-I, intervenções NIC, resultados NOC esperados e racional. Formato acadêmico. Português BR.",
      },
      {
        id: "soap-anamnesis",
        name: "Anamnese e SOAP",
        description: "Roteiro de anamnese completa e registro SOAP estruturado.",
        credits: 2,
        promptHint: "queixa ou caso para anamnese",
        systemPrompt:
          "Gere anamnese sistematizada (identificação, QP, HDA, antecedentes, hábitos, revisão de sistemas) e registro SOAP (Subjetivo, Objetivo, Avaliação, Plano). Uso acadêmico/simulação. Português BR.",
      },
      {
        id: "sbar-handoff",
        name: "SBAR / Passagem de Plantão",
        description: "Comunicação clínica segura: Situação, Background, Avaliação, Recomendação.",
        credits: 1,
        promptHint: "situação clínica para passagem de plantão",
        systemPrompt:
          "Formate comunicação SBAR completa e concisa para passagem de plantão ou interconsulta. Inclua alertas de segurança. Português BR.",
      },
      {
        id: "dose-calc",
        name: "Cálculo de Doses",
        description: "Passo a passo de dosagem com fórmulas e conversão de unidades.",
        credits: 2,
        promptHint: "prescrição ou cálculo de dose",
        systemPrompt:
          "Resolva cálculo de dose passo a passo: dados, fórmula, conversões, resultado e conferência. Mostre raciocínio para estudo. Português BR.",
      },
      {
        id: "pathology-map",
        name: "Mapa de Patologias",
        description: "Etiologia, fisiopatologia, sinais, exames, diagnóstico e tratamento.",
        credits: 3,
        promptHint: "doença ou patologia",
        systemPrompt:
          "Crie mapa/resumo de patologia: definição, epidemiologia, etiologia, fisiopatologia, clínica, diagnóstico, tratamento e complicações. Formato de estudo. Português BR.",
      },
      {
        id: "semiology-guide",
        name: "Guia de Semiologia",
        description: "Como avaliar sinais e sintomas — roteiro de exame por sistema.",
        credits: 2,
        promptHint: "sistema ou sintoma para semiologia",
        systemPrompt:
          "Elabore guia de semiologia: inspeção, palpação, percussão, ausculta (quando aplicável), achados normais e alterados, perguntas orientadoras. Uso acadêmico. Português BR.",
      },
      {
        id: "exam-questions-health",
        name: "Questões Estilo Prova",
        description: "Questões objetivas e dissertativas — ENADE, residência ou avaliação da disciplina.",
        credits: 2,
        promptHint: "tema ou conteúdo da prova",
        popular: true,
        systemPrompt:
          "Gere 8 questões (mix objetiva e dissertativa) com gabarito comentado, nível graduação/residência, sobre o tema. Referencie conceitos-chave. Português BR.",
      },
      {
        id: "pico-evidence",
        name: "PICO e Evidência",
        description: "Estruture pergunta clínica PICO e estratégia de busca em bases científicas.",
        credits: 2,
        promptHint: "dúvida clínica ou tema de evidência",
        systemPrompt:
          "Formule pergunta PICO, descreva estratégia de busca (MeSH/decs), tipos de estudo relevantes e como avaliar evidência (níveis). Uso acadêmico em saúde. Português BR.",
      },
      {
        id: "bioethics-case",
        name: "Caso de Bioética",
        description: "Dilemas éticos, princípios bioéticos e argumentação para seminários.",
        credits: 2,
        promptHint: "dilema ético em saúde",
        systemPrompt:
          "Analise caso de bioética: fatos, stakeholders, princípios (autonomia, beneficência, não maleficência, justiça), posicionamentos e conclusão argumentada. Português BR.",
      },
      {
        id: "nursing-procedure",
        name: "Roteiro de Procedimento",
        description: "Passo a passo de técnicas: materiais, preparo, execução e cuidados.",
        credits: 2,
        promptHint: "procedimento de enfermagem ou técnica",
        systemPrompt:
          "Descreva roteiro de procedimento: indicação, materiais, preparo do ambiente/paciente, passos numerados, cuidados pós e intercorrências. Uso acadêmico. Português BR.",
      },
      {
        id: "patient-education",
        name: "Orientação ao Paciente",
        description: "Material de educação em saúde em linguagem acessível.",
        credits: 2,
        promptHint: "condição ou tratamento para orientar paciente",
        systemPrompt:
          "Crie orientação ao paciente/família: o que é, sinais de alerta, cuidados em casa, medicações (visão geral), quando procurar ajuda. Linguagem clara, sem jargão excessivo. Português BR.",
      },
      {
        id: "internship-report",
        name: "Relatório de Estágio Clínico",
        description: "Estrutura e reflexão crítica para estágio em unidades de saúde.",
        credits: 2,
        promptHint: "experiência de estágio clínico",
        systemPrompt:
          "Estruture relatório de estágio clínico: contexto da unidade, atividades, competências desenvolvidas, reflexão crítica (bioética, SUS, interprofissionalidade) e referências. Português BR.",
      },
    ],
  },
  {
    slug: "psicologia-humanas",
    name: "Psicologia & Humanas",
    subtitle: "Psicologia, Serviço Social, Pedagogia, História, Filosofia, Sociologia e afins",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    courses: ["Psicologia", "Serviço Social", "Pedagogia", "História", "Filosofia", "Sociologia", "Ciências Sociais"],
    tools: [
      {
        id: "case-analysis",
        name: "Análise de Caso",
        description: "Hipóteses, demanda, intervenção e referencial teórico.",
        credits: 2,
        promptHint: "estudo de caso psicológico ou social",
        popular: true,
        systemPrompt:
          "Analise caso: apresentação, hipóteses psicodinâmicas/comportamentais/sistêmicas (conforme contexto), objetivos, possíveis intervenções e referencial teórico. Uso acadêmico. Português BR.",
      },
      {
        id: "interview-analysis",
        name: "Codificação Qualitativa",
        description: "Categorias, temas e códigos a partir de transcrições de entrevistas.",
        credits: 3,
        promptHint: "transcrição de entrevista ou dados qualitativos",
        popular: true,
        systemPrompt:
          "Faça análise qualitativa: unidades de significado, codificação aberta, categorias, temas emergentes e citações ilustrativas. Mencione possível referência metodológica (Bardin, Charmaz, etc.). Português BR.",
      },
      {
        id: "interview-guide",
        name: "Roteiro de Entrevista",
        description: "Roteiro semiestruturado para pesquisa qualitativa ou clínica.",
        credits: 2,
        promptHint: "tema da pesquisa ou objetivo da entrevista",
        popular: true,
        systemPrompt:
          "Elabore roteiro de entrevista semiestruturada: apresentação, termo de consentimento (orientações), perguntas principais, provocações e encerramento. Alinhado ao objetivo de pesquisa. Português BR.",
      },
      {
        id: "theory-map",
        name: "Mapa Teórico",
        description: "Relações entre teorias, autores, conceitos e escolas de pensamento.",
        credits: 3,
        promptHint: "tema ou autores para mapa teórico",
        systemPrompt:
          "Construa mapa teórico: conceitos-chave, autores, relações, convergências e divergências entre abordagens. Formato visual em markdown (tópicos hierárquicos). Português BR.",
      },
      {
        id: "literature-matrix",
        name: "Matriz de Revisão Bibliográfica",
        description: "Tabela comparativa de autores, métodos, resultados e lacunas.",
        credits: 3,
        promptHint: "artigos ou tema da revisão",
        popular: true,
        systemPrompt:
          "Monte matriz de revisão bibliográfica em tabela markdown: autor/ano, objetivo, metodologia, principais resultados, limitações e contribuição. Identifique lacunas. Português BR.",
      },
      {
        id: "compare-studies",
        name: "Comparar Estudos",
        description: "Compara autores, métodos e conclusões entre artigos sobre o mesmo tema.",
        credits: 2,
        promptHint: "artigos ou estudos a comparar",
        popular: true,
        systemPrompt:
          "Compare estudos científicos em tabela: autores, contexto, metodologia, amostra, resultados, limitações e implicações. Destaque convergências e divergências. Português BR.",
      },
      {
        id: "tcc-chapters",
        name: "TCC por Capítulos",
        description: "Esqueleto detalhado de monografia com orientações por seção.",
        credits: 2,
        promptHint: "tema do TCC e curso",
        popular: true,
        systemPrompt:
          "Estruture TCC/monografia: capa/preliminares, introdução (problema, objetivos, justificativa), referencial, metodologia, cronograma, resultados esperados, referências sugeridas. ABNT. Português BR.",
      },
      {
        id: "theoretical-framework",
        name: "Referencial Teórico",
        description: "Alinhe problema de pesquisa, categorias e autores fundamentais.",
        credits: 3,
        promptHint: "problema de pesquisa e área",
        systemPrompt:
          "Desenvolva referencial teórico: problema, categorias analíticas, autores clássicos e contemporâneos, diálogo entre teorias e encaixe com a pesquisa. Tom acadêmico. Português BR.",
      },
      {
        id: "psych-formulation",
        name: "Formulação de Caso",
        description: "Histórico, hipóteses clínicas, eixo diagnóstico conceitual e plano terapêutico.",
        credits: 3,
        promptHint: "caso clínico psicológico",
        systemPrompt:
          "Elabore formulação de caso psicológico: histórico, queixa, fatores predisponentes/precipitantes/manutenção, hipóteses clínicas, eixos conceituais (sem emitir diagnóstico definitivo) e plano de intervenção sugerido. Uso acadêmico/supervisão. Português BR.",
      },
      {
        id: "critical-review",
        name: "Resenha Crítica",
        description: "Resumo analítico com posicionamento crítico sobre obra ou artigo.",
        credits: 2,
        promptHint: "livro, filme ou artigo para resenha",
        systemPrompt:
          "Escreva estrutura de resenha crítica: apresentação da obra, síntese, análise crítica (mérito/limites), diálogo com outros autores e conclusão. Português BR.",
      },
      {
        id: "questionnaire-scale",
        name: "Questionário / Escala",
        description: "Elaboração de itens Likert, instruções e análise de validade de face.",
        credits: 2,
        promptHint: "constructo a medir ou objetivo do instrumento",
        systemPrompt:
          "Proponha questionário/escala: constructo, itens (Likert 5 pontos), instruções ao respondente, considerações sobre validade de face e aplicação em pesquisa. Português BR.",
      },
      {
        id: "intervention-plan",
        name: "Plano de Intervenção",
        description: "Objetivos, técnicas, sessões e critérios de encerramento.",
        credits: 2,
        promptHint: "demanda e contexto de intervenção",
        systemPrompt:
          "Elabore plano de intervenção psicológica/social: objetivos SMART, técnicas por sessão, materiais, critérios de evolução e encerramento. Referencial teórico explícito. Português BR.",
      },
      {
        id: "discourse-analysis",
        name: "Análise de Discurso",
        description: "Categorias discursivas, ideologias e efeitos de sentido no texto.",
        credits: 3,
        promptHint: "texto ou trecho para análise discursiva",
        systemPrompt:
          "Faça análise de discurso acadêmica: contexto de produção, categorias discursivas, presupostos, interdiscursividade e efeitos de sentido. Cite trechos. Português BR.",
      },
      {
        id: "reflective-report",
        name: "Relato Reflexivo",
        description: "Roteiro para estágio supervisionado e reflexão sobre prática.",
        credits: 2,
        promptHint: "experiência de estágio ou prática",
        systemPrompt:
          "Estruture relato reflexivo: descrição da experiência, análise à luz de referencial teórico, aprendizados, limitações e implicações para a formação. Português BR.",
      },
      {
        id: "field-diary",
        name: "Diário de Campo",
        description: "Registro de observação participante para pesquisa etnográfica.",
        credits: 2,
        promptHint: "contexto de pesquisa de campo",
        systemPrompt:
          "Organize diário de campo: data/local, descrição densa, impressões, categorias preliminares e questões emergentes. Metodologia qualitativa. Português BR.",
      },
      {
        id: "research-timeline",
        name: "Cronograma de Pesquisa",
        description: "Gantt acadêmico: etapas, prazos e entregas do projeto.",
        credits: 1,
        promptHint: "tipo de pesquisa e prazo total",
        systemPrompt:
          "Monte cronograma de pesquisa em tabela/Gantt: etapas (referencial, coleta, análise, redação), duração, entregas parciais. Realista para graduação. Português BR.",
      },
    ],
  },
];

export function getToolsByGroup(group: ToolGroup) {
  return tools.filter((t) => t.group === group);
}

export function getToolById(id: string) {
  return tools.find((t) => t.id === id);
}

export function getAreaBySlug(slug: string) {
  return areas.find((a) => a.slug === slug);
}

export function getAllAreaTools() {
  return areas.flatMap((a) =>
    a.tools.map((t) => ({ ...t, areaSlug: a.slug, areaName: a.name }))
  );
}

export const platformFocus = {
  title: "Saúde e Psicologia & Humanas",
  description:
    "Ferramentas de IA feitas para quem estuda e trabalha com gente — clínica, pesquisa qualitativa e produção acadêmica.",
};
