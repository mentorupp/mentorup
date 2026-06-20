"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";
import { getToolById } from "@/lib/tools-config";
import ImageCaptureUpload, { type CapturedImage } from "./ImageCaptureUpload";
import CorrectionViewer from "./CorrectionViewer";

interface ExamCorrectionRunnerProps {
  toolId: string;
}

export default function ExamCorrectionRunner({ toolId }: ExamCorrectionRunnerProps) {
  const tool = getToolById(toolId);
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [notes, setNotes] = useState("");
  const [includeExplanation, setIncludeExplanation] = useState(true);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [demoNotice, setDemoNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  if (!tool) {
    return <p className="text-sm text-red-600">Ferramenta não encontrada.</p>;
  }

  const handleSubmit = async () => {
    if (images.length === 0) {
      setError("Tire uma foto ou envie pelo menos uma imagem da prova.");
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
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img.file));
      formData.append("includeExplanation", includeExplanation ? "true" : "false");
      if (notes.trim()) formData.append("notes", notes.trim());

      const res = await fetch("/api/tools/correct-exam", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error ?? "Erro ao corrigir prova");
      }

      setResult(data.result as Record<string, unknown>);
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
      <div className="rounded-2xl border border-surface-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Foto da prova</h2>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
            {tool.credits} crédito{tool.credits > 1 ? "s" : ""}
          </span>
        </div>

        <ImageCaptureUpload
          images={images}
          onChange={setImages}
          onError={setError}
          disabled={loading}
        />

        <label className="mt-4 block text-sm font-medium text-zinc-700">
          Observações (opcional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex.: Prova de Farmacologia, questões 1 a 10, prova objetiva..."
            rows={3}
            disabled={loading}
            className="mt-1 w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
          <input
            type="checkbox"
            checked={includeExplanation}
            onChange={(e) => setIncludeExplanation(e.target.checked)}
            disabled={loading}
            className="mt-0.5 h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-zinc-700">
            <strong>Incluir explicação</strong> de cada resposta (como um professor corrigindo).
            Desmarque para receber só o gabarito.
          </span>
        </label>

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
              Corrigindo...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Corrigir prova
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-6">
        <h2 className="font-display mb-4 text-lg font-bold">Gabarito</h2>

        {demoNotice && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {demoNotice}
          </p>
        )}

        {!result && !loading && (
          <div className="flex h-64 flex-col items-center justify-center text-center text-zinc-400">
            <Sparkles size={32} className="mb-3 opacity-50" />
            <p className="text-sm">O gabarito aparecerá aqui após a correção.</p>
          </div>
        )}

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        )}

        {result && !loading && (
          <CorrectionViewer data={result as Parameters<typeof CorrectionViewer>[0]["data"]} />
        )}
      </div>
    </div>
  );
}
