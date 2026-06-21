import sharp from "sharp";
import {
  AIError,
  generateAI,
  generateAIVision,
  parseAIJsonResult,
  type VisionImage,
} from "@/lib/ai";

export class ExamPhotoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExamPhotoError";
  }
}

export const EXAM_CORRECTION_TOOL_ID = "exam-correction";

const TRANSCRIBE_SYSTEM = `EXAM_VISION_TRANSCRIBE — Você é um sistema de leitura (OCR) de provas escolares e universitárias.

Sua ÚNICA função: transcrever EXATAMENTE o que está VISÍVEL nas imagens. Você NÃO corrige, NÃO responde, NÃO inventa.

REGRAS ABSOLUTAS (violar = erro grave):
1. PROIBIDO inventar, completar ou supor questões que não apareçam claramente na foto.
2. PROIBIDO usar conhecimento da matéria para criar enunciados ou alternativas.
3. Transcreva enunciados palavra por palavra, na medida do legível.
4. Texto ilegível → use [ilegível] no trecho — NUNCA adivinhe palavras.
5. Questão inteira ilegível → legibility: "unreadable" (não invente o enunciado).
6. Inclua SOMENTE questões visíveis nas imagens enviadas.
7. Alternativas (A–E): transcreva exatamente como impressas; se não visíveis, options: null.
8. Resposta marcada pelo aluno: transcreva só se claramente visível (ex.: "B", "Verdadeiro", texto riscado).

Responda APENAS JSON válido:
{
  "imageQuality": "good" | "fair" | "poor",
  "qualityNote": "string — descreva nitidez, recorte, inclinação, sombra",
  "warnings": ["string"],
  "questions": [{
    "number": "1",
    "type": "objective" | "discursive" | "true_false" | "other",
    "questionText": "enunciado transcrito literalmente",
    "options": ["A) ...", "B) ..."] | null,
    "studentAnswer": "string | null",
    "legibility": "clear" | "partial" | "unreadable",
    "pageIndex": 1
  }]
}`;

const CORRECT_SYSTEM = `EXAM_VISION_CORRECT — Você corrige provas com base EXCLUSIVAMENTE na transcrição OCR fornecida.

REGRAS:
1. Trabalhe SOMENTE com as questões listadas na transcrição — PROIBIDO adicionar questões.
2. Use o questionText da transcrição como enunciado (não reescreva).
3. legibility "unreadable": status "skipped", correctAnswer null, explanation pedindo nova foto.
4. legibility "partial": responda com confidence "medium" e avise incertezas.
5. legibility "clear": responda com confidence "high" quando possível.
6. Objetivas: correctAnswer = letra ou texto da alternativa correta.
7. Dissertativas: correctAnswer = resposta modelo concisa; isCorrect se houver resposta do aluno.

Responda APENAS JSON:
{
  "summary": {
    "title": "string | null",
    "totalQuestions": number,
    "correctCount": number | null,
    "note": "string | null"
  },
  "items": [{
    "number": "string",
    "type": "objective" | "discursive" | "true_false" | "other",
    "question": "string (copiar da transcrição)",
    "studentAnswer": "string | null",
    "correctAnswer": "string | null",
    "isCorrect": boolean | null,
    "explanation": "string | null",
    "confidence": "high" | "medium" | "low",
    "status": "answered" | "skipped"
  }]
}`;

export type TranscribedQuestion = {
  number: string;
  type?: string;
  questionText?: string;
  options?: string[] | null;
  studentAnswer?: string | null;
  legibility?: "clear" | "partial" | "unreadable";
  pageIndex?: number;
};

export type TranscriptionResult = {
  imageQuality?: "good" | "fair" | "poor";
  qualityNote?: string;
  warnings?: string[];
  questions?: TranscribedQuestion[];
};

export type CorrectionItem = {
  number?: string;
  type?: string;
  question?: string;
  studentAnswer?: string | null;
  correctAnswer?: string | null;
  isCorrect?: boolean | null;
  explanation?: string | null;
  confidence?: "high" | "medium" | "low";
  status?: "answered" | "skipped";
};

export type CorrectionResult = {
  summary?: {
    title?: string | null;
    totalQuestions?: number;
    correctCount?: number | null;
    note?: string | null;
  };
  items?: CorrectionItem[];
  transcription?: TranscriptionResult;
  imageQuality?: string;
  qualityNote?: string;
  warnings?: string[];
};

export async function preprocessExamImage(buffer: Buffer): Promise<VisionImage> {
  let pipeline = sharp(buffer, { failOn: "none" }).rotate();

  const meta = await pipeline.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const maxDim = 2048;

  if (width > maxDim || height > maxDim) {
    pipeline = pipeline.resize({
      width: maxDim,
      height: maxDim,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    });
  }

  const processed = await pipeline
    .normalize()
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.25 })
    .jpeg({ quality: 94, mozjpeg: true })
    .toBuffer();

  return {
    base64: processed.toString("base64"),
    mimeType: "image/jpeg",
  };
}

function parseTranscription(raw: string): TranscriptionResult {
  return parseAIJsonResult(raw) as TranscriptionResult;
}

function parseCorrection(raw: string): CorrectionResult {
  return parseAIJsonResult(raw) as CorrectionResult;
}

export function validateTranscription(transcription: TranscriptionResult): void {
  const questions = transcription.questions ?? [];

  if (questions.length === 0) {
    throw new ExamPhotoError(
      "Não encontramos questões legíveis na foto. Enquadre a prova inteira, use boa luz e evite sombra ou blur."
    );
  }

  const readable = questions.filter((q) => q.legibility !== "unreadable");
  if (readable.length === 0) {
    throw new ExamPhotoError(
      "A foto está ilegível. Tire outra com mais luz, foco na página e sem inclinar demais o celular."
    );
  }

  if (transcription.imageQuality === "poor" && readable.length < questions.length * 0.5) {
    throw new ExamPhotoError(
      "Qualidade da foto insuficiente. Aproxime, foque e fotografe com a página reta e bem iluminada."
    );
  }
}

export function mergeCorrectionResult(
  transcription: TranscriptionResult,
  correction: CorrectionResult,
  includeExplanation: boolean
): CorrectionResult {
  const transcribed = transcription.questions ?? [];
  const correctionItems = correction.items ?? [];

  const items: CorrectionItem[] = transcribed.map((tq) => {
    const num = String(tq.number);
    const fromAi = correctionItems.find((i) => String(i.number) === num);

    if (tq.legibility === "unreadable" || !tq.questionText?.trim()) {
      return {
        number: num,
        type: tq.type ?? "other",
        question: tq.questionText?.trim() || `[Questão ${num} — texto ilegível na foto]`,
        studentAnswer: tq.studentAnswer ?? null,
        correctAnswer: null,
        isCorrect: null,
        confidence: "low",
        status: "skipped",
        explanation: includeExplanation
          ? "Não foi possível ler esta questão na imagem. Tire uma foto mais nítida, com a questão completa enquadrada."
          : null,
      };
    }

    const question = tq.questionText.trim();
    const studentAnswer = tq.studentAnswer ?? fromAi?.studentAnswer ?? null;

    if (!fromAi || fromAi.status === "skipped") {
      return {
        number: num,
        type: tq.type ?? fromAi?.type ?? "other",
        question,
        studentAnswer,
        correctAnswer: fromAi?.correctAnswer ?? null,
        isCorrect: fromAi?.isCorrect ?? null,
        confidence: tq.legibility === "partial" ? "medium" : fromAi?.confidence ?? "medium",
        status: "answered",
        explanation: includeExplanation ? fromAi?.explanation ?? null : null,
      };
    }

    return {
      number: num,
      type: fromAi.type ?? tq.type ?? "other",
      question,
      studentAnswer,
      correctAnswer: fromAi.correctAnswer ?? null,
      isCorrect: fromAi.isCorrect ?? null,
      confidence:
        tq.legibility === "partial"
          ? "medium"
          : fromAi.confidence ?? "high",
      status: "answered",
      explanation: includeExplanation ? fromAi.explanation ?? null : null,
    };
  });

  // Remove itens que a IA inventou e não existem na transcrição
  const allowed = new Set(items.map((i) => String(i.number)));
  const hallucinated = correctionItems.filter((i) => !allowed.has(String(i.number)));
  const warnings = [...(transcription.warnings ?? [])];
  if (hallucinated.length > 0) {
    warnings.push(
      `${hallucinated.length} questão(ões) ignorada(s) por não constarem na foto (evitamos inventar conteúdo).`
    );
  }

  const answered = items.filter((i) => i.status === "answered" && i.isCorrect != null);
  const correctCount = answered.filter((i) => i.isCorrect === true).length;

  return {
    summary: {
      title: correction.summary?.title ?? null,
      totalQuestions: items.length,
      correctCount: studentAnswerProvided(items) ? correctCount : correction.summary?.correctCount ?? null,
      note: buildSummaryNote(transcription, correction),
    },
    items,
    transcription,
    imageQuality: transcription.imageQuality,
    qualityNote: transcription.qualityNote,
    warnings,
  };
}

function studentAnswerProvided(items: CorrectionItem[]): boolean {
  return items.some((i) => i.studentAnswer != null && String(i.studentAnswer).trim() !== "");
}

function buildSummaryNote(
  transcription: TranscriptionResult,
  correction: CorrectionResult
): string | null {
  const parts: string[] = [];
  if (transcription.imageQuality === "fair") {
    parts.push("Foto aceitável — para maior precisão, use mais luz e mantenha o celular paralelo à página.");
  }
  if (transcription.imageQuality === "poor") {
    parts.push("Foto com qualidade limitada — algumas respostas podem exigir confirmação.");
  }
  if (correction.summary?.note) parts.push(correction.summary.note);
  return parts.length ? parts.join(" ") : null;
}

export async function runExamCorrection(input: {
  images: VisionImage[];
  includeExplanation: boolean;
  notes?: string;
}): Promise<{ result: CorrectionResult; demo: boolean; demoReason?: string }> {
  let userTranscribe =
    "Transcreva SOMENTE as questões visíveis nestas imagens de prova. Não corrija. Não invente questões.";

  if (input.notes) {
    userTranscribe += `\n\nContexto do aluno (não invente questões por causa disso): ${input.notes}`;
  }

  const transcribeResult = await generateAIVision(
    TRANSCRIBE_SYSTEM,
    userTranscribe,
    input.images,
    true,
    { model: "gpt-4o", temperature: 0, toolId: EXAM_CORRECTION_TOOL_ID }
  );

  const transcription = parseTranscription(transcribeResult.text);
  validateTranscription(transcription);

  const readableQuestions = (transcription.questions ?? []).filter(
    (q) => q.legibility !== "unreadable" && q.questionText?.trim()
  );

  let userCorrect = `Transcrição OCR (fonte única — não adicione questões além desta lista):\n${JSON.stringify(
    { ...transcription, questions: readableQuestions },
    null,
    2
  )}`;

  userCorrect += input.includeExplanation
    ? "\n\nForneça gabarito com explanation em cada questão legível."
    : "\n\nForneça APENAS gabarito (correctAnswer). Sem explanation.";

  const correctResult = await generateAI(
    CORRECT_SYSTEM,
    userCorrect,
    true,
    { toolId: EXAM_CORRECTION_TOOL_ID, temperature: 0 }
  );

  const correction = parseCorrection(correctResult.text);
  const merged = mergeCorrectionResult(transcription, correction, input.includeExplanation);

  const demo = transcribeResult.demo || correctResult.demo;
  const demoReason = transcribeResult.demoReason ?? correctResult.demoReason;

  return { result: merged, demo, demoReason };
}
