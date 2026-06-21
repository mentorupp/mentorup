"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Coffee,
  Copy,
  Flag,
  PenLine,
} from "lucide-react";
import {
  scheduleToPlainText,
  type ScheduleTask,
  type StudyScheduleData,
} from "@/lib/study-schedule";

const taskStyles: Record<
  ScheduleTask["type"],
  { label: string; className: string; icon: typeof BookOpen }
> = {
  reading: {
    label: "Leitura",
    className: "bg-blue-50 text-blue-800 border-blue-200",
    icon: BookOpen,
  },
  review: {
    label: "Revisão",
    className: "bg-violet-50 text-violet-800 border-violet-200",
    icon: Brain,
  },
  practice: {
    label: "Exercícios",
    className: "bg-amber-50 text-amber-900 border-amber-200",
    icon: PenLine,
  },
  exam: {
    label: "Simulado",
    className: "bg-red-50 text-red-800 border-red-200",
    icon: ClipboardList,
  },
  assignment: {
    label: "Trabalho",
    className: "bg-orange-50 text-orange-900 border-orange-200",
    icon: Flag,
  },
  rest: {
    label: "Descanso",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: Coffee,
  },
  other: {
    label: "Estudo",
    className: "bg-surface-100 text-zinc-700 border-surface-200",
    icon: BookOpen,
  },
};

function WeekBlock({ week }: { week: StudyScheduleData["weeks"][number] }) {
  const [open, setOpen] = useState(week.weekNumber === 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-50"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
            Semana {week.weekNumber}
          </p>
          <p className="font-display text-sm font-bold text-surface-900">{week.theme}</p>
        </div>
        <div className="flex items-center gap-2">
          {week.totalHours != null && (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
              {week.totalHours}h
            </span>
          )}
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-surface-100 px-4 py-3">
          <div className="space-y-3">
            {week.days.map((day) => (
              <div key={`${week.weekNumber}-${day.day}`}>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  {day.day}
                </p>
                <div className="space-y-2">
                  {day.tasks.map((task, index) => {
                    const style = taskStyles[task.type] ?? taskStyles.other;
                    const Icon = style.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${style.className}`}
                      >
                        <Icon size={15} className="mt-0.5 shrink-0 opacity-80" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold uppercase">{style.label}</span>
                            <span className="rounded bg-white/70 px-1.5 py-0.5 text-[11px] font-semibold">
                              {task.time}
                            </span>
                            {task.subject && (
                              <span className="text-[11px] opacity-80">{task.subject}</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm leading-snug">{task.activity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudyScheduleViewer({ data }: { data: StudyScheduleData }) {
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    let tasks = 0;
    let hours = 0;
    for (const week of data.weeks) {
      for (const day of week.days) {
        tasks += day.tasks.length;
        for (const task of day.tasks) {
          const match = task.time.match(/(\d+(?:[.,]\d+)?)/);
          if (match) hours += Number.parseFloat(match[1].replace(",", "."));
        }
      }
    }
    return {
      weeks: data.weeks.length,
      tasks,
      hours: Math.round(hours * 10) / 10,
    };
  }, [data.weeks]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scheduleToPlainText(data));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (data.weeks.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Não foi possível montar o cronograma. Informe disciplinas, conteúdos ou datas de prova e tente
        novamente.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-surface-900">{data.title}</h3>
          {data.summary && (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600">{data.summary}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
        >
          {copied ? <Check size={14} className="text-accent-600" /> : <Copy size={14} />}
          {copied ? "Copiado" : "Copiar cronograma"}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Semanas", value: stats.weeks },
          { label: "Tarefas", value: stats.tasks },
          { label: "Horas planejadas", value: `${stats.hours}h` },
          {
            label: "Prova",
            value: data.period?.examDate ?? "A definir",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-surface-200 bg-gradient-to-br from-white to-primary-50/40 px-3 py-2.5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              {item.label}
            </p>
            <p className="font-display text-lg font-bold text-surface-900">{item.value}</p>
          </div>
        ))}
      </div>

      {data.milestones && data.milestones.length > 0 && (
        <div className="mb-4 rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-700">
            <Calendar size={14} />
            Marcos importantes
          </p>
          <div className="flex flex-wrap gap-2">
            {data.milestones.map((m, i) => (
              <span
                key={i}
                className="rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-800"
              >
                Sem. {m.week}: {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-[min(72vh,680px)] space-y-3 overflow-y-auto pr-1">
        {data.weeks.map((week) => (
          <WeekBlock key={week.weekNumber} week={week} />
        ))}
      </div>

      {data.tips && data.tips.length > 0 && (
        <div className="mt-4 rounded-2xl border border-surface-200 bg-surface-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
            Dicas de execução
          </p>
          <ul className="space-y-1.5 text-sm text-zinc-700">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary-500">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
