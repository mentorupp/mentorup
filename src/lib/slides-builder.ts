export const SLIDES_BUILDER_TOOL_ID = "slides-builder";

export type SlideLayout =
  | "title"
  | "content"
  | "section"
  | "conclusion"
  | "thankyou";

export type PresentationSlide = {
  number: number;
  title: string;
  layout: SlideLayout;
  bullets: string[];
  speakerNotes: string;
  durationSeconds: number;
  visualHint?: string;
};

export type SlidesPresentationData = {
  title: string;
  durationMinutes?: number;
  summary?: string;
  slides: PresentationSlide[];
  tips?: string[];
};

export type RawSlidesPresentationData = {
  title?: string;
  durationMinutes?: number;
  summary?: string;
  slides?: Array<{
    number?: number;
    title?: string;
    layout?: string;
    bullets?: string[];
    speakerNotes?: string;
    durationSeconds?: number;
    visualHint?: string;
  }>;
  tips?: string[];
};

const LAYOUTS = new Set<SlideLayout>([
  "title",
  "content",
  "section",
  "conclusion",
  "thankyou",
]);

function normalizeLayout(value?: string): SlideLayout {
  if (value && LAYOUTS.has(value as SlideLayout)) return value as SlideLayout;
  return "content";
}

export function normalizeSlidesPresentation(
  raw: RawSlidesPresentationData
): SlidesPresentationData {
  const slides: PresentationSlide[] = (raw.slides ?? [])
    .filter((s) => s.title?.trim())
    .map((slide, index) => ({
      number: slide.number ?? index + 1,
      title: slide.title!.trim(),
      layout: normalizeLayout(slide.layout),
      bullets: (slide.bullets ?? []).map((b) => b.trim()).filter(Boolean).slice(0, 6),
      speakerNotes: slide.speakerNotes?.trim() || "",
      durationSeconds: slide.durationSeconds && slide.durationSeconds > 0 ? slide.durationSeconds : 60,
      visualHint: slide.visualHint?.trim(),
    }));

  const totalSeconds = slides.reduce((sum, s) => sum + s.durationSeconds, 0);

  return {
    title: raw.title?.trim() || slides[0]?.title || "Apresentação",
    durationMinutes:
      raw.durationMinutes ?? Math.max(1, Math.round(totalSeconds / 60)),
    summary: raw.summary?.trim(),
    slides,
    tips: (raw.tips ?? []).map((t) => t.trim()).filter(Boolean),
  };
}

export function buildSlidesUserPrompt(input: {
  material: string;
  slideCount: number;
  durationMinutes: number;
  presentationType: string;
}): string {
  return `Material / conteúdo da apresentação:
${input.material.trim()}

Configuração:
- Tipo: ${input.presentationType}
- Quantidade de slides: ${input.slideCount}
- Duração total alvo: ${input.durationMinutes} minutos

Gere estrutura de slides + roteiro de fala em JSON. NÃO gere documento Word, capa ABNT ou sumário.`;
}

export function getSlidesAIOptions(slideCount: number) {
  return {
    toolId: SLIDES_BUILDER_TOOL_ID,
    temperature: 0.35,
    maxTokens: Math.min(10_000, 2500 + slideCount * 350),
  };
}

export function slidesToPlainText(data: SlidesPresentationData): string {
  const lines: string[] = [
    data.title.toUpperCase(),
    `Duração estimada: ${data.durationMinutes ?? "?"} min · ${data.slides.length} slides`,
    "",
  ];

  if (data.summary) {
    lines.push(data.summary, "");
  }

  for (const slide of data.slides) {
    lines.push(`--- SLIDE ${slide.number}: ${slide.title} (${Math.round(slide.durationSeconds / 60) || 1} min) ---`);
    if (slide.bullets.length) {
      slide.bullets.forEach((b) => lines.push(`• ${b}`));
    }
    if (slide.speakerNotes) {
      lines.push("", "ROTEIRO DE FALA:", slide.speakerNotes);
    }
    if (slide.visualHint) {
      lines.push("", `Visual: ${slide.visualHint}`);
    }
    lines.push("");
  }

  if (data.tips?.length) {
    lines.push("DICAS:");
    data.tips.forEach((tip) => lines.push(`• ${tip}`));
  }

  return lines.join("\n").trim();
}

export function slidesOutlineForPowerPoint(data: SlidesPresentationData): string {
  return data.slides
    .map((slide) => {
      const bullets = slide.bullets.map((b) => `  - ${b}`).join("\n");
      return `${slide.number}. ${slide.title}\n${bullets}`;
    })
    .join("\n\n");
}
