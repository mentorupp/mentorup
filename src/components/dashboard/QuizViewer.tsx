"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface Question {
  type: string;
  question: string;
  options?: string[];
  answer?: number;
  explanation?: string;
  rubric?: string;
  points?: number;
}

export default function QuizViewer({
  data,
}: {
  data: { questions?: Array<Partial<Question>> };
}) {
  const questions = data.questions ?? [];
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, number>>({});

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-surface-200 p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
              {q.type === "objective" ? "Objetiva" : "Dissertativa"} #{i + 1}
            </span>
            {q.points && (
              <span className="text-xs text-zinc-500">{q.points} pts</span>
            )}
          </div>

          <p className="text-sm font-medium text-surface-900">{q.question}</p>

          {q.options && (
            <div className="mt-3 space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => setSelected({ ...selected, [i]: j })}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selected[i] === j
                      ? revealed[i] && j === q.answer
                        ? "border-accent-300 bg-accent-50 text-accent-800"
                        : revealed[i] && j !== q.answer
                          ? "border-red-300 bg-red-50 text-red-800"
                          : "border-primary-300 bg-primary-50"
                      : "border-surface-200 hover:border-primary-200"
                  }`}
                >
                  {String.fromCharCode(65 + j)}) {opt}
                </button>
              ))}
            </div>
          )}

          {q.rubric && !revealed[i] && (
            <p className="mt-2 text-xs text-zinc-500 italic">Critério: {q.rubric}</p>
          )}

          <button
            type="button"
            onClick={() => setRevealed({ ...revealed, [i]: !revealed[i] })}
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline"
          >
            {revealed[i] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {revealed[i] ? "Ocultar gabarito" : "Ver gabarito"}
          </button>

          {revealed[i] && q.explanation && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-accent-50 p-3 text-sm text-accent-800">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              {q.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
