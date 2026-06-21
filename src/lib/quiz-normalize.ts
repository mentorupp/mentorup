export const PDF_QUIZ_TOOL_ID = "pdf-quiz";

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
};

export type RawQuizData = {
  questions?: Array<{
    type?: string;
    question?: string;
    options?: string[];
    answer?: number | string;
    explanation?: string;
    rubric?: string;
    points?: number;
    modelAnswer?: string;
    suggestedAnswer?: string;
  }>;
  title?: string;
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
      return trimmed.toUpperCase().charCodeAt(0) - 65;
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

function normalizeQuestion(raw: RawQuizData["questions"] extends (infer T)[] | undefined ? T : never): QuizQuestion | null {
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

  const options = (raw.options ?? [])
    .map((opt) => stripOptionPrefix(String(opt).trim()))
    .filter(Boolean);

  if (options.length < 2) return null;

  const answerIndex = normalizeAnswerIndex(raw.answer, options.length);
  const resolvedAnswer =
    answerIndex !== undefined && answerIndex >= 0 && answerIndex < options.length
      ? answerIndex
      : 0;

  return {
    type: "objective",
    question,
    options: options.slice(0, 5),
    answer: resolvedAnswer,
    correctLetter: indexToLetter(resolvedAnswer),
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
    questions,
  };
}

export function getQuizAIOptions(input: string) {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  return {
    toolId: PDF_QUIZ_TOOL_ID,
    temperature: 0.3,
    maxTokens: words <= 150 ? 4_000 : undefined,
  };
}
