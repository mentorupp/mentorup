"use client";

import { normalizeArticleSearch, type RawArticleSearch } from "@/lib/tool-formats";

export default function ArticleSearchViewer({
  data,
}: {
  data: ReturnType<typeof normalizeArticleSearch>;
}) {
  return (
    <div className="max-h-[min(72vh,680px)] space-y-4 overflow-y-auto text-sm">
      <h3 className="font-display text-base font-bold text-surface-900">{data.title}</h3>
      {data.databases.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase text-zinc-500">Bases de dados</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {data.databases.map((d) => (
              <span key={d} className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-800">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.booleanQueries.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase text-zinc-500">Strings de busca</p>
          {data.booleanQueries.map((q, i) => (
            <div key={i} className="mt-2 rounded-lg bg-surface-900 px-3 py-2 font-mono text-xs text-green-400">
              <span className="text-zinc-400">{q.label}: </span>
              {q.query}
            </div>
          ))}
        </div>
      )}
      {(data.descriptors.mesh.length > 0 || data.descriptors.decs.length > 0) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {data.descriptors.mesh.length > 0 && (
            <div>
              <p className="text-xs font-bold text-zinc-500">MeSH</p>
              <p className="text-xs text-zinc-700">{data.descriptors.mesh.join("; ")}</p>
            </div>
          )}
          {data.descriptors.decs.length > 0 && (
            <div>
              <p className="text-xs font-bold text-zinc-500">DeCS</p>
              <p className="text-xs text-zinc-700">{data.descriptors.decs.join("; ")}</p>
            </div>
          )}
        </div>
      )}
      {data.inclusionCriteria.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase text-accent-700">Inclusão</p>
          <ul className="mt-1 list-disc pl-4 text-zinc-700">
            {data.inclusionCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
      {data.exclusionCriteria.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase text-red-700">Exclusão</p>
          <ul className="mt-1 list-disc pl-4 text-zinc-700">
            {data.exclusionCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
      {data.readingStrategy && (
        <p className="rounded-xl bg-primary-50 p-3 text-zinc-800">{data.readingStrategy}</p>
      )}
    </div>
  );
}

export function ArticleSearchViewerFromRaw({ data }: { data: RawArticleSearch }) {
  return <ArticleSearchViewer data={normalizeArticleSearch(data)} />;
}
