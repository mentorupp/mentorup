export const REFERENCES_TOOL_ID = "references";

export type ReferenceEntry = {
  formatted: string;
  sourceLabel?: string;
  type?: "article" | "book" | "web" | "thesis" | "report" | "chapter" | "other";
  missingFields?: string[];
};

export type ReferencesData = {
  summary?: string;
  abnt?: ReferenceEntry[];
  apa?: ReferenceEntry[];
  warnings?: string[];
};

export type RawReferencesData = {
  summary?: string;
  abnt?: Array<{
    formatted?: string;
    sourceLabel?: string;
    type?: string;
    missingFields?: string[];
  }>;
  apa?: Array<{
    formatted?: string;
    sourceLabel?: string;
    type?: string;
    missingFields?: string[];
  }>;
  warnings?: string[];
};

export type ReferenceFormat = "abnt" | "apa" | "both";

function normalizeEntry(
  raw: NonNullable<RawReferencesData["abnt"]>[number]
): ReferenceEntry | null {
  const formatted = raw.formatted?.trim();
  if (!formatted) return null;

  return {
    formatted,
    sourceLabel: raw.sourceLabel?.trim(),
    type: (["article", "book", "web", "thesis", "report", "chapter", "other"].includes(
      raw.type ?? ""
    )
      ? raw.type
      : "other") as ReferenceEntry["type"],
    missingFields: (raw.missingFields ?? []).map((f) => f.trim()).filter(Boolean),
  };
}

function sortReferences(entries: ReferenceEntry[]): ReferenceEntry[] {
  return [...entries].sort((a, b) => {
    const labelA = (a.sourceLabel ?? a.formatted).toLowerCase();
    const labelB = (b.sourceLabel ?? b.formatted).toLowerCase();
    return labelA.localeCompare(labelB, "pt-BR");
  });
}

export function normalizeReferencesData(
  raw: RawReferencesData,
  format: ReferenceFormat = "both"
): ReferencesData {
  const abnt = sortReferences(
    (raw.abnt ?? []).map(normalizeEntry).filter((e): e is ReferenceEntry => e !== null)
  );
  const apa = sortReferences(
    (raw.apa ?? []).map(normalizeEntry).filter((e): e is ReferenceEntry => e !== null)
  );

  const result: ReferencesData = {
    summary: raw.summary?.trim(),
    warnings: (raw.warnings ?? []).map((w) => w.trim()).filter(Boolean),
  };

  if (format === "abnt" || format === "both") {
    result.abnt = abnt;
  }
  if (format === "apa" || format === "both") {
    result.apa = apa;
  }

  if (!result.abnt?.length && !result.apa?.length) {
    result.warnings = [
      ...(result.warnings ?? []),
      "Nenhuma referência válida foi gerada. Informe autor, título, ano, URL ou DOI de cada fonte.",
    ];
  }

  return result;
}

export function buildReferencesUserPrompt(input: {
  material: string;
  format: ReferenceFormat;
}): string {
  const formatLabel =
    input.format === "both"
      ? "ABNT NBR 6023:2025 e APA 7"
      : input.format === "apa"
        ? "APA 7"
        : "ABNT NBR 6023:2025";

  return `Dados / fontes bibliográficas informados pelo aluno:
${input.material.trim()}

Formato solicitado: ${formatLabel}

Tarefa: formate CADA fonte como referência bibliográfica completa para colar no Word.
- Se for capa ou folha de rosto de TCC/trabalho: formate esse documento como referência.
- Se houver bibliografia no texto: extraia e formate cada item.
- NÃO escreva parágrafos teóricos sobre o assunto.`;
}

export function getReferencesAIOptions(sourceCountHint: number) {
  return {
    toolId: REFERENCES_TOOL_ID,
    temperature: 0.15,
    maxTokens: Math.min(8_000, 1200 + sourceCountHint * 400),
  };
}

export function referencesToPlainText(data: ReferencesData, format: ReferenceFormat): string {
  const lines: string[] = [];

  if (data.summary) {
    lines.push(data.summary, "");
  }

  if ((format === "abnt" || format === "both") && data.abnt?.length) {
    lines.push("REFERÊNCIAS", "");
    data.abnt.forEach((ref) => lines.push(ref.formatted, ""));
  }

  if ((format === "apa" || format === "both") && data.apa?.length) {
    lines.push("REFERENCES (APA 7)", "");
    data.apa.forEach((ref) => lines.push(ref.formatted, ""));
  }

  return lines.join("\n").trim();
}

export function estimateSourceCount(material: string): number {
  const doiCount = (material.match(/10\.\d{4,}\/\S+/gi) ?? []).length;
  const urlCount = (material.match(/https?:\/\/\S+/gi) ?? []).length;
  const lineCount = material.split("\n").filter((l) => l.trim().length > 20).length;
  return Math.max(1, doiCount, urlCount, Math.ceil(lineCount / 3));
}
