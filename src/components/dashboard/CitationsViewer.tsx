"use client";

import { useState } from "react";
import { Check, Copy, Quote } from "lucide-react";
import { normalizeCitations, type RawCitations } from "@/lib/tool-formats";

type CitationsData = ReturnType<typeof normalizeCitations>;

export default function CitationsViewer({ data }: { data: CitationsData }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (data.citations.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Nenhuma citação formatada. Cole o trecho a citar e os dados da fonte (autor, ano, página).
      </p>
    );
  }

  const allText = data.citations
    .map((c) => `${c.formatted}\n\n${c.reference ?? ""}`)
    .join("\n\n---\n\n");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-surface-900">
          {data.citations.length} citação(ões) ABNT prontas
        </p>
        <button
          type="button"
          onClick={() => void copy("all", allText)}
          className="flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1 text-xs font-semibold"
        >
          {copied === "all" ? <Check size={13} /> : <Copy size={13} />}
          Copiar tudo
        </button>
      </div>
      <div className="max-h-[min(72vh,680px)] space-y-3 overflow-y-auto">
        {data.citations.map((c, i) => (
          <div key={i} className="rounded-xl border border-surface-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-bold uppercase text-primary-700">
                <Quote size={13} /> {c.type.replace("_", " ")}
              </span>
              <button
                type="button"
                onClick={() => void copy(`c-${i}`, `${c.formatted}\n\n${c.reference ?? ""}`)}
                className="text-xs font-semibold text-primary-600"
              >
                {copied === `c-${i}` ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-surface-900">{c.formatted}</p>
            {c.reference && (
              <p className="mt-2 border-t border-surface-100 pt-2 text-xs text-zinc-600">{c.reference}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CitationsViewerFromRaw({ data }: { data: RawCitations }) {
  return <CitationsViewer data={normalizeCitations(data)} />;
}
