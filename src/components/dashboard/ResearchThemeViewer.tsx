"use client";

import { normalizeResearchTheme, type RawResearchTheme } from "@/lib/tool-formats";

export default function ResearchThemeViewer({
  data,
}: {
  data: ReturnType<typeof normalizeResearchTheme>;
}) {
  if (data.themes.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Informe curso, área e restrições para sugestões de temas.
      </p>
    );
  }

  return (
    <div className="max-h-[min(72vh,680px)] space-y-3 overflow-y-auto">
      <h3 className="font-display text-base font-bold text-surface-900">{data.title}</h3>
      {data.themes.map((t, i) => (
        <div key={i} className="rounded-xl border border-surface-200 p-4">
          <p className="text-xs font-bold text-primary-600">Tema {i + 1}</p>
          <h4 className="mt-1 font-semibold text-surface-900">{t.title}</h4>
          <p className="mt-2 text-sm text-zinc-700"><strong>Delimitação:</strong> {t.delimitation}</p>
          <p className="mt-1 text-sm text-zinc-700"><strong>Justificativa:</strong> {t.justification}</p>
          <p className="mt-1 text-sm text-zinc-700"><strong>Viabilidade:</strong> {t.viability}</p>
          <p className="mt-1 text-sm text-zinc-700"><strong>Metodologia:</strong> {t.methodology}</p>
          {t.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {t.keywords.map((k) => (
                <span key={k} className="rounded bg-surface-100 px-2 py-0.5 text-[11px] text-zinc-600">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ResearchThemeViewerFromRaw({ data }: { data: RawResearchTheme }) {
  return <ResearchThemeViewer data={normalizeResearchTheme(data)} />;
}
