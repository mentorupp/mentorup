/** Regras globais de profundidade — anexadas a todos os prompts */

export const QUALITY_PREAMBLE = `REGRAS OBRIGATÓRIAS DE QUALIDADE:
- Entregue conteúdo COMPLETO, ROBUSTO e ÚTIL para estudo universitário real — nunca respostas genéricas ou superficiais.
- Cubra TODOS os tópicos, capítulos e conceitos relevantes presentes no material do aluno.
- Priorize profundidade, clareza e aplicabilidade em provas, TCC e revisão.
- Não invente referências bibliográficas específicas (DOI, páginas, autores) que não estejam no material.
- Responda 100% em português brasileiro.`;

export const WORD_READY_RULES = `ENTREGA PRONTA PARA MICROSOFT WORD:
- O aluno COPIA E COLA o resultado direto no Word. Entregue o DOCUMENTO FINAL acabado, não orientações ou rascunhos.
- PROIBIDO: "Segue abaixo", "Como solicitado", emojis, comentários da IA, listas de alterações.
- Use [COMPLETAR: indicador breve] somente quando o aluno não forneceu dado essencial; nunca invente autor, página ou DOI.
- Responda 100% em português brasileiro salvo tradução solicitada.`;

export const ACADEMIC_DOCUMENT_RULES = `DOCUMENTO ACADÊMICO COMPLETO (somente quando a ferramenta pede TCC/capítulo/fichamento):
- Siga ABNT NBR 14724, NBR 10520 e NBR 6023 conforme aplicável.
- Seções numeradas quando fizer sentido para o tipo de documento.
- Parágrafos acadêmicos desenvolvidos, impessoalização ("observa-se").`;

export const TEXT_TRANSFORM_RULES = `TRANSFORMAÇÃO DE TEXTO (OBRIGATÓRIO):
- ENTREGUE SOMENTE o texto final — mesma estrutura e ordem do original.
- PROIBIDO criar INTRODUÇÃO, SUMÁRIO ou seções que não existiam no texto enviado.
- PROIBIDO explicar alterações, listar erros ou comentar o processo.
- Preserve o significado; melhore clareza/registro conforme a ferramenta.`;

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
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${ACADEMIC_DOCUMENT_RULES}\n\n${systemPrompt}`;
}

/** Reescrita, correção, tradução — só texto transformado */
export function withTextTransformPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${TEXT_TRANSFORM_RULES}\n\n${systemPrompt}`;
}

/** Documentos acadêmicos completos (TCC, fichamento, estudo de caso…) */
export function withAcademicDocumentPreamble(systemPrompt: string): string {
  return `${QUALITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${ACADEMIC_DOCUMENT_RULES}\n\n${systemPrompt}`;
}

/** Resumir material — fidelidade ao texto original (sem inventar conteúdo) */
export const FIDELITY_PREAMBLE = `REGRAS OBRIGATÓRIAS DE FIDELIDADE:
- Trabalhe EXCLUSIVAMENTE com o material fornecido pelo aluno.
- PROIBIDO inventar capítulos, seções, datas, autores, teorias, exemplos ou dados que não estejam no texto original.
- PROIBIDO usar conhecimento externo para "completar", "enriquecer" ou ampliar o resumo além do que foi enviado.
- A extensão do resultado deve ser PROPORCIONAL ao material: texto curto → resumo curto; texto longo → resumo estruturado mais longo.
- Cubra todos os tópicos presentes no material, sem acrescentar tópicos ausentes.
- Responda 100% em português brasileiro.`;

export function withSummarizePreamble(systemPrompt: string): string {
  return `${FIDELITY_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${systemPrompt}`;
}

/** Cronograma / planejamento — proíbe texto acadêmico dissertativo */
export const SCHEDULE_PREAMBLE = `REGRAS PARA CRONOGRAMA DE ESTUDOS (OBRIGATÓRIO):
- Você é um PLANEJADOR DE ESTUDOS. Entregue CRONOGRAMA PRÁTICO com dias, horas e atividades.
- PROIBIDO redigir introdução acadêmica, dissertação, contextualização teórica ou texto sobre o tema.
- PROIBIDO seções "1 INTRODUÇÃO", "1.1 Contextualização", "DESENVOLVIMENTO" ou parágrafos explicativos longos.
- O aluno precisa saber O QUE estudar, QUANDO e por QUANTO TEMPO — não uma aula sobre o assunto.
- Divida o conteúdo informado em semanas e dias com tarefas concretas (leitura, revisão, exercícios, simulado, descanso).
- Inclua revisão espaçada e preparação para prova/trabalho.
- Responda 100% em português brasileiro.`;

export function withSchedulePreamble(systemPrompt: string): string {
  return `${SCHEDULE_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

/** Referências bibliográficas — proíbe texto dissertativo */
export const REFERENCES_PREAMBLE = `REGRAS PARA REFERÊNCIAS BIBLIOGRÁFICAS (OBRIGATÓRIO):
- Você formata REFERÊNCIAS para colar no final do trabalho — NÃO redige texto acadêmico.
- PROIBIDO: parágrafos teóricos, introduções, contextualizações, explicações ou comentários sobre o tema.
- PROIBIDO: citações no corpo do texto (AUTOR, ano) soltas — entregue a referência completa da fonte.
- PROIBIDO inventar DOI, ISBN, páginas, editoras ou autores — use [COMPLETAR: campo] se faltar dado.
- Cada fonte informada vira UMA referência completa, pronta para Word.
- Ordem alfabética pelo sobrenome do primeiro autor.
- Responda 100% em português brasileiro (referências ABNT); APA em inglês conforme APA 7.`;

export function withReferencesPreamble(systemPrompt: string): string {
  return `${REFERENCES_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

/** Slides e roteiro — proíbe documento Word/ABNT */
export const SLIDES_PREAMBLE = `REGRAS PARA SLIDES E ROTEIRO DE APRESENTAÇÃO (OBRIGATÓRIO):
- Você cria APRESENTAÇÃO DE SLIDES + roteiro de fala — NÃO redige trabalho acadêmico Word.
- PROIBIDO: capa ABNT, folha de rosto, sumário, introdução dissertativa, parágrafos longos ou seções de TCC.
- PROIBIDO: texto corrido acadêmico — cada slide usa TÍTULO + bullets curtos (máx. 6 por slide).
- OBRIGATÓRIO: roteiro de fala (speakerNotes) para cada slide — o que o aluno deve dizer em voz alta.
- OBRIGATÓRIO: tempo estimado por slide (durationSeconds) e duração total coerente.
- Baseie-se no material do aluno; não invente dados, autores ou estatísticas ausentes.
- Responda 100% em português brasileiro.`;

export function withSlidesPreamble(systemPrompt: string): string {
  return `${SLIDES_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const CHAT_PREAMBLE = `CHAT COM DOCUMENTO — Responda com base NO MATERIAL enviado.
- PROIBIDO redigir mini-artigo, introdução acadêmica ou seções ABNT.
- Responda a PERGUNTA do aluno de forma direta, clara e fundamentada no texto.
- Cite trechos do documento entre aspas quando possível.
- Se a resposta não estiver no material, diga explicitamente.`;

export function withChatPreamble(systemPrompt: string): string {
  return `${CHAT_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const CITATIONS_PREAMBLE = `CITAÇÕES ABNT NBR 10520 — formate citações prontas para colar no corpo do texto.
- PROIBIDO parágrafos teóricos ou explicações sobre tipos de citação.
- ENTREGUE cada citação já formatada (direta curta, direta longa, indireta).
- Inclua referência completa ABNT após cada citação quando possível.
- Use [COMPLETAR: página/autor] se faltar dado — não invente.`;

export function withCitationsPreamble(systemPrompt: string): string {
  return `${CITATIONS_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const EXPLAIN_PREAMBLE = `EXPLICAR CONTEÚDO — material didático fiel ao que o aluno enviou.
- Explique SOMENTE o conteúdo informado — PROIBIDO inventar capítulos ou teoria externa.
- Linguagem clara e didática, com exemplos relacionados ao trecho.
- Extensão proporcional: trecho curto → explicação curta; trecho longo → mais seções.
- PROIBIDO dissertação genérica sobre o tema.`;

export function withExplainPreamble(systemPrompt: string): string {
  return `${EXPLAIN_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const FIDELITY_JSON_PREAMBLE = `FIDELIDADE AO MATERIAL (JSON):
- Trabalhe EXCLUSIVAMENTE com o material do aluno.
- PROIBIDO inventar tópicos, autores, datas ou conteúdo ausente.
- Quantidade proporcional ao tamanho do material enviado.`;

export function withFidelityJsonPreamble(systemPrompt: string): string {
  return `${FIDELITY_JSON_PREAMBLE}\n\n${JSON_DELIVERY_RULES}\n\n${systemPrompt}`;
}

export const AREA_TOOL_PREAMBLE = `FERRAMENTA ESPECIALIZADA POR ÁREA:
- Entregue EXATAMENTE o tipo de documento descrito no prompt da ferramenta.
- PROIBIDO substituir por TCC genérico, introdução dissertativa ou sumário se não for pedido.
- Conteúdo específico, profissional e pronto para uso acadêmico real.
- Português brasileiro.`;

export function withAreaToolPreamble(systemPrompt: string): string {
  return `${AREA_TOOL_PREAMBLE}\n\n${WORD_READY_RULES}\n\n${systemPrompt}`;
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
