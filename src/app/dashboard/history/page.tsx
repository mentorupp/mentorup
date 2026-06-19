"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Log {
  id: string;
  tool: string;
  title: string | null;
  creditsUsed: number;
  createdAt: string;
}

interface Saved {
  id: string;
  tool: string;
  title: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/history")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs ?? []);
        setSaved(data.saved ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-zinc-500">Carregando histórico...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Histórico</h1>
      <p className="mt-1 text-zinc-600">Suas atividades e resultados salvos.</p>

      <h2 className="font-display mt-8 mb-4 text-lg font-bold">Atividades Recentes</h2>
      {logs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-200 p-8 text-center text-sm text-zinc-400">
          Nenhuma atividade ainda. Use uma ferramenta para começar!
        </p>
      ) : (
        <div className="rounded-2xl border border-surface-200 bg-white divide-y divide-surface-100">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-surface-900">{log.title ?? log.tool}</p>
                <p className="text-xs text-zinc-500">{formatDate(log.createdAt)}</p>
              </div>
              <span className="rounded-full bg-surface-100 px-2 py-1 text-xs text-zinc-500">
                -{log.creditsUsed} cr
              </span>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display mt-10 mb-4 text-lg font-bold">Resultados Salvos</h2>
      {saved.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-200 p-8 text-center text-sm text-zinc-400">
          Seus resultados aparecerão aqui automaticamente.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {saved.map((item) => (
            <div key={item.id} className="rounded-xl border border-surface-200 bg-white p-4">
              <p className="font-medium text-surface-900">{item.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {item.tool} · {formatDate(item.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
