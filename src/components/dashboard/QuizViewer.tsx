"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  indexToLetter,
  type QuizData,
  type QuizQuestion,
} from "@/lib/quiz-normalize";

function OptionButton({
  label,
  text,
  state,
  onClick,
}: {
  label: string;
  text: string;
  state: "default" | "selected" | "correct" | "wrong" | "revealed-correct";
  onClick: () => void;
}) {
  const styles = {
    default: "border-surface-200 bg-white hover:border-primary-200 hover:bg-primary-50/40",
    selected: "border-primary-400 bg-primary-50 ring-1 ring-primary-200",
    correct: "border-accent-500 bg-accent-50 ring-2 ring-accent-200",
    wrong: "border-red-400 bg-red-50 ring-1 ring-red-200",
    "revealed-correct":
      "border-accent-500 bg-accent-50 ring-2 ring-accent-300 shadow-sm shadow-accent-200/50",
  }[state];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${styles}`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          state === "correct" || state === "revealed-correct"
            ? "bg-accent-500 text-white"
            : state === "wrong"
              ? "bg-red-500 text-white"
              : state === "selected"
                ? "bg-primary-500 text-white"
                : "bg-surface-100 text-zinc-600"
        }`}
      >
        {state === "correct" || state === "revealed-correct" ? (
          <CheckCircle2 size={14} />
        ) : state === "wrong" ? (
          <XCircle size={14} />
        ) : (
          label
        )}
      </span>
      <span className="flex-1 leading-snug text-surface-900">{text}</span>
    </button>
  );
}

function ObjectiveQuestion({
  index,
  question,
  revealed,
  selected,
  onSelect,
  onToggleReveal,
}: {
  index: number;
  question: QuizQuestion;
  revealed: boolean;
  selected?: number;
  onSelect: (optionIndex: number) => void;
  onToggleReveal: () => void;
}) {
  const correctIndex = question.answer ?? 0;
  const correctLetter = question.correctLetter ?? indexToLetter(correctIndex);
  const options = question.options ?? [];

  const userCorrect = revealed && selected === correctIndex;
  const userWrong = revealed && selected !== undefined && selected !== correctIndex;

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
          Objetiva #{index + 1}
        </span>
        {question.points != null && (
          <span className="text-xs font-medium text-zinc-500">{question.points} pt</span>
        )}
      </div>

      <p className="text-sm font-semibold leading-relaxed text-surface-900">{question.question}</p>

      <div className="mt-4 space-y-2">
        {options.map((opt, j) => {
          let state: "default" | "selected" | "correct" | "wrong" | "revealed-correct" = "default";

          if (revealed) {
            if (j === correctIndex) {
              state = selected === j ? "correct" : "revealed-correct";
            } else if (selected === j) {
              state = "wrong";
            }
          } else if (selected === j) {
            state = "selected";
          }

          return (
            <OptionButton
              key={j}
              label={indexToLetter(j)}
              text={opt}
              state={state}
              onClick={() => onSelect(j)}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={onToggleReveal}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
      >
        {revealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {revealed ? "Ocultar gabarito" : "Ver gabarito"}
      </button>

      {revealed && (
        <div className="mt-3 space-y-2">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
              userCorrect
                ? "bg-accent-50 text-accent-800"
                : userWrong
                  ? "bg-amber-50 text-amber-900"
                  : "bg-accent-50 text-accent-800"
            }`}
          >
            <CheckCircle2 size={16} className="shrink-0" />
            Resposta correta: <span className="font-bold">{correctLetter})</span>{" "}
            {options[correctIndex]}
          </div>

          {userWrong && selected !== undefined && (
            <p className="text-xs text-red-600">
              Você marcou {indexToLetter(selected)}) — incorreto.
            </p>
          )}

          {question.explanation && (
            <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-sm leading-relaxed text-zinc-700">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                Explicação
              </p>
              {question.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiscursiveQuestion({
  index,
  question,
  revealed,
  onToggleReveal,
}: {
  index: number;
  question: QuizQuestion;
  revealed: boolean;
  onToggleReveal: () => void;
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
          Dissertativa #{index + 1}
        </span>
        {question.points != null && (
          <span className="text-xs font-medium text-zinc-500">{question.points} pts</span>
        )}
      </div>

      <p className="text-sm font-semibold leading-relaxed text-surface-900">{question.question}</p>

      {question.rubric && (
        <p className="mt-2 text-xs italic text-zinc-500">
          <strong>Critério:</strong> {question.rubric}
        </p>
      )}

      <button
        type="button"
        onClick={onToggleReveal}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
      >
        {revealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {revealed ? "Ocultar resposta modelo" : "Ver resposta modelo"}
      </button>

      {revealed && (question.modelAnswer || question.explanation) && (
        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-sm leading-relaxed text-violet-950">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-violet-600">
            Resposta esperada
          </p>
          {question.modelAnswer || question.explanation}
        </div>
      )}
    </div>
  );
}

export default function QuizViewer({ data }: { data: QuizData }) {
  const questions = data.questions ?? [];
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const objective = questions.filter((q) => q.type === "objective");
    const answered = objective.filter((q, i) => selected[i] !== undefined);
    const correct = objective.filter(
      (q, i) => selected[i] !== undefined && selected[i] === q.answer
    );
    return {
      total: questions.length,
      objective: objective.length,
      answered: answered.length,
      correct: correct.length,
    };
  }, [questions, selected]);

  const allRevealed = questions.length > 0 && questions.every((_, i) => revealed[i]);

  const handleCopyGabarito = async () => {
    const lines = questions.map((q, i) => {
      if (q.type === "objective" && q.options && q.answer !== undefined) {
        const letter = indexToLetter(q.answer);
        return `${i + 1}. ${q.question}\n   Gabarito: ${letter}) ${q.options[q.answer]}\n   ${q.explanation ?? ""}`;
      }
      return `${i + 1}. [Dissertativa] ${q.question}\n   ${q.modelAnswer ?? q.explanation ?? ""}`;
    });
    await navigator.clipboard.writeText(lines.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (questions.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Nenhuma questão válida foi gerada. Tente novamente com mais conteúdo no material.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-surface-900">
            {data.title ?? "Questões para Estudo"}
          </p>
          <p className="text-xs text-zinc-500">
            {stats.total} questões · {stats.objective} objetivas
            {data.duration && <> · {data.duration}</>}
            {data.totalPoints != null && <> · {data.totalPoints} pts</>}
            {stats.answered > 0 && (
              <>
                {" "}
                · {stats.correct}/{stats.answered} acertos
              </>
            )}
          </p>
          {data.instructions && (
            <p className="mt-1 text-xs text-zinc-400">{data.instructions}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const next: Record<number, boolean> = {};
              questions.forEach((_, i) => {
                next[i] = !allRevealed;
              });
              setRevealed(next);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
          >
            {allRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
            {allRevealed ? "Ocultar todos" : "Revelar gabarito"}
          </button>
          <button
            type="button"
            onClick={() => void handleCopyGabarito()}
            className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
          >
            {copied ? <Check size={14} className="text-accent-600" /> : <Copy size={14} />}
            {copied ? "Copiado" : "Copiar gabarito"}
          </button>
        </div>
      </div>

      <div className="max-h-[min(72vh,680px)] space-y-4 overflow-y-auto pr-1">
        {questions.map((q, i) =>
          q.type === "discursive" ? (
            <DiscursiveQuestion
              key={i}
              index={i}
              question={q}
              revealed={Boolean(revealed[i])}
              onToggleReveal={() => setRevealed({ ...revealed, [i]: !revealed[i] })}
            />
          ) : (
            <ObjectiveQuestion
              key={i}
              index={i}
              question={q}
              revealed={Boolean(revealed[i])}
              selected={selected[i]}
              onSelect={(j) => setSelected({ ...selected, [i]: j })}
              onToggleReveal={() => setRevealed({ ...revealed, [i]: !revealed[i] })}
            />
          )
        )}
      </div>
    </div>
  );
}
