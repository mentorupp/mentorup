"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";
import { getToolById } from "@/lib/tools-config";
import { UPLOAD_FORMAT_HINT } from "@/lib/upload-formats";
import DocumentUploadZone from "./DocumentUploadZone";
import StudyScheduleViewer from "./StudyScheduleViewer";
import {
  buildStudyScheduleUserPrompt,
  normalizeStudySchedule,
  type RawStudyScheduleData,
} from "@/lib/study-schedule";

interface StudyScheduleRunnerProps {
  toolId: string;
  placeholder?: string;
}

const GOALS = [
  "Prova ou avaliação",
  "Trabalho ou seminário",
  "Concurso ou vestibular",
  "Organizar o semestre",
];

export default function StudyScheduleRunner({ toolId, placeholder }: StudyScheduleRunnerProps) {
  const tool = getToolById(toolId);
  const [material, setMaterial] = useState("");
  const [weeks, setWeeks] = useState(8);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [examDate, setExamDate] = useState("");
  const [goal, setGoal] = useState(GOALS[0]);
  const [result, setResult] = useState<RawStudyScheduleData | null>(null);
  const [demoNotice, setDemoNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  if (!tool) {
    return <p className="text-sm text-red-600">Ferramenta não encontrada.</p>;
  }

  const handleSubmit = async () => {
    if (material.trim().length < 10) {
      setError("Descreva disciplinas, conteúdos ou material com pelo menos 10 caracteres.");
      return;
    }

    if (!tool.freeUnlimited && (session?.user?.credits ?? 0) < tool.credits) {
      setError("Créditos insuficientes. Faça upgrade do seu plano.");
      return;
    }

    setLoading(true);
    setError("");
    setDemoNotice("");
    setResult(null);

    const input = buildStudyScheduleUserPrompt({
      material,
      weeks,
      hoursPerDay,
      examDate: examDate || undefined,
      goal,
    });

    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id, input }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error ?? "Erro ao processar");
      }

      setResult(data.result as RawStudyScheduleData);
      if (data.demo && data.demoReason) {
        setDemoNotice(data.demoReason);
      }
      await update({ credits: data.creditsRemaining });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-surface-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Planejamento</h2>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
              {tool.credits} crédito
            </span>
          </div>

          <DocumentUploadZone
            disabled={loading}
            onTextExtracted={(text) => {
              setMaterial(text);
              setError("");
            }}
            onError={setError}
          />

          <textarea
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={
              placeholder ??
              "Ex.: Psicologia — Ansiedade e estresse (caps. 3-5). Prova dia 15/08. Trabalho sobre coping..."
            }
            rows={8}
            className="mt-4 w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />

          <p className="mt-2 text-[11px] text-zinc-400">{UPLOAD_FORMAT_HINT}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">Semanas</span>
              <input
                type="number"
                min={2}
                max={20}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value) || 8)}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">Horas/dia</span>
              <input
                type="number"
                min={1}
                max={12}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value) || 2)}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">
                Data da prova ou entrega (opcional)
              </span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">Objetivo</span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-surface-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
              >
                {GOALS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Montando cronograma...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar cronograma
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-6">
        <h2 className="font-display mb-4 text-lg font-bold">Cronograma</h2>

        {demoNotice && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {demoNotice}
          </p>
        )}

        {!result && !loading && (
          <div className="flex h-64 flex-col items-center justify-center text-center text-zinc-400">
            <Sparkles size={32} className="mb-3 opacity-50" />
            <p className="text-sm">
              Seu cronograma semanal aparecerá aqui — com dias, horas e atividades.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        )}

        {result && !loading && (
          <StudyScheduleViewer data={normalizeStudySchedule(result)} />
        )}
      </div>
    </div>
  );
}
