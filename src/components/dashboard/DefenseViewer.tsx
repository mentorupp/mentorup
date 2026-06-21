"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { normalizeDefenseSim, type RawDefenseSim } from "@/lib/tool-formats";

export default function DefenseViewer({ data }: { data: ReturnType<typeof normalizeDefenseSim> }) {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  if (data.questions.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Cole o resumo do TCC para simular perguntas da banca.
      </p>
    );
  }

  return (
    <div className="max-h-[min(72vh,680px)] space-y-3 overflow-y-auto">
      <p className="font-display text-base font-bold text-surface-900">{data.title}</p>
      <p className="text-xs text-zinc-500">{data.questions.length} perguntas simuladas</p>
      {data.questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-surface-200 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                {q.category}
              </span>
              <p className="mt-2 text-sm font-semibold text-surface-900">{q.question}</p>
            </div>
            <GraduationCap size={18} className="shrink-0 text-primary-400" />
          </div>
          <button
            type="button"
            onClick={() => setOpen({ ...open, [i]: !open[i] })}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-600"
          >
            {open[i] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {open[i] ? "Ocultar resposta" : "Ver resposta sugerida"}
          </button>
          {open[i] && (
            <div className="mt-2 space-y-2 rounded-lg bg-surface-50 p-3 text-sm text-zinc-800">
              <p>{q.suggestedAnswer}</p>
              {q.tips && <p className="text-xs text-primary-700"><strong>Dica:</strong> {q.tips}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DefenseViewerFromRaw({ data }: { data: RawDefenseSim }) {
  return <DefenseViewer data={normalizeDefenseSim(data)} />;
}
