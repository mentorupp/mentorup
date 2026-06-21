"use client";

import { normalizeExplainContent, type RawExplainContent } from "@/lib/tool-formats";

export default function ExplainViewer({ data }: { data: ReturnType<typeof normalizeExplainContent> }) {
  if (data.sections.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Envie o trecho ou conceito que deseja entender.
      </p>
    );
  }

  return (
    <div className="max-h-[min(72vh,680px)] space-y-4 overflow-y-auto pr-1">
      <div>
        <h3 className="font-display text-base font-bold text-surface-900">{data.title}</h3>
        {data.summary && <p className="mt-1 text-sm text-zinc-600">{data.summary}</p>}
      </div>
      {data.sections.map((s, i) => (
        <div key={i} className="rounded-xl border border-surface-200 p-4">
          <h4 className="font-semibold text-primary-800">{s.heading}</h4>
          <p className="mt-2 text-sm leading-relaxed text-surface-900">{s.content}</p>
          {s.example && (
            <p className="mt-2 rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-900">
              <strong>Exemplo:</strong> {s.example}
            </p>
          )}
        </div>
      ))}
      {data.glossary.length > 0 && (
        <div className="rounded-xl bg-surface-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-zinc-500">Glossário</p>
          <dl className="space-y-2 text-sm">
            {data.glossary.map((g, i) => (
              <div key={i}>
                <dt className="font-semibold text-surface-900">{g.term}</dt>
                <dd className="text-zinc-700">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {data.commonMistakes.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-amber-800">Erros comuns</p>
          <ul className="space-y-1 text-sm text-amber-950">
            {data.commonMistakes.map((m, i) => (
              <li key={i}>• {m}</li>
            ))}
          </ul>
        </div>
      )}
      {data.reviewQuestions.length > 0 && (
        <div className="rounded-xl border border-primary-100 p-4">
          <p className="mb-2 text-xs font-bold uppercase text-primary-700">Para fixar</p>
          <ol className="list-decimal space-y-1 pl-4 text-sm text-surface-900">
            {data.reviewQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export function ExplainViewerFromRaw({ data }: { data: RawExplainContent }) {
  return <ExplainViewer data={normalizeExplainContent(data)} />;
}
