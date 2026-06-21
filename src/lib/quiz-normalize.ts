export const PDF_QUIZ_TOOL_ID = "pdf-quiz";
export const EXAM_SIM_TOOL_ID = "exam-sim";

export type QuizQuestion = {
  type: "objective" | "discursive" | string;
  question: string;
  options?: string[];
  answer?: number;
  correctLetter?: string;
  explanation?: string;
  rubric?: string;
  points?: number;
  modelAnswer?: string;
};

export type QuizData = {
  questions?: QuizQuestion[];
  title?: string;
  duration?: string;
  totalPoints?: number;
  instructions?: string;
};

export type RawQuizQuestion = {
  type?: string;
  question?: string;
  options?: string[];
  answer?: number | string;
  correctAnswer?: number | string;
  correctOption?: number | string;
  explanation?: string;
  rubric?: string;
  points?: number;
  modelAnswer?: string;
  suggestedAnswer?: string;
};

export type RawQuizData = {
  questions?: RawQuizQuestion[];
  title?: string;
  duration?: string;
  totalPoints?: number;
  instructions?: string;
};

export type RawExamSimData = {
  exam?: RawQuizData;
  title?: string;
  questions?: RawQuizQuestion[];
};

/** Remove prefixo "A)", "B.", etc. que a IA às vezes inclui no texto da alternativa */
export function stripOptionPrefix(option: string): string {
  return option.replace(/^[A-Ea-e]\s*[\).:\-–]\s*/, "").trim();
}

export function normalizeAnswerIndex(
  answer: unknown,
  optionsLength: number
): number | undefined {
  if (answer === undefined || answer === null || optionsLength === 0) {
    return undefined;
  }

  if (typeof answer === "number" && Number.isFinite(answer)) {
    const int = Math.trunc(answer);
    if (int >= 0 && int < optionsLength) return int;
    if (int >= 1 && int <= optionsLength) return int - 1;
  }

  if (typeof answer === "string") {
    const trimmed = answer.trim();
    if (/^[A-Ea-e]$/.test(trimmed)) {
      const idx = trimmed.toUpperCase().charCodeAt(0) - 65;
      if (idx >= 0 && idx < optionsLength) return idx;
    }
    const num = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(num)) {
      if (num >= 0 && num < optionsLength) return num;
      if (num >= 1 && num <= optionsLength) return num - 1;
    }
  }

  return undefined;
}

export function indexToLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function dedupeOptions(options: string[]): string[] {
  const seen = new Set<string>();
  return options.filter((opt) => {
    const key = opt.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Embaralha alternativas para o gabarito não ficar sempre na letra A */
function shuffleOptionsWithAnswer(
  options: string[],
  answerIndex: number
): { options: string[]; answer: number } {
  const items = options.map((text, i) => ({ text, isCorrect: i === answerIndex }));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return {
    options: items.map((x) => x.text),
    answer: items.findIndex((x) => x.isCorrect),
  };
}

function resolveRawAnswer(raw: RawQuizQuestion, optionsLength: number): number | undefined {
  const candidates = [raw.answer, raw.correctAnswer, raw.correctOption];
  for (const candidate of candidates) {
    const idx = normalizeAnswerIndex(candidate, optionsLength);
    if (idx !== undefined) return idx;
  }
  return undefined;
}

function normalizeQuestion(raw: RawQuizQuestion): QuizQuestion | null {
  if (!raw?.question?.trim()) return null;

  const type = raw.type === "discursive" ? "discursive" : "objective";
  const question = raw.question.trim();

  if (type === "discursive") {
    return {
      type,
      question,
      rubric: raw.rubric?.trim(),
      points: raw.points,
      modelAnswer: raw.modelAnswer?.trim() || raw.suggestedAnswer?.trim() || raw.explanation?.trim(),
      explanation: raw.explanation?.trim(),
    };
  }

  const options = dedupeOptions(
    (raw.options ?? []).map((opt) => stripOptionPrefix(String(opt).trim())).filter(Boolean)
  );

  if (options.length < 4) return null;

  const trimmedOptions = options.slice(0, 4);
  const answerIndex = resolveRawAnswer(raw, trimmedOptions.length);

  // Sem gabarito válido → descarta questão (nunca assume letra A)
  if (answerIndex === undefined) return null;

  const shuffled = shuffleOptionsWithAnswer(trimmedOptions, answerIndex);

  return {
    type: "objective",
    question,
    options: shuffled.options,
    answer: shuffled.answer,
    correctLetter: indexToLetter(shuffled.answer),
    explanation: raw.explanation?.trim(),
    points: raw.points ?? 1,
  };
}

export function normalizeQuizData(raw: RawQuizData): QuizData {
  const questions = (raw.questions ?? [])
    .map((q) => normalizeQuestion(q))
    .filter((q): q is QuizQuestion => q !== null);

  return {
    title: raw.title?.trim(),
    duration: raw.duration?.trim(),
    totalPoints: raw.totalPoints,
    instructions: raw.instructions?.trim(),
    questions,
  };
}

export function normalizeExamSimData(raw: RawExamSimData | RawQuizData): QuizData {
  const exam = "exam" in raw && raw.exam ? raw.exam : (raw as RawQuizData);
  const normalized = normalizeQuizData(exam);
  const totalPoints =
    normalized.totalPoints ??
    normalized.questions?.reduce((sum, q) => sum + (q.points ?? 1), 0);

  return { ...normalized, totalPoints };
}

export function buildQuizUserPrompt(input: string, toolId: string): string {
  const base =
    toolId === EXAM_SIM_TOOL_ID
      ? `[SIMULADO DE PROVA — use EXCLUSIVAMENTE o material abaixo]

Requisitos obrigatórios:
- 15 a 20 questões cobrindo tópicos DIFERENTES do material (não repita o mesmo conceito)
- Questões objetivas: enunciado específico citando conceitos, autores, datas ou termos DO TEXTO
- 4 alternativas DISTINTAS e plausíveis — apenas UMA correta com base no material
- Campo "answer": índice 0-based (0=A, 1=B, 2=C, 3=D) — VARIE o gabarito entre questões
- PROIBIDO: questões genéricas ("qual alternativa reflete o conteúdo"), alternativas vagas ou iguais
- Inclua 3-5 questões dissertativas intercaladas
- "explanation" obrigatória em cada objetiva, citando o trecho/conceito do material

`
      : `[QUESTÕES DE ESTUDO — use EXCLUSIVAMENTE o material abaixo]

Requisitos:
- Questões específicas ao conteúdo enviado (nomes, conceitos, definições do texto)
- 4 alternativas distintas; "answer" como índice 0-based variando entre questões
- PROIBIDO alternativas genéricas ou gabarito sempre 0

`;

  return base + input;
}

export function getQuizAIOptions(input: string) {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  return {
    toolId: PDF_QUIZ_TOOL_ID,
    temperature: 0.25,
    maxTokens: words <= 150 ? 5_000 : words <= 500 ? 8_000 : 10_000,
  };
}

export function getExamSimAIOptions(input: string) {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  return {
    toolId: EXAM_SIM_TOOL_ID,
    temperature: 0.25,
    maxTokens: words <= 200 ? 8_000 : words <= 600 ? 12_000 : 14_000,
  };
}
