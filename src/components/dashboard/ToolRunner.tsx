"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ToolConfig } from "@/lib/tools-config";
import MindMapViewer from "./MindMapViewer";
import QuizViewer from "./QuizViewer";
import FlashcardViewer from "./FlashcardViewer";

interface ToolRunnerProps {
  tool: ToolConfig;
  placeholder?: string;
  extraFields?: React.ReactNode;
}

export default function ToolRunner({ tool, placeholder, extraFields }: ToolRunnerProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    if (input.trim().length < 10) {
      setError("Digite ou cole pelo menos 10 caracteres.");
      return;
    }

    if (!tool.freeUnlimited && (session?.user?.credits ?? 0) < tool.credits) {
      setError("Créditos insuficientes. Faça upgrade do seu plano.");
      return;
    }

    setLoading(true);
    setError("");
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
      await update({ credits: data.creditsRemaining });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const text = await file.text();
      setInput(text);
    } else {
      setError("Por enquanto, cole o texto do PDF ou envie arquivos .txt/.md. Suporte completo a PDF em breve.");
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

          <label className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 py-8 transition-colors hover:border-primary-300 hover:bg-primary-50/50">
            <Upload size={24} className="text-zinc-400" />
            <span className="mt-2 text-sm font-medium text-zinc-600">
              Enviar arquivo (.txt, .md)
            </span>
            <input type="file" accept=".txt,.md,text/plain" className="hidden" onChange={handleFileUpload} />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder ?? "Cole ou digite o conteúdo aqui..."}
            rows={12}
            className="w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />

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

        {result && tool.id === "mind-map" && typeof result === "object" ? (
          <MindMapViewer data={result as { title: string; nodes: { id: string; label: string; type: string; parent?: string }[] }} />
        ) : null}

        {result && tool.id === "pdf-quiz" && typeof result === "object" ? (
          <QuizViewer data={result as { questions?: Array<Partial<{ type: string; question: string; options?: string[]; answer?: number; explanation?: string; rubric?: string; points?: number }>> }} />
        ) : null}

        {result && tool.id === "flashcards" && typeof result === "object" ? (
          <FlashcardViewer data={result as { cards: { front: string; back: string }[] }} />
        ) : null}

        {result && tool.id === "exam-sim" && typeof result === "object" ? (
          <QuizViewer data={(result as { exam?: { questions?: Array<Partial<{ type: string; question: string; options?: string[]; answer?: number; explanation?: string }>> } }).exam ?? (result as { questions?: Array<Partial<{ type: string; question: string; options?: string[]; answer?: number; explanation?: string }>> })} />
        ) : null}

        {result && !["mind-map", "pdf-quiz", "flashcards", "exam-sim"].includes(tool.id) && (
          <div className="prose prose-sm max-w-none prose-headings:font-display">
            <ReactMarkdown>
              {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
