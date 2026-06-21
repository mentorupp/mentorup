/**
 * Configuração central de qualidade da IA — modelo, tokens, temperatura e instruções ao usuário.
 */

export type AIModel = "gpt-4o-mini" | "gpt-4o";

export const EXPERT_PERSONA = `IDENTIDADE:
Você é um assistente acadêmico de elite — equivalente aos melhores modelos do mercado (ChatGPT o1/GPT-4o, Claude).
Especialista em metodologia científica, redação ABNT, pedagogia universitária e produção de material de estudo profissional.
Seu padrão: respostas densas, específicas, imediatamente úteis — NUNCA genéricas, vagas ou "modelo de preenchimento".`;

export const QUALITY_PREAMBLE = `${EXPERT_PERSONA}

PADRÃO DE EXCELÊNCIA (OBRIGATÓRIO):
- Conteúdo COMPLETO, ROBUSTO e PROFISSIONAL — como um professor experiente entregaria ao aluno.
- Especificidade total: cite conceitos, termos, autores e dados DO MATERIAL enviado pelo aluno.
- PROIBIDO: frases vagas ("conceito fundamental", "aspectos relevantes"), placeholders, listas rasas, texto de exemplo genérico.
- PROIBIDO: meta-comentários ("Segue abaixo", "Como solicitado", "Espero ter ajudado"), emojis, disclaimers da IA.
- Cubra todos os tópicos relevantes do material; profundidade proporcional ao tamanho do input.
- Português brasileiro impecável — registro acadêmico quando aplicável.`;

export const WORD_READY_RULES = `ENTREGA PRONTA PARA USO:
- O aluno COPIA E COLA o resultado direto no Word ou usa na ferramenta — documento FINAL acabado.
- Use [COMPLETAR: campo] somente quando o aluno não forneceu dado essencial; nunca invente autor, DOI ou página.`;

export const ACADEMIC_DOCUMENT_RULES = `DOCUMENTO ACADÊMICO (TCC, fichamento, revisão, estudo de caso):
- ABNT NBR 14724, NBR 10520 e NBR 6023 conforme aplicável.
- Parágrafos desenvolvidos, impessoalização ("observa-se"), argumentação sólida.
- Mínimo de profundidade exigido pelo tipo de documento — nunca esqueleto vazio.`;

export const TEXT_TRANSFORM_RULES = `TRANSFORMAÇÃO DE TEXTO:
- ENTREGUE SOMENTE o texto final — mesma estrutura e ordem do original.
- PROIBIDO criar INTRODUÇÃO, SUMÁRIO ou seções novas.
- PROIBIDO explicar alterações ou comentar o processo.`;

export const JSON_DELIVERY_RULES = `ENTREGA JSON:
- APENAS JSON válido, sem markdown.
- Conteúdo denso e específico ao material — zero placeholders genéricos.`;

export type OutputTier = "compact" | "standard" | "large" | "xlarge";

export const TOOL_OUTPUT_TIER: Record<string, OutputTier> = {
  "exam-sim": "xlarge",
  "pdf-quiz": "large",
  "defense-sim": "large",
  "mind-map": "xlarge",
  flashcards: "large",
  "exam-correction": "xlarge",
  summarize: "xlarge",
  "explain-content": "large",
  fichamento: "xlarge",
  "literature-synthesis": "xlarge",
  "tcc-structure": "xlarge",
  "methodology-builder": "xlarge",
  "slides-builder": "large",
  "study-schedule": "large",
  "exercise-solution": "large",
  "expand-text": "xlarge",
  "case-study": "xlarge",
  rewrite: "large",
  grammar: "large",
  "scientific-language": "large",
  translate: "large",
  references: "large",
  citations: "large",
  "abnt-format": "xlarge",
  "chat-pdf": "large",
  "research-theme": "large",
  "research-problem": "xlarge",
  "research-gap": "xlarge",
  "article-search": "large",
};

const TIER_MAX_TOKENS: Record<OutputTier, { json: number; text: number }> = {
  compact: { json: 4_000, text: 4_000 },
  standard: { json: 6_000, text: 6_000 },
  large: { json: 10_000, text: 8_000 },
  xlarge: { json: 16_000, text: 12_000 },
};

const DEFAULT_TIER: OutputTier = "standard";

/** Ferramentas que exigem GPT-4o (qualidade máxima) */
const PREMIUM_TOOLS = new Set([
  "summarize",
  "mind-map",
  "pdf-quiz",
  "exam-sim",
  "exam-correction",
  "chat-pdf",
  "explain-content",
  "flashcards",
  "defense-sim",
  "exercise-solution",
  "study-schedule",
  "references",
  "citations",
  "slides-builder",
  "fichamento",
  "literature-synthesis",
  "tcc-structure",
  "methodology-builder",
  "case-study",
  "research-problem",
  "research-gap",
  "research-theme",
  "article-search",
  "abnt-format",
  "area-tool",
]);

const TOOL_TEMPERATURE: Record<string, number> = {
  references: 0.1,
  citations: 0.1,
  grammar: 0.15,
  rewrite: 0.2,
  translate: 0.15,
  "scientific-language": 0.2,
  "expand-text": 0.25,
  summarize: 0.2,
  "chat-pdf": 0.15,
  "pdf-quiz": 0.2,
  "exam-sim": 0.2,
  "mind-map": 0.2,
  flashcards: 0.2,
  "explain-content": 0.25,
  "exercise-solution": 0.15,
  "defense-sim": 0.3,
  "study-schedule": 0.25,
  "slides-builder": 0.3,
  "research-theme": 0.35,
  "article-search": 0.25,
};

const ACADEMIC_DOC_TOOLS = new Set([
  "case-study",
  "fichamento",
  "tcc-structure",
  "methodology-builder",
  "research-problem",
  "research-gap",
  "literature-synthesis",
  "abnt-format",
]);

const LARGE_INPUT_TOOLS = new Set([
  "exam-sim",
  "pdf-quiz",
  "summarize",
  "mind-map",
  "flashcards",
  "fichamento",
  "literature-synthesis",
  "chat-pdf",
  "explain-content",
  "exercise-solution",
  "case-study",
  "rewrite",
  "grammar",
  "scientific-language",
  "expand-text",
  "translate",
  "abnt-format",
  "tcc-structure",
  "methodology-builder",
  "exam-correction",
  "defense-sim",
]);

export function getToolModel(toolId: string): AIModel {
  const envModel = process.env.OPENAI_MODEL?.trim();
  if (envModel === "gpt-4o-mini" || envModel === "gpt-4o") {
    return envModel;
  }
  if (PREMIUM_TOOLS.has(toolId)) return "gpt-4o";
  return "gpt-4o";
}

export function getToolTemperature(toolId: string): number {
  return TOOL_TEMPERATURE[toolId] ?? 0.28;
}

export function getToolMaxTokens(toolId: string, json: boolean): number {
  const tier = TOOL_OUTPUT_TIER[toolId] ?? DEFAULT_TIER;
  return json ? TIER_MAX_TOKENS[tier].json : TIER_MAX_TOKENS[tier].text;
}

export function getToolInputLimit(toolId?: string): number {
  if (toolId && LARGE_INPUT_TOOLS.has(toolId)) {
    return 48_000;
  }
  return 24_000;
}

export function getAreaMaxTokens(): number {
  return TIER_MAX_TOKENS.xlarge.text;
}

export type AIOptionsInput = {
  toolId: string;
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  model?: AIModel;
};

/** Completa opções parciais com defaults de qualidade */
export function resolveAIOptions(opts: AIOptionsInput) {
  const { toolId, json = false } = opts;
  return {
    toolId,
    model: opts.model ?? getToolModel(toolId),
    temperature: opts.temperature ?? getToolTemperature(toolId),
    maxTokens: opts.maxTokens ?? getToolMaxTokens(toolId, json),
    inputLimit: getToolInputLimit(toolId),
  };
}

export function getUserPromptSuffix(
  toolId: string,
  opts: { json?: boolean; textTransform?: boolean }
): string {
  if (opts.textTransform) {
    return "\n\n[Entregue SOMENTE o texto final transformado, sem comentários nem seções novas.]";
  }
  if (opts.json) return "";
  if (ACADEMIC_DOC_TOOLS.has(toolId)) {
    return "\n\n[Produza documento acadêmico COMPLETO e PROFISSIONAL, específico ao material acima, pronto para colar no Word.]";
  }
  return "\n\n[Produza resultado final profissional, denso e específico ao material — sem meta-comentários.]";
}

export function buildAreaUserPrompt(input: string, toolName: string, areaName: string): string {
  return `[FERRAMENTA: ${toolName} | ÁREA: ${areaName}]

MATERIAL DO ALUNO:
${input.trim()}

[Entregue documento profissional, específico ao material acima, pronto para uso imediato — padrão de excelência acadêmica.]`;
}

// —— Preamble helpers ——

export function withQualityPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${systemPrompt}`;
}

export function withWordReadyPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${ACADEMIC_DOCUMENT_RULES}\n\n${systemPrompt}`;
}

export function withTextTransformPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${TEXT_TRANSFORM_RULES}\n\n${systemPrompt}`;
}

export function withAcademicDocumentPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${ACADEMIC_DOCUMENT_RULES}\n\n${systemPrompt}`;
}

export const FIDELITY_PREAMBLE = `FIDELIDADE ABSOLUTA AO MATERIAL:
- Trabalhe EXCLUSIVAMENTE com o material fornecido.
- PROIBIDO inventar capítulos, autores, teorias, datas ou exemplos ausentes.
- Extensão proporcional: material curto → resposta curta; material longo → resposta densa e estruturada.`;

export function withSummarizePreamble(systemPrompt: string): string {
  return `${FIDELITY_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${systemPrompt}`;
}

export const SCHEDULE_PREAMBLE = `CRONOGRAMA DE ESTUDOS — planejamento prático, NÃO dissertação.
- Dias, horas e atividades concretas; revisão espaçada; simulados.
- PROIBIDO introdução acadêmica ou texto teórico sobre o tema.`;

export function withSchedulePreamble(systemPrompt: string): string {
  return `${SCHEDULE_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const REFERENCES_PREAMBLE = `REFERÊNCIAS BIBLIOGRÁFICAS — formatação ABNT/APA, NÃO texto dissertativo.
- Cada fonte = referência completa pronta para Word; ordem alfabética.
- [COMPLETAR: campo] se faltar dado — nunca invente DOI ou autor.`;

export function withReferencesPreamble(systemPrompt: string): string {
  return `${REFERENCES_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const SLIDES_PREAMBLE = `SLIDES + ROTEIRO DE FALA — apresentação, NÃO TCC Word.
- Título + bullets curtos por slide; speakerNotes com o que falar; tempo por slide.
- PROIBIDO capa ABNT, sumário ou parágrafos longos.`;

export function withSlidesPreamble(systemPrompt: string): string {
  return `${SLIDES_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const CHAT_PREAMBLE = `CHAT COM DOCUMENTO — resposta precisa à pergunta do aluno.
- Fundamentação no documento; citações entre aspas; resposta direta e profunda.
- PROIBIDO mini-artigo ou responder algo que o aluno não perguntou.`;

export function withChatPreamble(systemPrompt: string): string {
  return `${CHAT_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const CITATIONS_PREAMBLE = `CITAÇÕES ABNT NBR 10520 — citações prontas para colar.
- Cada item formatado (direta curta/longa, indireta) + referência.`;

export function withCitationsPreamble(systemPrompt: string): string {
  return `${CITATIONS_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const EXPLAIN_PREAMBLE = `EXPLICAÇÃO DIDÁTICA — clara, profunda, fiel ao trecho enviado.
- Exemplos do contexto; glossário; perguntas de revisão.
- PROIBIDO dissertação genérica ou teoria externa não presente no material.`;

export function withExplainPreamble(systemPrompt: string): string {
  return `${EXPLAIN_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const FIDELITY_JSON_PREAMBLE = `FIDELIDADE AO MATERIAL (JSON):
- Conteúdo denso, específico e profissional — extraído do material do aluno.
- PROIBIDO placeholders, nós rasos, questões genéricas ou gabarito sempre na mesma letra.`;

export function withFidelityJsonPreamble(systemPrompt: string): string {
  return `${FIDELITY_JSON_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const AREA_TOOL_PREAMBLE = `FERRAMENTA ESPECIALIZADA POR ÁREA — entrega profissional de nível clínico/acadêmico real.
- EXATAMENTE o tipo de documento pedido; específico ao caso/material informado.
- PROIBIDO TCC genérico ou texto modelo vazio.`;

export function withAreaToolPreamble(systemPrompt: string): string {
  return `${AREA_TOOL_PREAMBLE}\n\n${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${systemPrompt}`;
}

export function withJsonPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

/** @deprecated Use getUserPromptSuffix() */
export const USER_MATERIAL_SUFFIX =
  "\n\n[Produza resultado final profissional, específico ao material — sem meta-comentários.]";
