import {
  getToolMaxTokens,
  getUserPromptSuffix,
} from "@/lib/ai-config";
import type { GenerateAIOptions } from "@/lib/ai";

export const SUMMARIZE_TOOL_ID = "summarize";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function buildSummarizeUserPrompt(input: string): string {
  const words = countWords(input);

  let scaleHint: string;
  if (words <= 120) {
    scaleHint = `\n\n[Material curto: ~${words} palavras. Entregue resumo breve e proporcional — título + 1 a 3 parágrafos ou no máximo 3 seções curtas (Introdução, Desenvolvimento, Síntese). PROIBIDO criar subtópicos numerados (2.1, 2.2…) ou ampliar com história, teorias ou exemplos que não estejam no texto.]`;
  } else if (words <= 500) {
    scaleHint = `\n\n[Material médio: ~${words} palavras. Estruture com seções ABNT apenas para temas distintos que existem no original. Subtópicos numerados somente se o material já tiver múltiplos temas claros — nunca invente seções para preencher estrutura.]`;
  } else {
    scaleHint = `\n\n[Material extenso: ~${words} palavras. Resumo acadêmico estruturado cobrindo todos os temas do original, sem inventar conteúdo externo.]`;
  }

  return `${input}${scaleHint}${getUserPromptSuffix(SUMMARIZE_TOOL_ID, { json: false })}`;
}

export function getSummarizeMaxTokens(wordCount: number): number {
  if (wordCount <= 120) return 900;
  if (wordCount <= 500) return 2_500;
  if (wordCount <= 2_000) return 5_000;
  return getToolMaxTokens(SUMMARIZE_TOOL_ID, false);
}

export function getSummarizeAIOptions(input: string): GenerateAIOptions {
  const words = countWords(input);
  return {
    toolId: SUMMARIZE_TOOL_ID,
    temperature: 0.2,
    maxTokens: getSummarizeMaxTokens(words),
  };
}
