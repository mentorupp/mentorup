"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getToolById } from "@/lib/tools-config";
import { UPLOAD_FORMAT_HINT } from "@/lib/upload-formats";
import { getResultCopyLabel, isInteractiveTool } from "@/lib/tool-engine";
import DocumentUploadZone from "./DocumentUploadZone";
import MindMapViewer from "./MindMapViewer";
import { normalizeMindMapData, type RawMindMapData } from "@/lib/mind-map";
import QuizViewer from "./QuizViewer";
import { normalizeExamSimData, normalizeQuizData, type RawExamSimData, type RawQuizData } from "@/lib/quiz-normalize";
import FlashcardViewer from "./FlashcardViewer";
import CitationsViewer from "./CitationsViewer";
import ChatPdfViewer from "./ChatPdfViewer";
import ExplainViewer from "./ExplainViewer";
import ExerciseViewer from "./ExerciseViewer";
import DefenseViewer from "./DefenseViewer";
import ArticleSearchViewer from "./ArticleSearchViewer";
import ResearchThemeViewer from "./ResearchThemeViewer";
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

interface ToolRunnerProps {
  toolId: string;
  placeholder?: string;
  extraFields?: React.ReactNode;
}

function ToolResult({
  toolId,
  result,
}: {
  toolId: string;
  result: string | Record<string, unknown>;
}) {
  if (typeof result !== "object" || result === null) return null;

  switch (toolId) {
    case "mind-map":
      return <MindMapViewer data={normalizeMindMapData(result as RawMindMapData)} />;
    case "pdf-quiz":
      return <QuizViewer data={normalizeQuizData(result as RawQuizData)} />;
    case "exam-sim":
      return (
        <QuizViewer
          data={normalizeExamSimData(
            ((result as { exam?: RawQuizData }).exam
              ? (result as RawExamSimData)
              : { exam: result as RawQuizData }) as RawExamSimData
          )}
        />
      );
    case "flashcards":
      return <FlashcardViewer data={normalizeFlashcards(result as RawFlashcards)} />;
    case "citations":
      return <CitationsViewer data={normalizeCitations(result as RawCitations)} />;
    case "chat-pdf":
      return <ChatPdfViewer data={normalizeChatPdf(result as RawChatPdf)} />;
    case "explain-content":
      return <ExplainViewer data={normalizeExplainContent(result as RawExplainContent)} />;
    case "exercise-solution":
      return <ExerciseViewer data={normalizeExerciseSolution(result as RawExerciseSolution)} />;
    case "defense-sim":
      return <DefenseViewer data={normalizeDefenseSim(result as RawDefenseSim)} />;
    case "article-search":
      return <ArticleSearchViewer data={normalizeArticleSearch(result as RawArticleSearch)} />;
    case "research-theme":
      return <ResearchThemeViewer data={normalizeResearchTheme(result as RawResearchTheme)} />;
    default:
      return null;
  }
}

export default function ToolRunner({ toolId, placeholder, extraFields }: ToolRunnerProps) {
  const tool = getToolById(toolId);
  if (!tool) {
    return <p className="text-sm text-red-600">Ferramenta não encontrada.</p>;
  }
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | Record<string, unknown> | null>(null);
  const [demoNotice, setDemoNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  const interactive = isInteractiveTool(tool.id);

  const resultText =
    typeof result === "string" ? result : result ? JSON.stringify(result, null, 2) : "";

  const handleCopy = async () => {
    if (!resultText) return;
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (input.trim().length < 10) {
      setError("Digite, cole ou envie um PDF/Word com pelo menos 10 caracteres.");
      return;
    }

    if (!tool.freeUnlimited && (session?.user?.credits ?? 0) < tool.credits) {
      setError("Créditos insuficientes. Faça upgrade do seu plano.");
      return;
    }

    setLoading(true);
    setError("");
    setDemoNotice("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id, input }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error ?? "Erro ao processar");
      }

      setResult(data.result);
      if (data.demo && data.demoReason) {
        setDemoNotice(data.demoReason);
      }
      await update({ credits: data.creditsRemaining });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-surface-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Entrada</h2>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
              {tool.freeUnlimited ? "Grátis" : `${tool.credits} crédito${tool.credits > 1 ? "s" : ""}`}
            </span>
          </div>

          <DocumentUploadZone
            disabled={loading}
            onTextExtracted={(text) => {
              setInput(text);
              setError("");
            }}
            onError={setError}
          />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder ?? "Cole ou digite o conteúdo aqui..."}
            rows={12}
            className="mt-4 w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />

          <p className="mt-2 text-[11px] text-zinc-400">{UPLOAD_FORMAT_HINT}</p>

          {extraFields}

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar com IA
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-6">
        <h2 className="font-display mb-4 text-lg font-bold">Resultado</h2>

        {demoNotice && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {demoNotice}
          </p>
        )}

        {!result && !loading && (
          <div className="flex h-64 flex-col items-center justify-center text-center text-zinc-400">
            <Sparkles size={32} className="mb-3 opacity-50" />
            <p className="text-sm">O resultado aparecerá aqui após o processamento.</p>
          </div>
        )}

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        )}

        {result && interactive && typeof result === "object" ? (
          <ToolResult toolId={tool.id} result={result} />
        ) : null}

        {result && !interactive && (
          <>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-accent-800">{getResultCopyLabel(tool.id)}</p>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
              >
                {copied ? <Check size={14} className="text-accent-600" /> : <Copy size={14} />}
                {copied ? "Copiado" : "Copiar tudo"}
              </button>
            </div>
            <div className="prose prose-sm max-w-none prose-headings:font-display">
              <ReactMarkdown>{resultText}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
