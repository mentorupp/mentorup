import type { GenerateAIOptions } from "@/lib/ai";
import {
  estimateSourceCount,
  getReferencesAIOptions,
  normalizeReferencesData,
  REFERENCES_TOOL_ID,
  type RawReferencesData,
  type ReferenceFormat,
} from "@/lib/references-format";
import {
  getMindMapAIOptions,
  MIND_MAP_TOOL_ID,
  normalizeMindMapData,
  type RawMindMapData,
} from "@/lib/mind-map";
import {
  getQuizAIOptions,
  normalizeQuizData,
  PDF_QUIZ_TOOL_ID,
  type RawQuizData,
} from "@/lib/quiz-normalize";
import {
  getStudyScheduleAIOptions,
  STUDY_SCHEDULE_TOOL_ID,
  normalizeStudySchedule,
  type RawStudyScheduleData,
} from "@/lib/study-schedule";
import {
  getSlidesAIOptions,
  normalizeSlidesPresentation,
  SLIDES_BUILDER_TOOL_ID,
  type RawSlidesPresentationData,
} from "@/lib/slides-builder";
import {
  normalizeArticleSearch,
  normalizeChatPdf,
  normalizeCitations,
  normalizeDefenseSim,
  normalizeExerciseSolution,
  normalizeExplainContent,
  normalizeFlashcards,
  normalizeResearchTheme,
  type RawArticleSearch,
  type RawChatPdf,
  type RawCitations,
  type RawDefenseSim,
  type RawExerciseSolution,
  type RawExplainContent,
  type RawFlashcards,
  type RawResearchTheme,
} from "@/lib/tool-formats";
import {
  buildSummarizeUserPrompt,
  getSummarizeAIOptions,
  SUMMARIZE_TOOL_ID,
} from "@/lib/summarize-material";
import { USER_MATERIAL_SUFFIX } from "@/lib/ai-config";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";

export const TEXT_TRANSFORM_TOOLS = new Set([
  "rewrite",
  "grammar",
  "scientific-language",
  "translate",
  "expand-text",
]);

export const JSON_INTERACTIVE_TOOLS = new Set([
  "mind-map",
  "pdf-quiz",
  "flashcards",
  "exam-sim",
  "study-schedule",
  "references",
  "slides-builder",
  "citations",
  "chat-pdf",
  "explain-content",
  "exercise-solution",
  "defense-sim",
  "article-search",
  "research-theme",
]);

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function prepareToolRequest(
  toolId: string,
  input: string,
  options?: Record<string, string>
): { userPrompt: string; aiOptions: GenerateAIOptions } {
  let userPrompt = input;
  const promptConfig = TOOL_PROMPTS[toolId];
  const isJson = promptConfig?.json ?? false;

  if (options && Object.keys(options).length > 0) {
    userPrompt += "\n\nOpções: " + JSON.stringify(options);
  }

  if (toolId === SUMMARIZE_TOOL_ID) {
    userPrompt = buildSummarizeUserPrompt(userPrompt);
  } else if (!isJson && !TEXT_TRANSFORM_TOOLS.has(toolId)) {
    userPrompt += USER_MATERIAL_SUFFIX;
  } else if (TEXT_TRANSFORM_TOOLS.has(toolId)) {
    userPrompt +=
      "\n\n[Entregue SOMENTE o texto final transformado, sem comentários, sem seções novas e sem meta-explicações.]";
  }

  const scheduleWeeksMatch = input.match(/Semanas de planejamento:\s*(\d+)/i);
  const scheduleWeeks = scheduleWeeksMatch ? Number(scheduleWeeksMatch[1]) : 8;
  const slideCount = Number(options?.slideCount) || 15;
  const words = countWords(input);

  const aiOptions: GenerateAIOptions =
    toolId === SUMMARIZE_TOOL_ID
      ? getSummarizeAIOptions(input)
      : toolId === MIND_MAP_TOOL_ID
        ? getMindMapAIOptions(input)
        : toolId === PDF_QUIZ_TOOL_ID || toolId === "exam-sim"
          ? getQuizAIOptions(input)
          : toolId === STUDY_SCHEDULE_TOOL_ID
            ? getStudyScheduleAIOptions(scheduleWeeks)
            : toolId === REFERENCES_TOOL_ID
              ? getReferencesAIOptions(estimateSourceCount(input))
              : toolId === SLIDES_BUILDER_TOOL_ID
                ? getSlidesAIOptions(slideCount)
                : toolId === "citations"
                  ? { toolId, temperature: 0.15, maxTokens: 5000 }
                  : toolId === "chat-pdf"
                    ? { toolId, temperature: 0.25, maxTokens: 4000 }
                    : toolId === "explain-content"
                      ? {
                          toolId,
                          temperature: 0.3,
                          maxTokens: words <= 150 ? 4500 : 6500,
                        }
                      : toolId === "flashcards"
                        ? {
                            toolId,
                            temperature: 0.25,
                            maxTokens: words <= 200 ? 4000 : 7000,
                          }
                        : toolId === "defense-sim"
                          ? { toolId, temperature: 0.35, maxTokens: 8000 }
                          : toolId === "exercise-solution"
                            ? { toolId, temperature: 0.2, maxTokens: 8000 }
                            : toolId === "article-search"
                              ? { toolId, temperature: 0.3, maxTokens: 5000 }
                              : toolId === "research-theme"
                                ? { toolId, temperature: 0.4, maxTokens: 6000 }
                                : TEXT_TRANSFORM_TOOLS.has(toolId)
                                  ? {
                                      toolId,
                                      temperature: 0.2,
                                      maxTokens: Math.min(10_000, words * 12 + 2000),
                                    }
                                  : { toolId, temperature: 0.35 };

  return { userPrompt, aiOptions };
}

export function postProcessToolResult(
  toolId: string,
  parsed: Record<string, unknown>,
  options?: Record<string, string>
): Record<string, unknown> {
  switch (toolId) {
    case MIND_MAP_TOOL_ID:
      return normalizeMindMapData(parsed as RawMindMapData) as unknown as Record<string, unknown>;
    case PDF_QUIZ_TOOL_ID:
    case "exam-sim":
      return normalizeQuizData(
        toolId === "exam-sim" && parsed.exam
          ? (parsed.exam as RawQuizData)
          : (parsed as RawQuizData)
      ) as unknown as Record<string, unknown>;
    case STUDY_SCHEDULE_TOOL_ID:
      return normalizeStudySchedule(parsed as RawStudyScheduleData) as unknown as Record<
        string,
        unknown
      >;
    case REFERENCES_TOOL_ID:
      return normalizeReferencesData(
        parsed as RawReferencesData,
        (options?.format as ReferenceFormat | undefined) ?? "abnt"
      ) as unknown as Record<string, unknown>;
    case SLIDES_BUILDER_TOOL_ID:
      return normalizeSlidesPresentation(parsed as RawSlidesPresentationData) as unknown as Record<
        string,
        unknown
      >;
    case "citations":
      return normalizeCitations(parsed as RawCitations) as unknown as Record<string, unknown>;
    case "chat-pdf":
      return normalizeChatPdf(parsed as RawChatPdf) as unknown as Record<string, unknown>;
    case "explain-content":
      return normalizeExplainContent(parsed as RawExplainContent) as unknown as Record<
        string,
        unknown
      >;
    case "flashcards":
      return normalizeFlashcards(parsed as RawFlashcards) as unknown as Record<string, unknown>;
    case "defense-sim":
      return normalizeDefenseSim(parsed as RawDefenseSim) as unknown as Record<string, unknown>;
    case "exercise-solution":
      return normalizeExerciseSolution(parsed as RawExerciseSolution) as unknown as Record<
        string,
        unknown
      >;
    case "article-search":
      return normalizeArticleSearch(parsed as RawArticleSearch) as unknown as Record<
        string,
        unknown
      >;
    case "research-theme":
      return normalizeResearchTheme(parsed as RawResearchTheme) as unknown as Record<
        string,
        unknown
      >;
    default:
      return parsed;
  }
}

export function getResultCopyLabel(toolId: string): string {
  if (TEXT_TRANSFORM_TOOLS.has(toolId)) {
    return "Texto pronto para copiar";
  }
  if (
    [
      "case-study",
      "fichamento",
      "tcc-structure",
      "methodology-builder",
      "research-problem",
      "research-gap",
      "literature-synthesis",
      "abnt-format",
    ].includes(toolId)
  ) {
    return "Documento pronto para colar no Word (ABNT)";
  }
  return "Resultado pronto para copiar";
}

export function isInteractiveTool(toolId: string): boolean {
  return JSON_INTERACTIVE_TOOLS.has(toolId);
}
