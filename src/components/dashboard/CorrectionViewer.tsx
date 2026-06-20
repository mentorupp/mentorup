"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface CorrectionItem {
  number?: string;
  type?: string;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  explanation?: string;
}

interface CorrectionData {
  summary?: {
    title?: string;
    totalQuestions?: number;
    correctCount?: number;
    note?: string;
  };
  items?: CorrectionItem[];
}

export default function CorrectionViewer({ data }: { data: CorrectionData }) {
  const items = data.items ?? [];
  const summary = data.summary;

  return (
    <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
      {summary && (
        <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
          {summary.title && (
            <h3 className="font-display text-base font-bold text-surface-900">{summary.title}</h3>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-700">
            {summary.totalQuestions != null && (
              <span>
                <strong>{summary.totalQuestions}</strong> questões
              </span>
            )}
            {summary.correctCount != null && (
              <span>
                <strong>{summary.correctCount}</strong> acertos identificados
              </span>
            )}
          </div>
          {summary.note && <p className="mt-2 text-xs text-zinc-600">{summary.note}</p>}
        </div>
      )}

      {items.map((item, i) => {
        const isCorrect = item.isCorrect === true;
        const isWrong = item.isCorrect === false;

        return (
          <div key={`${item.number ?? i}`} className="rounded-xl border border-surface-200 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
                Questão {item.number ?? i + 1} · {item.type === "discursive" ? "Dissertativa" : "Objetiva"}
              </span>
              {isCorrect && (
                <span className="flex items-center gap-1 text-xs font-semibold text-accent-700">
                  <CheckCircle2 size={14} /> Correta
                </span>
              )}
              {isWrong && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <XCircle size={14} /> Incorreta
                </span>
              )}
            </div>

            {item.question && (
              <p className="text-sm font-medium text-surface-900">{item.question}</p>
            )}

            <div className="mt-3 space-y-2 text-sm">
              {item.studentAnswer && (
                <div className="rounded-lg bg-surface-50 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Sua resposta
                  </span>
                  <p className="mt-1 text-zinc-800">{item.studentAnswer}</p>
                </div>
              )}

              <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent-700">
                  Resposta correta
                </span>
                <p className="mt-1 font-medium text-accent-900">{item.correctAnswer ?? "—"}</p>
              </div>

              {item.explanation && (
                <div className="rounded-lg bg-zinc-50 px-3 py-2 text-zinc-700">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Explicação
                  </span>
                  <p className="mt-1">{item.explanation}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhuma questão identificada. Tente uma foto mais nítida ou envie outra página.
        </p>
      )}
    </div>
  );
}
