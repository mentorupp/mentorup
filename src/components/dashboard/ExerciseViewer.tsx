"use client";

import { normalizeExerciseSolution, type RawExerciseSolution } from "@/lib/tool-formats";

export default function ExerciseViewer({ data }: { data: ReturnType<typeof normalizeExerciseSolution> }) {
  if (data.exercises.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Cole a lista de exercícios para resolução comentada.
      </p>
    );
  }

  return (
    <div className="max-h-[min(72vh,680px)] space-y-4 overflow-y-auto">
      <h3 className="font-display text-base font-bold text-surface-900">{data.title}</h3>
      {data.exercises.map((ex) => (
        <div key={String(ex.number)} className="rounded-xl border border-surface-200 p-4">
          <p className="text-xs font-bold text-primary-600">Exercício {ex.number}</p>
          <p className="mt-1 text-sm font-semibold text-surface-900">{ex.statement}</p>
          {ex.steps.length > 0 && (
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-zinc-800">
              {ex.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
          {ex.answer && (
            <p className="mt-3 rounded-lg bg-accent-50 px-3 py-2 text-sm font-semibold text-accent-900">
              Resposta: {ex.answer}
            </p>
          )}
          {ex.verification && (
            <p className="mt-2 text-xs text-zinc-500">Verificação: {ex.verification}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function ExerciseViewerFromRaw({ data }: { data: RawExerciseSolution }) {
  return <ExerciseViewer data={normalizeExerciseSolution(data)} />;
}
