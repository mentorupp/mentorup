/** Regras globais de profundidade — anexadas a todos os prompts */

export const QUALITY_PREAMBLE = `REGRAS OBRIGATÓRIAS DE QUALIDADE:
- Entregue conteúdo COMPLETO, ROBUSTO e ÚTIL para estudo universitário real — nunca respostas genéricas ou superficiais.
- Cubra TODOS os tópicos, capítulos e conceitos relevantes presentes no material do aluno.
- Priorize profundidade, clareza e aplicabilidade em provas, TCC e revisão.
- Não invente referências bibliográficas específicas (DOI, páginas, autores) que não estejam no material.
- Responda 100% em português brasileiro.`;

export const WORD_READY_RULES = `ENTREGA PRONTA PARA MICROSOFT WORD (OBRIGATÓRIO — ZERO RETRABALHO):
- O aluno COPIA E COLA o resultado direto no Word. Entregue o DOCUMENTO FINAL acabado, não orientações, rascunhos ou explicações sobre o que fazer.
- Siga ABNT NBR 14724 (estrutura e formatação de trabalhos), NBR 10520 (citações no texto) e NBR 6023 (referências), conforme aplicável à ferramenta.
- Padrão visual: Times New Roman 12, espaçamento 1,5, margens 3 cm (superior/esquerda/direita) e 2 cm (inferior), recuo de parágrafo 1,25 cm, alinhamento justificado.
- Títulos de seções numerados (1 INTRODUÇÃO, 1.1 Contextualização, 2 DESENVOLVIMENTO…) em caixa alta ou negrito conforme ABNT.
- Citação direta curta no parágrafo entre aspas com (AUTOR, ano, p. X). Citação direta longa (3+ linhas): parágrafo próprio, recuo 4 cm, fonte 10, sem aspas, citação após ponto final.
- Citação indireta: paráfrase com (AUTOR, ano). Referências finais em ordem alfabética, formato ABNT completo.
- PROIBIDO no corpo principal: "Segue abaixo", "Como solicitado", "Aqui está", "Veja a seguir", emojis, comentários da IA, listas de "principais mudanças" antes do texto.
- Em reescrita, correção gramatical ou linguagem científica: entregue APENAS o texto final corrigido/reescrito, completo, do primeiro ao último parágrafo — como se já fosse o arquivo entregue na faculdade.
- Use [COMPLETAR: indicador breve] somente quando o aluno não forneceu dado essencial; nunca invente autor, página ou DOI.
- Parágrafos acadêmicos desenvolvidos (4–8 linhas), impessoalização ("observa-se", "verifica-se"), sem tom de chat.`;

export const JSON_DELIVERY_RULES = `ENTREGA JSON (ferramentas interativas):
- Responda APENAS JSON válido, sem markdown ao redor.
- Conteúdo completo e específico ao material — nunca placeholders genéricos.`;

export type OutputTier = "compact" | "standard" | "large" | "xlarge";

/** Limite de tokens de saída por ferramenta (JSON costuma precisar de mais) */
export const TOOL_OUTPUT_TIER: Record<string, OutputTier> = {
  "exam-sim": "xlarge",
  "pdf-quiz": "large",
  "defense-sim": "large",
  "mind-map": "large",
  flashcards: "large",
  "exam-correction": "large",
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
  rewrite: "xlarge",
  grammar: "xlarge",
  "scientific-language": "xlarge",
  translate: "large",
  references: "large",
  citations: "large",
  "abnt-format": "xlarge",
  "chat-pdf": "standard",
  "research-theme": "large",
  "research-problem": "large",
  "research-gap": "large",
  "article-search": "large",
};

const TIER_MAX_TOKENS: Record<OutputTier, { json: number; text: number }> = {
  compact: { json: 3_000, text: 3_500 },
  standard: { json: 5_000, text: 5_000 },
  large: { json: 8_000, text: 6_500 },
  xlarge: { json: 12_000, text: 10_000 },
};

const DEFAULT_TIER: OutputTier = "standard";

export function withQualityPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${systemPrompt}`;
}

/** Ferramentas de texto/markdown — prontas para colar no Word */
export function withWordReadyPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${systemPrompt}`;
}

/** Ferramentas JSON (quiz, mapa, flashcards…) */
export function withJsonPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export function getToolMaxTokens(toolId: string, json: boolean): number {
  const tier = TOOL_OUTPUT_TIER[toolId] ?? DEFAULT_TIER;
  return json ? TIER_MAX_TOKENS[tier].json : TIER_MAX_TOKENS[tier].text;
}

/** Ferramentas que recebem material longo (PDF inteiro) */
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
]);

export function getToolInputLimit(toolId?: string): number {
  if (toolId && LARGE_INPUT_TOOLS.has(toolId)) {
    return 16_000;
  }
  return 12_000;
}

export function getAreaMaxTokens(): number {
  return TIER_MAX_TOKENS.xlarge.text;
}

/** Instrução enviada junto ao material do aluno em ferramentas de texto */
export const USER_MATERIAL_SUFFIX =
  "\n\n[Instrução ao sistema: produza o documento final pronto para colar no Word, em conformidade ABNT, sem meta-comentários.]";
