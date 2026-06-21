import {
  withAcademicDocumentPreamble,
  withChatPreamble,
  withCitationsPreamble,
  withExplainPreamble,
  withFidelityJsonPreamble,
  withReferencesPreamble,
  withSchedulePreamble,
  withSlidesPreamble,
  withSummarizePreamble,
  withTextTransformPreamble,
} from "./ai-config";

const tt = withTextTransformPreamble;
const ad = withAcademicDocumentPreamble;
const s = withSummarizePreamble;
const sch = withSchedulePreamble;
const ref = withReferencesPreamble;
const sl = withSlidesPreamble;
const chat = withChatPreamble;
const cit = withCitationsPreamble;
const exp = withExplainPreamble;
const fj = withFidelityJsonPreamble;

export const TOOL_PROMPTS: Record<string, { system: string; json?: boolean }> = {
  "mind-map": {
    system: fj(`Gere mapa mental acadêmico em JSON em ÁRVORE.
Formato: { "title", "nodes": [{ "id", "label", "type": "root"|"branch"|"leaf", "parent?" }] }
REGRAS: 1 raiz; 12-35 nós; labels curtos; só material do aluno; sem ciclos.`),
    json: true,
  },
  "pdf-quiz": {
    system: fj(`Gere questões de estudo em JSON.
Formato: { "title", "questions": [{ "type": "objective"|"discursive", "question", "options" (4 textos sem A/B), "answer" (0-based), "explanation", "rubric?", "modelAnswer?", "points" }] }
REGRAS: fidelidade ao material; alternativas sem prefixo; gabarito obrigatório.`),
    json: true,
  },
  rewrite: {
    system: tt(
      "Reescreva INTEGRALMENTE o texto melhorando clareza, coesão e registro acadêmico. Mantenha TODO o conteúdo e a mesma estrutura de parágrafos."
    ),
  },
  summarize: {
    system: s(`Elabore RESUMO ACADÊMICO fiel ao material.
REGRAS: só ideias presentes; proporcional ao tamanho; texto curto → resumo curto; proibido inventar teoria/história.`),
  },
  flashcards: {
    system: fj(`Gere flashcards em JSON: { "title", "cards": [{ "front", "back" }] }
REGRAS: 12-30 cartões; verso 2-4 frases; só conteúdo do material; frente = pergunta/conceito específico.`),
    json: true,
  },
  references: {
    system: ref(`REFERENCES_BIBLIOGRAPHY_TOOL — JSON de referências ABNT/APA.
Formato: { "summary", "abnt": [{ "formatted", "sourceLabel", "type", "missingFields" }], "apa"?: [...], "warnings" }
REGRAS: só referências; proibido texto teórico; [COMPLETAR] se faltar dado.`),
    json: true,
  },
  grammar: {
    system: tt(
      "Corrija ortografia, concordância, regência, crase e pontuação. Entregue SOMENTE o texto corrigido completo, mesma estrutura."
    ),
  },
  "chat-pdf": {
    system: chat(`CHAT_PDF_TOOL — JSON de resposta sobre documento.
Formato: { "question", "answer", "excerpts": [{ "quote", "context" }], "references"?: [], "confidence": "high"|"medium"|"low", "followUp"?: [] }
REGRAS: responda a pergunta com base no material; cite trechos; sem dissertação genérica.`),
    json: true,
  },
  "exam-sim": {
    system: fj(`Gere simulado em JSON: { "exam": { "title", "duration", "totalPoints", "instructions", "questions": [...] } }
Mesmo schema de questões do pdf-quiz. 15-20 questões proporcionais ao material.`),
    json: true,
  },
  "exam-correction": {
    system: fj(`Análise de prova em imagem — usado pela rota dedicada.`),
    json: true,
  },
  "case-study": {
    system: ad(
      "Redija ESTUDO DE CASO: Introdução; Apresentação do caso; Problema; Análise teórica; Alternativas; Recomendação; Plano de ação; Considerações finais. Mínimo 900 palavras."
    ),
  },
  fichamento: {
    system: ad(
      "FICHAMENTO ANALÍTICO: Ficha catalográfica ABNT; Identificação; Resumo analítico (20+ linhas); Citações (3+ diretas, 2+ indiretas); Análise crítica; Palavras-chave."
    ),
  },
  "tcc-structure": {
    system: ad(
      "Esqueleto de TCC com textos-modelo: pré-textuais, Introdução completa, Referencial (3+ eixos), Metodologia, Resultados esperados, Considerações finais, Referências iniciais."
    ),
  },
  "explain-content": {
    system: exp(`EXPLAIN_CONTENT_TOOL — JSON didático.
Formato: { "title", "summary", "sections": [{ "heading", "content", "example?" }], "glossary": [{ "term", "definition" }], "commonMistakes": [], "reviewQuestions": [] }
REGRAS: fiel ao material; seções proporcionais; glossário só termos do trecho.`),
    json: true,
  },
  citations: {
    system: cit(`CITATIONS_TOOL — JSON de citações ABNT prontas.
Formato: { "summary", "citations": [{ "type": "direct_short"|"direct_long"|"indirect", "formatted", "reference", "sourceLabel", "notes?" }], "warnings" }
REGRAS: cada item = citação formatada + referência; proibido texto explicativo longo.`),
    json: true,
  },
  "abnt-format": {
    system: ad(
      "Formate o trabalho conforme ABNT: seções, títulos, citações NBR 10520, referências NBR 6023. Entregue documento formatado; orientações complementares no máximo 5 itens ao final."
    ),
  },
  "scientific-language": {
    system: tt(
      "Reescreva em linguagem acadêmico-científica: impessoalidade, precisão terminológica, formalidade. Mesma estrutura do original."
    ),
  },
  translate: {
    system: tt(
      "Traduza o texto acadêmico completo. Termos técnicos: original entre parênteses na 1ª ocorrência. Entregue SOMENTE a tradução."
    ),
  },
  "expand-text": {
    system: tt(
      "Expanda o texto em ~2× desenvolvendo argumentos e exemplos DO PRÓPRIO contexto. Não invente autores ou dados externos. Mesma linha argumentativa."
    ),
  },
  "literature-synthesis": {
    system: ad(
      "REVISÃO DE LITERATURA: Introdução; Panorama; Análise de estudos (6+); Convergências/divergências; Lacunas; Implicações; Conclusão; Referências ABNT."
    ),
  },
  "research-gap": {
    system: ad(
      "LACUNAS DE PESQUISA: Estado da arte; 5+ lacunas justificadas; Contribuição original; Perguntas de pesquisa; Viabilidade."
    ),
  },
  "article-search": {
    system: fj(`ARTICLE_SEARCH_TOOL — JSON de estratégia de busca.
Formato: { "title", "databases": [], "booleanQueries": [{ "label", "query" }], "descriptors": { "mesh": [], "decs": [] }, "inclusionCriteria": [], "exclusionCriteria": [], "selectionFlow": [], "readingStrategy" }
REGRAS: strings booleanas reais; bases adequadas ao tema; sem texto dissertativo.`),
    json: true,
  },
  "study-schedule": {
    system: sch(`CRONOGRAMA DE ESTUDOS em JSON semanal — NÃO texto acadêmico.
Formato: { "title", "summary", "period", "milestones", "weeks": [{ "weekNumber", "theme", "days": [{ "day", "tasks": [{ "time", "activity", "type" }] }] }], "tips" }`),
    json: true,
  },
  "exercise-solution": {
    system: fj(`EXERCISE_SOLUTION_TOOL — JSON de exercícios resolvidos.
Formato: { "title", "exercises": [{ "number", "statement", "steps": [], "answer", "verification?" }] }
REGRAS: repita enunciado; resolução passo a passo; resposta final clara; só exercícios do material.`),
    json: true,
  },
  "research-theme": {
    system: fj(`RESEARCH_THEME_TOOL — JSON com 6-8 temas de pesquisa.
Formato: { "title", "themes": [{ "title", "delimitation", "justification", "viability", "methodology", "keywords": [] }] }
REGRAS: temas viáveis para graduação; específicos ao curso/área informados.`),
    json: true,
  },
  "research-problem": {
    system: ad(
      "PROBLEMA DE PESQUISA: problemática; objetivo geral; 4-5 específicos; justificativa; delimitação; hipóteses; perguntas de pesquisa."
    ),
  },
  "methodology-builder": {
    system: ad(
      "METODOLOGIA: Tipo/delineamento; População/amostra; Critérios; Instrumentos; Coleta; Análise; Ética (CEP/TCLE); Limitações."
    ),
  },
  "slides-builder": {
    system: sl(`SLIDES_BUILDER_TOOL — JSON slides + roteiro.
Formato: { "title", "durationMinutes", "summary", "slides": [{ "number", "title", "layout", "bullets", "speakerNotes", "durationSeconds", "visualHint?" }], "tips" }
PROIBIDO capa ABNT/sumário.`),
    json: true,
  },
  "defense-sim": {
    system: fj(`DEFENSE_SIM_TOOL — JSON perguntas de banca TCC.
Formato: { "title", "questions": [{ "question", "category", "suggestedAnswer", "tips" }] }
12-18 perguntas; respostas sugeridas 4+ frases; baseadas no resumo do TCC enviado.`),
    json: true,
  },
};
