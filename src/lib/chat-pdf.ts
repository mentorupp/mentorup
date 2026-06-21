export const CHAT_PDF_TOOL_ID = "chat-pdf";

export const CHAT_PDF_QUESTION_MARKER = "PERGUNTA DO ALUNO";
export const CHAT_PDF_DOCUMENT_MARKER = "DOCUMENTO";

export type ChatPdfInput = {
  question: string;
  document: string;
};

export function buildChatPdfUserPrompt({ question, document }: ChatPdfInput): string {
  const q = question.trim();
  const doc = document.trim();

  return `${CHAT_PDF_QUESTION_MARKER} (responda SOMENTE esta pergunta — não invente outra):
${q}

---
${CHAT_PDF_DOCUMENT_MARKER}:
${doc}`;
}

/** Extrai a pergunta enviada pelo aluno do prompt estruturado */
export function extractChatPdfQuestion(input: string): string | null {
  const marker = new RegExp(
    `${CHAT_PDF_QUESTION_MARKER}[^\\n]*\\n([\\s\\S]*?)\\n\\n---\\n${CHAT_PDF_DOCUMENT_MARKER}:`,
    "i"
  );
  const match = input.match(marker);
  const question = match?.[1]?.trim();
  return question && question.length >= 5 ? question : null;
}

export function getChatPdfAIOptions() {
  return {
    toolId: CHAT_PDF_TOOL_ID,
    temperature: 0.15,
    maxTokens: 6_000,
  };
}
