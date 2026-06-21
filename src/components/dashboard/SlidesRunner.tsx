"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";
import { getToolById } from "@/lib/tools-config";
import { UPLOAD_FORMAT_HINT } from "@/lib/upload-formats";
import DocumentUploadZone from "./DocumentUploadZone";
import SlidesViewer from "./SlidesViewer";
import {
  buildSlidesUserPrompt,
  normalizeSlidesPresentation,
  type RawSlidesPresentationData,
} from "@/lib/slides-builder";

interface SlidesRunnerProps {
  toolId: string;
  placeholder?: string;
}

const TYPES = ["Seminário acadêmico", "Banca de TCC", "Aula / exposição", "Pitch rápido"];

export default function SlidesRunner({ toolId, placeholder }: SlidesRunnerProps) {
  const tool = getToolById(toolId);
  const [material, setMaterial] = useState("");
  const [slideCount, setSlideCount] = useState(15);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [presentationType, setPresentationType] = useState(TYPES[0]);
  const [result, setResult] = useState<RawSlidesPresentationData | null>(null);
  const [demoNotice, setDemoNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  if (!tool) {
    return <p className="text-sm text-red-600">Ferramenta não encontrada.</p>;
  }

  const handleSubmit = async () => {
    if (material.trim().length < 10) {
      setError("Informe o conteúdo ou tema da apresentação (mín. 10 caracteres).");
      return;
    }

    if ((session?.user?.credits ?? 0) < tool.credits) {
      setError("Créditos insuficientes. Faça upgrade do seu plano.");
      return;
    }

    setLoading(true);
    setError("");
    setDemoNotice("");
    setResult(null);

    const input = buildSlidesUserPrompt({
      material,
      slideCount,
      durationMinutes,
      presentationType,
    });

    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          input,
          options: { slideCount, durationMinutes, presentationType },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error ?? "Erro ao processar");
      }

      setResult(data.result as RawSlidesPresentationData);
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
            <h2 className="font-display text-lg font-bold">Conteúdo</h2>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
              {tool.credits} créditos
            </span>
          </div>

          <DocumentUploadZone
            disabled={loading}
            onTextExtracted={(text) => {
              setMaterial(text);
              setError("");
            }}
            onError={setError}
          />

          <textarea
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={
              placeholder ??
              "Cole resumo do TCC, capítulos ou tema da apresentação...\nEx.: Recrutamento e seleção — diagnóstico, teoria, práticas organizacionais..."
            }
            rows={9}
            className="mt-4 w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />

          <p className="mt-2 text-[11px] text-zinc-400">{UPLOAD_FORMAT_HINT}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">Nº de slides</span>
              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              >
                {[10, 12, 15, 18, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} slides
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">Duração</span>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              >
                {[10, 15, 20, 30].map((n) => (
                  <option key={n} value={n}>
                    {n} minutos
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">Tipo</span>
              <select
                value={presentationType}
                onChange={(e) => setPresentationType(e.target.value)}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
                Montando slides...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar slides e roteiro
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-6">
        <h2 className="font-display mb-4 text-lg font-bold">Apresentação</h2>

        {demoNotice && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {demoNotice}
          </p>
        )}

        {!result && !loading && (
          <div className="flex h-64 flex-col items-center justify-center text-center text-zinc-400">
            <Sparkles size={32} className="mb-3 opacity-50" />
            <p className="text-sm">
              Preview dos slides + roteiro de fala aparecerá aqui — pronto para montar no PowerPoint.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        )}

        {result && !loading && (
          <SlidesViewer data={normalizeSlidesPresentation(result)} />
        )}
      </div>
    </div>
  );
}
