"use client";

import { normalizeChatPdf, type RawChatPdf } from "@/lib/tool-formats";

export default function ChatPdfViewer({ data }: { data: ReturnType<typeof normalizeChatPdf> }) {
  if (!data.answer) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {data.question
          ? "Não foi possível encontrar uma resposta no documento para essa pergunta."
          : "Digite sua pergunta no campo dedicado antes de gerar."}
      </p>
    );
  }

  if (!data.question) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Pergunta não informada. Use o campo &quot;Sua pergunta&quot; antes de gerar.
      </p>
    );
  }

  return (
    <div className="max-h-[min(72vh,680px)] space-y-4 overflow-y-auto">
      <div className="rounded-xl bg-primary-50 p-3">
        <p className="text-xs font-bold uppercase text-primary-700">Sua pergunta</p>
        <p className="mt-1 text-sm font-medium text-surface-900">{data.question}</p>
      </div>
      <div className="rounded-xl border border-surface-200 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Resposta</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-surface-900">{data.answer}</p>
        <p className="mt-2 text-xs text-zinc-500">Confiança: {data.confidence}</p>
      </div>
      {data.excerpts.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-zinc-500">Trechos do documento</p>
          {data.excerpts.map((e, i) => (
            <blockquote key={i} className="mb-2 border-l-4 border-primary-300 bg-surface-50 px-3 py-2 text-sm italic">
              "{e.quote}"
              {e.context && <span className="mt-1 block text-xs not-italic text-zinc-500">{e.context}</span>}
            </blockquote>
          ))}
        </div>
      )}
      {data.followUp.length > 0 && (
        <div className="rounded-xl border border-surface-200 p-3">
          <p className="text-xs font-bold uppercase text-zinc-500">Perguntas relacionadas</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            {data.followUp.map((q, i) => (
              <li key={i}>• {q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ChatPdfViewerFromRaw({ data }: { data: RawChatPdf }) {
  return <ChatPdfViewer data={normalizeChatPdf(data)} />;
}
