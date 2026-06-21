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
    system: fj(`Gere MAPA MENTAL ACADÊMICO em JSON — ÁRVORE PROFUNDA (3 a 5 níveis). NÃO mapa raso.

Formato: { "title", "nodes": [{ "id", "label", "type": "root"|"branch"|"leaf", "parent?" }] }

ESTRUTURA OBRIGATÓRIA:
- Nível 0 (root, 1 nó): tema central
- Nível 1 (branch, 4-8 nós): grandes eixos/categorias
- Nível 2 (branch): autores, teorias ou subeixos — filhos de cada eixo
- Nível 3+ (leaf): conceitos, termos, relações — 3-8 filhos POR autor/teoria quando o material permitir

EXEMPLO DE PROFUNDIDADE (Teorias da Personalidade):
root → Psicanalíticas → Freud → Id, Ego, Superego, Inconsciente, Mecanismos de Defesa...
root → Behavioristas → Skinner → Reforço Positivo, Reforço Negativo, Modelagem...

REGRAS CRÍTICAS:
- 40-90 nós proporcional ao material (texto rico = mapa denso; NUNCA pare em 15-20 nós rasos)
- PROIBIDO: só categorias + 1 nome por ramo (ex.: Psicanalíticas → Freud, Jung — SEM conceitos)
- Cada autor/teoria citado no material deve ter filhos com seus conceitos principais
- Labels curtos (2-45 chars); use "→" para relações (ex.: "Id → Prazer")
- ids únicos; parent = id do pai; 1 raiz sem parent; sem ciclos
- Só conteúdo do material do aluno — não invente autores ausentes`),
    json: true,
  },
  "pdf-quiz": {
    system: fj(`QUESTÕES DE ESTUDO em JSON — fieis ao material enviado.

Formato: { "title", "questions": [{ "type": "objective"|"discursive", "question", "options" (4 textos SEM prefixo A/B/C/D), "answer" (índice 0-based: 0=A, 1=B, 2=C, 3=D), "explanation", "rubric?", "modelAnswer?", "points" }] }

REGRAS OBRIGATÓRIAS:
- Enunciados ESPECÍFICOS citando conceitos, termos, autores ou dados DO MATERIAL — PROIBIDO perguntas genéricas
- 4 alternativas DISTINTAS, plausíveis e mutuamente exclusivas — PROIBIDO repetir texto ou usar "alternativa correta/incorreta"
- "answer" = índice 0-based da alternativa correta — VARIE entre questões (não marque sempre 0 ou "A")
- "explanation" obrigatória em objetivas, referenciando o conteúdo estudado
- 8-15 questões proporcionais ao material; inclua 2-3 dissertativas`),
    json: true,
  },
  rewrite: {
    system: tt(
      "Reescreva INTEGRALMENTE o texto melhorando clareza, coesão e registro acadêmico. Mantenha TODO o conteúdo e a mesma estrutura de parágrafos."
    ),
  },
  summarize: {
    system: s(`Elabore RESUMO ACADÊMICO EXCEPCIONAL — denso, estruturado e 100% fiel ao material.

ESTRUTURA (adaptar ao tamanho do material):
- Título/tema identificado
- Ideias centrais em parágrafos ou tópicos numerados
- Conceitos-chave, definições e relações presentes no texto
- Conclusão sintética (se o material permitir)

REGRAS:
- Só ideias PRESENTES no material — zero invenção de teoria, autor ou capítulo
- Texto curto → resumo curto; texto longo → resumo estruturado e completo
- Linguagem acadêmica clara; profundidade de professor experiente`),
  },
  flashcards: {
    system: fj(`Flashcards de estudo PROFISSIONAIS em JSON: { "title", "cards": [{ "front", "back" }] }

REGRAS:
- 15-35 cartões proporcionais ao material
- Frente: pergunta/conceito ESPECÍFICO (nunca "Conceito 1")
- Verso: 2-5 frases densas com definição, contexto e aplicação DO MATERIAL
- Cobrir todos os tópicos importantes; sem repetição`),
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
    system: chat(`CHAT_PDF_TOOL — Responda à PERGUNTA DO ALUNO com base no DOCUMENTO.

Formato JSON: { "question", "answer", "excerpts": [{ "quote", "context" }], "references"?: [], "confidence": "high"|"medium"|"low", "followUp"?: [] }

REGRAS CRÍTICAS:
- Responda EXCLUSIVAMENTE à pergunta em "PERGUNTA DO ALUNO" — PROIBIDO inventar, substituir ou reformular a pergunta
- Campo "question" no JSON = cópia EXATA da pergunta do aluno
- Baseie a resposta SOMENTE no documento; cite trechos entre aspas em "excerpts"
- Se a resposta não estiver no documento, diga claramente em "answer" e use confidence "low"
- PROIBIDO redigir mini-artigo, resumo geral ou responder algo que o aluno não perguntou`),
    json: true,
  },
  "exam-sim": {
    system: fj(`SIMULADO DE PROVA em JSON — questões reais baseadas NO MATERIAL do aluno.

Formato: { "exam": { "title", "duration", "totalPoints", "instructions", "questions": [{ "type", "question", "options" (4 textos sem A/B/C/D), "answer" (0-based), "explanation", "points", "rubric?", "modelAnswer?" }] } }

REGRAS CRÍTICAS:
- 15-20 questões cobrindo tópicos DIFERENTES do material — PROIBIDO repetir o mesmo conceito
- Enunciados ESPECÍFICOS (cite termos, autores, datas, definições do texto) — PROIBIDO "qual alternativa melhor reflete..."
- Alternativas: 4 opções DISTINTAS, plausíveis, baseadas no material — PROIBIDO alternativas vagas/genéricas
- "answer": índice 0-based (0=A, 1=B, 2=C, 3=D) — OBRIGATÓRIO variar o gabarito entre questões
- "explanation" obrigatória em cada objetiva
- Inclua 3-5 dissertativas com rubrica
- instructions: orientações de tempo e pontuação para o simulado`),
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
    system: exp(`EXPLAIN_CONTENT_TOOL — explicação didática de nível professor particular.

Formato JSON: { "title", "summary", "sections": [{ "heading", "content", "example?" }], "glossary": [{ "term", "definition" }], "commonMistakes": [], "reviewQuestions": [] }

REGRAS:
- Explique como um tutor excelente: claro, profundo, com exemplos do trecho
- Seções densas (4+ frases cada); glossário com termos do material
- 3-5 erros comuns + 3-5 perguntas de fixação
- PROIBIDO dissertação genérica ou conteúdo ausente no material`),
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
