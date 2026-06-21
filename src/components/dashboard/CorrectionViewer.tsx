"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface CorrectionItem {
  number?: string;
  type?: string;
  question?: string;
  studentAnswer?: string | null;
  correctAnswer?: string | null;
  isCorrect?: boolean | null;
  explanation?: string | null;
  confidence?: "high" | "medium" | "low";
  status?: "answered" | "skipped";
}

interface CorrectionData {
  summary?: {
    title?: string;
    totalQuestions?: number;
    correctCount?: number | null;
    note?: string | null;
  };
  items?: CorrectionItem[];
  warnings?: string[];
  imageQuality?: string;
  qualityNote?: string;
}

const qualityLabel: Record<string, string> = {
  good: "Boa",
  fair: "Regular",
  poor: "Limitada",
};

export default function CorrectionViewer({ data }: { data: CorrectionData }) {
  const items = data.items ?? [];
  const summary = data.summary;
  const warnings = data.warnings ?? [];

  return (
    <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
      {(data.imageQuality || data.qualityNote || warnings.length > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          {data.imageQuality && (
            <p>
              <strong>Qualidade da foto:</strong> {qualityLabel[data.imageQuality] ?? data.imageQuality}
            </p>
          )}
          {data.qualityNote && <p className="mt-1 text-amber-900">{data.qualityNote}</p>}
          {warnings.map((w) => (
            <p key={w} className="mt-1 flex items-start gap-1.5 text-amber-900">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {w}
            </p>
          ))}
        </div>
      )}

      {summary && (
        <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4">
          {summary.title && (
            <h3 className="font-display text-base font-bold text-surface-900">{summary.title}</h3>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-700">
            {summary.totalQuestions != null && (
              <span>
                <strong>{summary.totalQuestions}</strong> questões na foto
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
        const isSkipped = item.status === "skipped";
        const isCorrect = item.isCorrect === true;
        const isWrong = item.isCorrect === false;
        const lowConfidence = item.confidence === "low" || item.confidence === "medium";

        return (
          <div
            key={`${item.number ?? i}`}
            className={`rounded-xl border p-4 ${
              isSkipped ? "border-amber-200 bg-amber-50/40" : "border-surface-200"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
                Questão {item.number ?? i + 1} ·{" "}
                {item.type === "discursive" ? "Dissertativa" : "Objetiva"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {lowConfidence && !isSkipped && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Confiança {item.confidence === "medium" ? "média" : "baixa"}
                  </span>
                )}
                {isSkipped && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                    <AlertTriangle size={14} /> Ilegível na foto
                  </span>
                )}
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

              {!isSkipped && item.correctAnswer && (
                <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-700">
                    Resposta correta
                  </span>
                  <p className="mt-1 font-medium text-accent-900">{item.correctAnswer}</p>
                </div>
              )}

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
          Nenhuma questão identificada. Enquadre a prova inteira, com boa luz e foco nítido.
        </p>
      )}
    </div>
  );
}
