"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, Check, Copy, FileText } from "lucide-react";
import {
  referencesToPlainText,
  type ReferenceEntry,
  type ReferencesData,
  type ReferenceFormat,
} from "@/lib/references-format";

function ReferenceCard({
  entry,
  index,
  style,
}: {
  entry: ReferenceEntry;
  index: number;
  style: "abnt" | "apa";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(entry.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
            {index + 1}
          </span>
          {entry.sourceLabel && (
            <span className="text-xs font-semibold text-zinc-500">{entry.sourceLabel}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="flex items-center gap-1 rounded-lg border border-surface-200 px-2 py-1 text-[11px] font-semibold text-zinc-600 hover:bg-surface-50"
        >
          {copied ? <Check size={12} className="text-accent-600" /> : <Copy size={12} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-surface-900">{entry.formatted}</p>

      {entry.missingFields && entry.missingFields.length > 0 && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-800">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          Completar: {entry.missingFields.join(", ")}
        </p>
      )}

      <p className="mt-2 text-[10px] uppercase tracking-wide text-zinc-400">
        {style === "abnt" ? "ABNT NBR 6023" : "APA 7"}
      </p>
    </div>
  );
}

function ReferenceSection({
  title,
  entries,
  style,
  onCopyAll,
}: {
  title: string;
  entries: ReferenceEntry[];
  style: "abnt" | "apa";
  onCopyAll: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (entries.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="font-display flex items-center gap-2 text-sm font-bold text-surface-900">
          <BookOpen size={16} className="text-primary-600" />
          {title}
        </h4>
        <button
          type="button"
          onClick={() => void handleCopyAll()}
          className="flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
        >
          {copied ? <Check size={13} className="text-accent-600" /> : <Copy size={13} />}
          {copied ? "Copiado" : "Copiar seção"}
        </button>
      </div>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <ReferenceCard key={`${style}-${index}`} entry={entry} index={index} style={style} />
        ))}
      </div>
    </div>
  );
}

export default function ReferencesViewer({
  data,
  format,
}: {
  data: ReferencesData;
  format: ReferenceFormat;
}) {
  const abnt = data.abnt ?? [];
  const apa = data.apa ?? [];
  const total = abnt.length + (format === "both" ? apa.length : 0);

  const copySection = async (section: "abnt" | "apa" | "all") => {
    const payload: ReferencesData =
      section === "abnt"
        ? { abnt }
        : section === "apa"
          ? { apa }
          : data;
    await navigator.clipboard.writeText(referencesToPlainText(payload, format));
  };

  if (total === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Nenhuma referência formatada.</p>
        <p className="mt-1">
          Informe autor, título, ano, DOI, URL ou cole a bibliografia do trabalho — não apenas o
          texto corrido do assunto.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-bold text-surface-900">Referências formatadas</p>
          {data.summary && <p className="mt-1 text-sm text-zinc-600">{data.summary}</p>}
          <p className="mt-1 text-xs text-zinc-500">
            {abnt.length} ABNT{apa.length ? ` · ${apa.length} APA` : ""} — prontas para colar no Word
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copySection("all")}
          className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
        >
          <FileText size={14} />
          Copiar tudo
        </button>
      </div>

      {data.warnings && data.warnings.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {data.warnings.map((warning, i) => (
            <p key={i}>{warning}</p>
          ))}
        </div>
      )}

      <div className="max-h-[min(72vh,680px)] space-y-6 overflow-y-auto pr-1">
        {(format === "abnt" || format === "both") && (
          <ReferenceSection
            title="REFERÊNCIAS (ABNT)"
            entries={abnt}
            style="abnt"
            onCopyAll={() => void copySection("abnt")}
          />
        )}
        {(format === "apa" || format === "both") && (
          <ReferenceSection
            title="REFERENCES (APA 7)"
            entries={apa}
            style="apa"
            onCopyAll={() => void copySection("apa")}
          />
        )}
      </div>
    </div>
  );
}
