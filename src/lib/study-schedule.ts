export const STUDY_SCHEDULE_TOOL_ID = "study-schedule";

export type ScheduleTask = {
  time: string;
  activity: string;
  subject?: string;
  type: "reading" | "review" | "practice" | "exam" | "assignment" | "rest" | "other";
};

export type ScheduleDay = {
  day: string;
  tasks: ScheduleTask[];
};

export type ScheduleWeek = {
  weekNumber: number;
  theme: string;
  totalHours?: number;
  days: ScheduleDay[];
};

export type ScheduleMilestone = {
  week: number;
  label: string;
  type: "review" | "exam" | "assignment" | "reading" | "other";
};

export type StudyScheduleData = {
  title: string;
  summary?: string;
  period?: {
    totalWeeks: number;
    hoursPerDay?: number;
    hoursPerWeek?: number;
    examDate?: string | null;
  };
  milestones?: ScheduleMilestone[];
  weeks: ScheduleWeek[];
  tips?: string[];
};

export type RawStudyScheduleData = {
  title?: string;
  summary?: string;
  period?: {
    totalWeeks?: number;
    hoursPerDay?: number;
    hoursPerWeek?: number;
    examDate?: string | null;
  };
  milestones?: Array<{
    week?: number;
    label?: string;
    type?: string;
  }>;
  weeks?: Array<{
    weekNumber?: number;
    theme?: string;
    totalHours?: number;
    days?: Array<{
      day?: string;
      tasks?: Array<{
        time?: string;
        activity?: string;
        subject?: string;
        type?: string;
      }>;
    }>;
  }>;
  tips?: string[];
};

const TASK_TYPES = new Set([
  "reading",
  "review",
  "practice",
  "exam",
  "assignment",
  "rest",
  "other",
]);

const DAY_ORDER = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

function normalizeTaskType(type?: string): ScheduleTask["type"] {
  if (type && TASK_TYPES.has(type)) return type as ScheduleTask["type"];
  return "other";
}

function sortDays(days: ScheduleDay[]): ScheduleDay[] {
  return [...days].sort((a, b) => {
    const ai = DAY_ORDER.indexOf(a.day);
    const bi = DAY_ORDER.indexOf(b.day);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function normalizeStudySchedule(raw: RawStudyScheduleData): StudyScheduleData {
  const title = raw.title?.trim() || "Cronograma de Estudos";
  const weeks: ScheduleWeek[] = [];

  for (const [index, week] of (raw.weeks ?? []).entries()) {
    const days: ScheduleDay[] = (week.days ?? [])
      .filter((d) => d.day?.trim())
      .map((d) => ({
        day: d.day!.trim(),
        tasks: (d.tasks ?? [])
          .filter((t) => t.activity?.trim())
          .map((t) => ({
            time: t.time?.trim() || "1h",
            activity: t.activity!.trim(),
            subject: t.subject?.trim(),
            type: normalizeTaskType(t.type),
          })),
      }))
      .filter((d) => d.tasks.length > 0);

    if (days.length === 0) continue;

    weeks.push({
      weekNumber: week.weekNumber ?? index + 1,
      theme: week.theme?.trim() || `Semana ${week.weekNumber ?? index + 1}`,
      totalHours: week.totalHours,
      days: sortDays(days),
    });
  }

  const milestones = (raw.milestones ?? [])
    .filter((m) => m.label?.trim() && m.week)
    .map((m) => ({
      week: m.week!,
      label: m.label!.trim(),
      type: (["review", "exam", "assignment", "reading"].includes(m.type ?? "")
        ? m.type
        : "other") as ScheduleMilestone["type"],
    }));

  return {
    title,
    summary: raw.summary?.trim(),
    period: raw.period
      ? {
          totalWeeks: raw.period.totalWeeks ?? weeks.length,
          hoursPerDay: raw.period.hoursPerDay,
          hoursPerWeek: raw.period.hoursPerWeek,
          examDate: raw.period.examDate ?? null,
        }
      : { totalWeeks: weeks.length },
    milestones,
    weeks,
    tips: (raw.tips ?? []).map((t) => t.trim()).filter(Boolean),
  };
}

export function buildStudyScheduleUserPrompt(input: {
  material: string;
  weeks: number;
  hoursPerDay: number;
  examDate?: string;
  goal: string;
}): string {
  const examLine = input.examDate
    ? `Data da prova/entrega: ${input.examDate}`
    : "Data da prova/entrega: não informada — distribua o conteúdo uniformemente.";

  return `Material / disciplinas / conteúdos a estudar:
${input.material.trim()}

Configuração do planejamento:
- Objetivo: ${input.goal}
- Semanas de planejamento: ${input.weeks}
- Horas de estudo por dia (dias úteis): ${input.hoursPerDay}
- ${examLine}

Gere um CRONOGRAMA SEMANAL em JSON (dias, horas, atividades concretas). NÃO escreva texto acadêmico sobre o tema.`;
}

export function getStudyScheduleAIOptions(weeks: number) {
  return {
    toolId: STUDY_SCHEDULE_TOOL_ID,
    temperature: 0.35,
    maxTokens: weeks <= 4 ? 4_000 : weeks <= 8 ? 6_000 : 8_000,
  };
}

export function scheduleToPlainText(data: StudyScheduleData): string {
  const lines: string[] = [data.title.toUpperCase(), ""];

  if (data.summary) {
    lines.push(data.summary, "");
  }

  if (data.period) {
    lines.push(
      `Período: ${data.period.totalWeeks} semanas` +
        (data.period.hoursPerDay ? ` · ${data.period.hoursPerDay}h/dia` : "") +
        (data.period.examDate ? ` · Prova: ${data.period.examDate}` : ""),
      ""
    );
  }

  for (const week of data.weeks) {
    lines.push(`SEMANA ${week.weekNumber} — ${week.theme}`);
    lines.push("-".repeat(40));
    for (const day of week.days) {
      lines.push(`${day.day}:`);
      for (const task of day.tasks) {
        lines.push(`  • [${task.time}] ${task.activity}${task.subject ? ` (${task.subject})` : ""}`);
      }
    }
    lines.push("");
  }

  if (data.tips?.length) {
    lines.push("DICAS:");
    data.tips.forEach((tip) => lines.push(`• ${tip}`));
  }

  return lines.join("\n");
}
