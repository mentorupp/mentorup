"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Mic,
  Presentation,
  Sparkles,
} from "lucide-react";
import {
  slidesOutlineForPowerPoint,
  slidesToPlainText,
  type PresentationSlide,
  type SlidesPresentationData,
} from "@/lib/slides-builder";

const layoutLabels: Record<PresentationSlide["layout"], string> = {
  title: "Abertura",
  content: "Conteúdo",
  section: "Seção",
  conclusion: "Conclusão",
  thankyou: "Encerramento",
};

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min === 0) return `${sec}s`;
  if (sec === 0) return `${min} min`;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function SlidePreview({ slide }: { slide: PresentationSlide }) {
  const isTitle = slide.layout === "title" || slide.layout === "thankyou";

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 p-6 text-white shadow-xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          {layoutLabels[slide.layout]}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-white/70">
          <Clock size={12} />
          {formatDuration(slide.durationSeconds)}
        </span>
      </div>

      <h4
        className={`font-display font-bold leading-tight ${
          isTitle ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        }`}
      >
        {slide.title}
      </h4>

      {slide.bullets.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm leading-snug text-white/90">
          {slide.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent-300">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {slide.visualHint && (
        <p className="mt-4 text-[11px] italic text-white/50">Visual: {slide.visualHint}</p>
      )}
    </div>
  );
}

export default function SlidesViewer({ data }: { data: SlidesPresentationData }) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(true);

  const slide = data.slides[index];
  const totalSeconds = useMemo(
    () => data.slides.reduce((sum, s) => sum + s.durationSeconds, 0),
    [data.slides]
  );

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (data.slides.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Nenhum slide foi gerado. Envie o conteúdo do trabalho ou tema e tente novamente.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-bold text-surface-900">{data.title}</p>
          {data.summary && <p className="mt-1 text-sm text-zinc-600">{data.summary}</p>}
          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Presentation size={13} />
              {data.slides.length} slides
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {data.durationMinutes ?? Math.round(totalSeconds / 60)} min total
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copy("outline", slidesOutlineForPowerPoint(data))}
            className="rounded-lg border border-surface-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
          >
            {copied === "outline" ? "Copiado!" : "Copiar outline"}
          </button>
          <button
            type="button"
            onClick={() => void copy("all", slidesToPlainText(data))}
            className="rounded-lg border border-surface-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
          >
            {copied === "all" ? "Copiado!" : "Copiar roteiro completo"}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-semibold text-surface-900">
          Slide {slide.number} de {data.slides.length}
        </p>
        <button
          type="button"
          disabled={index >= data.slides.length - 1}
          onClick={() => setIndex((i) => i + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <SlidePreview slide={slide} />

      <div className="mt-4 flex flex-wrap gap-2">
        {data.slides.map((s, i) => (
          <button
            key={s.number}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 flex-1 min-w-[12px] max-w-8 rounded-full transition ${
              i === index ? "bg-primary-600" : "bg-surface-200 hover:bg-primary-200"
            }`}
            title={`Slide ${s.number}: ${s.title}`}
          />
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-surface-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-700">
            <Mic size={14} />
            Roteiro de fala
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNotes((v) => !v)}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-700"
            >
              {showNotes ? "Ocultar" : "Mostrar"}
            </button>
            <button
              type="button"
              onClick={() =>
                void copy(
                  `slide-${slide.number}`,
                  `SLIDE ${slide.number}: ${slide.title}\n\n${slide.speakerNotes}`
                )
              }
              className="flex items-center gap-1 text-xs font-semibold text-primary-600"
            >
              {copied === `slide-${slide.number}` ? (
                <Check size={12} />
              ) : (
                <Copy size={12} />
              )}
              Copiar
            </button>
          </div>
        </div>
        {showNotes && (
          <p className="text-sm leading-relaxed text-zinc-700">
            {slide.speakerNotes || "Sem roteiro para este slide."}
          </p>
        )}
      </div>

      {data.tips && data.tips.length > 0 && (
        <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary-700">
            <Sparkles size={14} />
            Dicas para apresentar
          </p>
          <ul className="space-y-1 text-sm text-primary-950">
            {data.tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
