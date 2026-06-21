"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, MessageCircleQuestion, Sparkles } from "lucide-react";
import { getToolById } from "@/lib/tools-config";
import { UPLOAD_FORMAT_HINT } from "@/lib/upload-formats";
import { buildChatPdfUserPrompt } from "@/lib/chat-pdf";
import DocumentUploadZone from "./DocumentUploadZone";
import ChatPdfViewer from "./ChatPdfViewer";
import { normalizeChatPdf, type RawChatPdf } from "@/lib/tool-formats";

interface ChatPdfRunnerProps {
  toolId: string;
}

export default function ChatPdfRunner({ toolId }: ChatPdfRunnerProps) {
  const tool = getToolById(toolId);
  const [question, setQuestion] = useState("");
  const [document, setDocument] = useState("");
  const [result, setResult] = useState<ReturnType<typeof normalizeChatPdf> | null>(null);
  const [demoNotice, setDemoNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  if (!tool) {
    return <p className="text-sm text-red-600">Ferramenta não encontrada.</p>;
  }

  const handleSubmit = async () => {
    if (question.trim().length < 5) {
      setError("Digite sua pergunta sobre o documento (mínimo 5 caracteres).");
      return;
    }
    if (document.trim().length < 20) {
      setError("Anexe ou cole o documento com pelo menos 20 caracteres.");
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

    const input = buildChatPdfUserPrompt({ question, document });

    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          input,
          options: { question: question.trim() },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error ?? "Erro ao processar");
      }

      setResult(normalizeChatPdf(data.result as RawChatPdf));
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

          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-surface-900">
            <MessageCircleQuestion size={16} className="text-primary-600" />
            Sua pergunta
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex.: Qual é a metodologia utilizada no trabalho? Quais são as conclusões do autor?"
            rows={3}
            className="w-full resize-none rounded-xl border border-primary-200 bg-primary-50/30 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Obrigatório — a IA responde somente o que você perguntar aqui.
          </p>

          <label className="mb-1.5 mt-5 block text-sm font-semibold text-surface-900">
            Documento
          </label>
          <DocumentUploadZone
            disabled={loading}
            onTextExtracted={(text) => {
              setDocument(text);
              setError("");
            }}
            onError={setError}
          />

          <textarea
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="Cole o texto do PDF/Word ou use o upload acima..."
            rows={10}
            className="mt-4 w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />

          <p className="mt-2 text-[11px] text-zinc-400">{UPLOAD_FORMAT_HINT}</p>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
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
                Perguntar à IA
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
            <MessageCircleQuestion size={32} className="mb-3 opacity-50" />
            <p className="text-sm">
              Faça uma pergunta e anexe o documento. A resposta aparecerá aqui com trechos citados.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        )}

        {result && <ChatPdfViewer data={result} />}
      </div>
    </div>
  );
}
