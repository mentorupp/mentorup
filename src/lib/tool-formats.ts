export type RawFlashcards = {
  title?: string;
  cards?: Array<{ front?: string; back?: string }>;
};

export type RawCitations = {
  summary?: string;
  citations?: Array<{
    type?: string;
    formatted?: string;
    reference?: string;
    sourceLabel?: string;
    notes?: string;
  }>;
  warnings?: string[];
};

export type RawChatPdf = {
  question?: string;
  answer?: string;
  excerpts?: Array<{ quote?: string; context?: string }>;
  references?: string[];
  confidence?: "high" | "medium" | "low";
  followUp?: string[];
};

export type RawExplainContent = {
  title?: string;
  summary?: string;
  sections?: Array<{
    heading?: string;
    content?: string;
    example?: string;
  }>;
  glossary?: Array<{ term?: string; definition?: string }>;
  commonMistakes?: string[];
  reviewQuestions?: string[];
};

export type RawExerciseSolution = {
  title?: string;
  exercises?: Array<{
    number?: number | string;
    statement?: string;
    steps?: string[];
    answer?: string;
    verification?: string;
  }>;
};

export type RawDefenseSim = {
  title?: string;
  questions?: Array<{
    question?: string;
    category?: string;
    suggestedAnswer?: string;
    tips?: string;
  }>;
};

export type RawArticleSearch = {
  title?: string;
  databases?: string[];
  booleanQueries?: Array<{ label?: string; query?: string }>;
  descriptors?: { mesh?: string[]; decs?: string[] };
  inclusionCriteria?: string[];
  exclusionCriteria?: string[];
  selectionFlow?: string[];
  readingStrategy?: string;
};

export type RawResearchTheme = {
  title?: string;
  themes?: Array<{
    title?: string;
    delimitation?: string;
    justification?: string;
    viability?: string;
    methodology?: string;
    keywords?: string[];
  }>;
};

export function normalizeFlashcards(raw: RawFlashcards) {
  const cards = (raw.cards ?? [])
    .filter((c) => c.front?.trim() && c.back?.trim())
    .map((c) => ({
      front: c.front!.trim().slice(0, 200),
      back: c.back!.trim(),
    }));
  return {
    title: raw.title?.trim() || "Flashcards",
    cards: cards.length >= 1 ? cards : [],
  };
}

export function normalizeCitations(raw: RawCitations) {
  const citations = (raw.citations ?? [])
    .filter((c) => c.formatted?.trim())
    .map((c) => ({
      type: c.type?.trim() || "other",
      formatted: c.formatted!.trim(),
      reference: c.reference?.trim(),
      sourceLabel: c.sourceLabel?.trim(),
      notes: c.notes?.trim(),
    }));
  return {
    summary: raw.summary?.trim(),
    citations,
    warnings: (raw.warnings ?? []).filter(Boolean),
  };
}

export function normalizeChatPdf(raw: RawChatPdf) {
  return {
    question: raw.question?.trim() || "Pergunta",
    answer: raw.answer?.trim() || "",
    excerpts: (raw.excerpts ?? [])
      .filter((e) => e.quote?.trim())
      .map((e) => ({
        quote: e.quote!.trim(),
        context: e.context?.trim(),
      })),
    references: (raw.references ?? []).filter(Boolean),
    confidence: raw.confidence ?? "medium",
    followUp: (raw.followUp ?? []).filter(Boolean),
  };
}

export function normalizeExplainContent(raw: RawExplainContent) {
  const sections = (raw.sections ?? [])
    .filter((s) => s.heading?.trim() && s.content?.trim())
    .map((s) => ({
      heading: s.heading!.trim(),
      content: s.content!.trim(),
      example: s.example?.trim(),
    }));

  return {
    title: raw.title?.trim() || "Explicação do conteúdo",
    summary: raw.summary?.trim(),
    sections,
    glossary: (raw.glossary ?? [])
      .filter((g) => g.term?.trim() && g.definition?.trim())
      .map((g) => ({ term: g.term!.trim(), definition: g.definition!.trim() })),
    commonMistakes: (raw.commonMistakes ?? []).filter(Boolean),
    reviewQuestions: (raw.reviewQuestions ?? []).filter(Boolean),
  };
}

export function normalizeExerciseSolution(raw: RawExerciseSolution) {
  const exercises = (raw.exercises ?? [])
    .filter((e) => e.statement?.trim())
    .map((e, i) => ({
      number: e.number ?? i + 1,
      statement: e.statement!.trim(),
      steps: (e.steps ?? []).filter(Boolean),
      answer: e.answer?.trim() || "",
      verification: e.verification?.trim(),
    }));

  return {
    title: raw.title?.trim() || "Exercícios resolvidos",
    exercises,
  };
}

export function normalizeDefenseSim(raw: RawDefenseSim) {
  const questions = (raw.questions ?? [])
    .filter((q) => q.question?.trim())
    .map((q) => ({
      question: q.question!.trim(),
      category: q.category?.trim() || "Geral",
      suggestedAnswer: q.suggestedAnswer?.trim() || "",
      tips: q.tips?.trim(),
    }));

  return {
    title: raw.title?.trim() || "Simulação de banca",
    questions,
  };
}

export function normalizeArticleSearch(raw: RawArticleSearch) {
  return {
    title: raw.title?.trim() || "Estratégia de busca bibliográfica",
    databases: (raw.databases ?? []).filter(Boolean),
    booleanQueries: (raw.booleanQueries ?? [])
      .filter((q) => q.query?.trim())
      .map((q) => ({
        label: q.label?.trim() || "Busca",
        query: q.query!.trim(),
      })),
    descriptors: {
      mesh: (raw.descriptors?.mesh ?? []).filter(Boolean),
      decs: (raw.descriptors?.decs ?? []).filter(Boolean),
    },
    inclusionCriteria: (raw.inclusionCriteria ?? []).filter(Boolean),
    exclusionCriteria: (raw.exclusionCriteria ?? []).filter(Boolean),
    selectionFlow: (raw.selectionFlow ?? []).filter(Boolean),
    readingStrategy: raw.readingStrategy?.trim(),
  };
}

export function normalizeResearchTheme(raw: RawResearchTheme) {
  const themes = (raw.themes ?? [])
    .filter((t) => t.title?.trim())
    .map((t) => ({
      title: t.title!.trim(),
      delimitation: t.delimitation?.trim() || "",
      justification: t.justification?.trim() || "",
      viability: t.viability?.trim() || "",
      methodology: t.methodology?.trim() || "",
      keywords: (t.keywords ?? []).filter(Boolean),
    }));

  return {
    title: raw.title?.trim() || "Sugestões de temas de pesquisa",
    themes,
  };
}
