"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";
import { getToolById } from "@/lib/tools-config";
import { UPLOAD_FORMAT_HINT } from "@/lib/upload-formats";
import DocumentUploadZone from "./DocumentUploadZone";
import ReferencesViewer from "./ReferencesViewer";
import {
  buildReferencesUserPrompt,
  normalizeReferencesData,
  type RawReferencesData,
  type ReferenceFormat,
} from "@/lib/references-format";

interface ReferencesRunnerProps {
  toolId: string;
  placeholder?: string;
}

export default function ReferencesRunner({ toolId, placeholder }: ReferencesRunnerProps) {
  const tool = getToolById(toolId);
  const [material, setMaterial] = useState("");
  const [format, setFormat] = useState<ReferenceFormat>("abnt");
  const [result, setResult] = useState<RawReferencesData | null>(null);
  const [demoNotice, setDemoNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { update } = useSession();
  const router = useRouter();

  if (!tool) {
    return <p className="text-sm text-red-600">Ferramenta não encontrada.</p>;
  }

  const handleSubmit = async () => {
    if (material.trim().length < 10) {
      setError("Informe dados bibliográficos com pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);
    setError("");
    setDemoNotice("");
    setResult(null);

    const input = buildReferencesUserPrompt({ material, format });

    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id, input, options: { format } }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error ?? "Erro ao processar");
      }

      setResult(data.result as RawReferencesData);
      if (data.demo && data.demoReason) {
        setDemoNotice(data.demoReason);
      }
      if (!tool.freeUnlimited) {
        await update({ credits: data.creditsRemaining });
      }
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
            <h2 className="font-display text-lg font-bold">Fontes bibliográficas</h2>
            <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
              Grátis · ilimitado
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
              "Cole DOI, URL, dados do artigo ou a bibliografia/capa do trabalho...\nEx.: Silva, J. Título do livro. São Paulo: Editora, 2023."
            }
            rows={10}
            className="mt-4 w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />

          <p className="mt-2 text-[11px] text-zinc-400">{UPLOAD_FORMAT_HINT}</p>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-zinc-600">Formato de saída</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["abnt", "ABNT"],
                  ["apa", "APA 7"],
                  ["both", "ABNT + APA"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormat(value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    format === value
                      ? "bg-primary-600 text-white"
                      : "border border-surface-200 text-zinc-600 hover:bg-surface-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 rounded-lg bg-primary-50/70 px-3 py-2 text-xs text-primary-900">
            Dica: envie capa/folha de rosto, lista de referências, DOI ou dados soltos (autor, título,
            ano). A ferramenta formata — não resume o texto.
          </p>

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
                Formatando referências...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar referências
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
            <p className="text-sm">As referências formatadas aparecerão aqui, prontas para o Word.</p>
          </div>
        )}

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        )}

        {result && !loading && (
          <ReferencesViewer data={normalizeReferencesData(result, format)} format={format} />
        )}
      </div>
    </div>
  );
}
