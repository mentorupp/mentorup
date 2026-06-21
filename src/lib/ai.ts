import OpenAI, { APIError } from "openai";
import {
  getAreaMaxTokens,
  getToolInputLimit,
  getToolMaxTokens,
} from "@/lib/ai-config";

const openai = process.env.OPENAI_API_KEY?.trim()
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY.trim(),
      timeout: 58_000,
      maxRetries: 0,
    })
  : null;

const RETRY_DELAYS_MS = [0, 2_000, 5_000];

export class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIError";
  }
}

export type AIResult = {
  text: string;
  demo: boolean;
  demoReason?: string;
};

export function isOpenAIConfigured(): boolean {
  return Boolean(openai);
}

export function parseAIJsonResult(result: string): unknown {
  const trimmed = result.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const jsonStr = (fenced ? fenced[1] : trimmed).trim();
  return JSON.parse(jsonStr);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function openAIErrorMeta(error: APIError) {
  const payload = error.error as { code?: string; type?: string } | undefined;
  const code = payload?.code ?? "";
  const message = error.message ?? "";

  const isQuota =
    code === "insufficient_quota" ||
    /exceeded your current quota|insufficient_quota|check your plan and billing/i.test(
      message
    );

  const isRateLimit =
    !isQuota &&
    (code === "rate_limit_exceeded" ||
      error.status === 429 ||
      /rate limit/i.test(message));

  return { isQuota, isRateLimit, code, message };
}

function demoReasonFromError(error: unknown): string {
  if (error instanceof APIError) {
    const { isQuota, isRateLimit } = openAIErrorMeta(error);
    if (isQuota) {
      return "A conta OpenAI do servidor está sem saldo. Adicione créditos em platform.openai.com/settings/billing. Enquanto isso, geramos uma prévia local do material.";
    }
    if (isRateLimit) {
      return "A OpenAI limitou requisições momentâneas. Geramos uma prévia local — tente de novo em 1 minuto para resposta completa.";
    }
  }
  return "A IA externa falhou. Geramos uma prévia local com base no seu material.";
}

function shouldFallbackToDemo(error: unknown): boolean {
  if (error instanceof APIError) {
    const { isQuota, isRateLimit } = openAIErrorMeta(error);
    return isQuota || isRateLimit;
  }
  return false;
}

function mapOpenAIError(error: unknown): AIError {
  if (error instanceof APIError) {
    if (error.status === 401) {
      return new AIError(
        "Chave da OpenAI inválida no servidor. Verifique OPENAI_API_KEY na Vercel e faça redeploy."
      );
    }
    if (error.status === 429) {
      const { isQuota } = openAIErrorMeta(error);
      if (isQuota) {
        return new AIError(
          "Saldo da OpenAI esgotado. Adicione créditos em platform.openai.com/settings/billing e tente novamente."
        );
      }
      return new AIError(
        "Muitas requisições seguidas à OpenAI. Aguarde 1 minuto e tente novamente."
      );
    }
    if (error.status === 503 || error.status === 500) {
      return new AIError(
        "Serviço de IA temporariamente indisponível. Tente novamente em instantes."
      );
    }
  }

  if (error instanceof Error) {
    if (/timeout|timed out|ETIMEDOUT|AbortError/i.test(error.message)) {
      return new AIError(
        "A IA demorou demais para responder. Tente com um texto menor ou aguarde e tente de novo."
      );
    }
  }

  return new AIError(
    "Falha ao gerar resposta com IA. Tente novamente ou use um trecho menor do material."
  );
}

export type GenerateAIOptions = {
  toolId?: string;
  maxTokens?: number;
  inputLimit?: number;
  temperature?: number;
  model?: "gpt-4o-mini" | "gpt-4o";
};

export type VisionAIOptions = GenerateAIOptions;

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  json: boolean,
  options?: GenerateAIOptions
): Promise<string> {
  if (!openai) throw new AIError("OpenAI não configurada.");

  const inputLimit = options?.inputLimit ?? getToolInputLimit(options?.toolId);
  const maxTokens =
    options?.maxTokens ?? getToolMaxTokens(options?.toolId ?? "", json);

  let lastError: unknown;

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (RETRY_DELAYS_MS[attempt]) {
      await sleep(RETRY_DELAYS_MS[attempt]);
    }

    try {
      const response = await openai.chat.completions.create({
        model: options?.model ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt.slice(0, inputLimit) },
        ],
        temperature: options?.temperature ?? 0.6,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new AIError(
          "A IA retornou resposta vazia. Tente novamente com outro trecho do material."
        );
      }

      return content;
    } catch (error) {
      lastError = error;
      if (error instanceof AIError) throw error;

      if (error instanceof APIError) {
        const { isQuota, isRateLimit } = openAIErrorMeta(error);
        if (isQuota) throw error;
        if (isRateLimit && attempt < RETRY_DELAYS_MS.length - 1) continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export async function generateAI(
  systemPrompt: string,
  userPrompt: string,
  json = false,
  options?: GenerateAIOptions
): Promise<AIResult> {
  if (!openai) {
    return {
      text: generateDemoResponse(systemPrompt, userPrompt, json),
      demo: true,
      demoReason: "OpenAI não configurada no servidor — prévia local ativa.",
    };
  }

  try {
    const text = await callOpenAI(systemPrompt, userPrompt, json, options);
    return { text, demo: false };
  } catch (error) {
    if (shouldFallbackToDemo(error)) {
      console.warn("OpenAI indisponível, usando prévia local:", error);
      return {
        text: generateDemoResponse(systemPrompt, userPrompt, json),
        demo: true,
        demoReason: demoReasonFromError(error),
      };
    }

    if (error instanceof AIError) throw error;
    throw mapOpenAIError(error);
  }
}

export type VisionImage = {
  base64: string;
  mimeType: string;
};

async function callOpenAIVision(
  systemPrompt: string,
  userPrompt: string,
  images: VisionImage[],
  json: boolean,
  options?: VisionAIOptions
): Promise<string> {
  if (!openai) throw new AIError("OpenAI não configurada.");

  const maxTokens =
    options?.maxTokens ?? getToolMaxTokens(options?.toolId ?? "exam-correction", json);

  const imageParts = images.map((img) => ({
    type: "image_url" as const,
    image_url: {
      url: `data:${img.mimeType};base64,${img.base64}`,
      detail: "high" as const,
    },
  }));

  let lastError: unknown;

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (RETRY_DELAYS_MS[attempt]) {
      await sleep(RETRY_DELAYS_MS[attempt]);
    }

    try {
      const response = await openai.chat.completions.create({
        model: options?.model ?? "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [{ type: "text", text: userPrompt }, ...imageParts],
          },
        ],
        temperature: options?.temperature ?? 0.3,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new AIError(
          "Não foi possível ler a prova na imagem. Tente uma foto mais nítida ou com melhor iluminação."
        );
      }

      return content;
    } catch (error) {
      lastError = error;
      if (error instanceof AIError) throw error;

      if (error instanceof APIError) {
        const { isQuota, isRateLimit } = openAIErrorMeta(error);
        if (isQuota) throw error;
        if (isRateLimit && attempt < RETRY_DELAYS_MS.length - 1) continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export async function generateAIVision(
  systemPrompt: string,
  userPrompt: string,
  images: VisionImage[],
  json = false,
  options?: VisionAIOptions
): Promise<AIResult> {
  if (!openai) {
    return {
      text: generateDemoResponse(systemPrompt, userPrompt, json),
      demo: true,
      demoReason: "OpenAI não configurada — prévia local. Configure a chave para corrigir fotos de verdade.",
    };
  }

  try {
    const text = await callOpenAIVision(systemPrompt, userPrompt, images, json, options);
    return { text, demo: false };
  } catch (error) {
    if (shouldFallbackToDemo(error)) {
      console.warn("OpenAI vision indisponível, usando prévia local:", error);
      return {
        text: generateDemoResponse(systemPrompt, userPrompt, json),
        demo: true,
        demoReason: demoReasonFromError(error),
      };
    }

    if (error instanceof AIError) throw error;
    throw mapOpenAIError(error);
  }
}

function extractTopicLines(userPrompt: string): string[] {
  return userPrompt
    .split(/\n/)
    .map((line) =>
      line
        .replace(/\.{2,}.*$/, "")
        .replace(/\s+\d+\s*$/, "")
        .trim()
    )
    .filter((line) => line.length > 12 && line.length < 140 && !/^[\d.\s]+$/.test(line))
    .slice(0, 6);
}

function generateDemoResponse(
  systemPrompt: string,
  userPrompt: string,
  json: boolean
): string {
  const topic =
    userPrompt.slice(0, 200).replace(/\n/g, " ").trim() || "conteúdo acadêmico";
  const topicLines = extractTopicLines(userPrompt);

  if (systemPrompt.includes("mapa mental") || systemPrompt.includes("mind map")) {
    const data = {
      title: "Mapa Mental — " + topic.slice(0, 40),
      nodes: [
        { id: "1", label: topic.slice(0, 50), type: "root" },
        { id: "2", label: "Conceitos Fundamentais", type: "branch", parent: "1" },
        { id: "3", label: "Definições e Terminologia", type: "leaf", parent: "2" },
        { id: "4", label: "Princípios Teóricos", type: "leaf", parent: "2" },
        { id: "5", label: "Aplicações Práticas", type: "branch", parent: "1" },
        { id: "6", label: "Casos de Estudo", type: "leaf", parent: "5" },
        { id: "7", label: "Metodologias", type: "leaf", parent: "5" },
        { id: "8", label: "Relações e Conexões", type: "branch", parent: "1" },
        { id: "9", label: "Interdisciplinaridade", type: "leaf", parent: "8" },
        { id: "10", label: "Referências Cruzadas", type: "leaf", parent: "8" },
      ],
    };
    return JSON.stringify(data);
  }

  if (systemPrompt.includes("EXAM_VISION_TRANSCRIBE") || systemPrompt.includes("EXAM_VISION_CORRECT")) {
    const items = [1, 2, 3].map((n) => ({
      number: String(n),
      type: n === 3 ? "discursive" : "objective",
      question: `Questão ${n} identificada na imagem enviada`,
      studentAnswer: n === 1 ? "B" : n === 2 ? "A" : "Resposta parcial do aluno",
      correctAnswer: n === 1 ? "C" : n === 2 ? "A" : "Resposta esperada com fundamentação teórica",
      isCorrect: n === 2,
      ...(userPrompt.includes("explicações") || userPrompt.includes("explicacao")
        ? {
            explanation:
              "Prévia local — conecte saldo na OpenAI para correção real da foto enviada.",
          }
        : {}),
    }));

    return JSON.stringify({
      summary: {
        title: "Prévia — Correção de Prova",
        totalQuestions: 3,
        correctCount: 1,
        note: "Modo demonstração. Com créditos OpenAI, a IA lê a foto e corrige de verdade.",
      },
      items,
    });
  }

  if (systemPrompt.includes("simulado de prova") || systemPrompt.includes("Gere simulado")) {
    const questionTopics =
      topicLines.length > 0
        ? topicLines
        : [
            topic.slice(0, 80),
            "Fundamentação teórica",
            "Metodologia e conceitos",
            "Aplicações práticas",
            "Análise crítica",
            "Síntese e conclusões",
          ];

    const expandedTopics = [...questionTopics];
    while (expandedTopics.length < 12) {
      expandedTopics.push(`Tópico complementar ${expandedTopics.length + 1} do material`);
    }

    const questions = expandedTopics.slice(0, 15).map((label, index) => {
      if (index % 4 === 3) {
        return {
          type: "discursive",
          question: `Discuta os aspectos centrais de "${label}" com base no material enviado.`,
          points: 2,
          rubric: "Compreensão, argumentação, exemplos e clareza.",
        };
      }

      return {
        type: "objective",
        question: `Sobre "${label}", qual alternativa melhor reflete o conteúdo estudado?`,
        options: [
          "Conceito alinhado ao material",
          "Interpretação parcialmente correta",
          "Afirmação incorreta",
          "Informação não abordada no texto",
        ],
        answer: 0,
        points: 1,
        explanation: "Baseado nos trechos identificados no material enviado.",
      };
    });

    const data = {
      exam: {
        title: `Simulado — ${topicLines[0]?.slice(0, 60) ?? topic.slice(0, 50)}`,
        duration: "120 minutos",
        totalPoints: questions.reduce((s, q) => s + (q.points ?? 1), 0),
        questions,
      },
    };
    return JSON.stringify(data);
  }

  if (systemPrompt.includes("CRONOGRAMA DE ESTUDOS")) {
    const subject = topic.slice(0, 50) || "Conteúdo acadêmico";
    return JSON.stringify({
      title: `Cronograma — ${subject}`,
      summary:
        "Cronograma demonstrativo. Configure a OpenAI para planejamento completo com base no seu material.",
      period: { totalWeeks: 4, hoursPerDay: 2, hoursPerWeek: 10, examDate: null },
      milestones: [
        { week: 2, label: "Revisão intermediária", type: "review" },
        { week: 4, label: "Simulado final", type: "exam" },
      ],
      weeks: [1, 2, 3, 4].map((weekNumber) => ({
        weekNumber,
        theme: weekNumber === 4 ? "Revisão e simulado" : `Módulo ${weekNumber}`,
        totalHours: 10,
        days: [
          {
            day: "Segunda",
            tasks: [
              {
                time: "1h30",
                activity: `Leitura e anotações — ${subject}`,
                subject: "Disciplina",
                type: "reading",
              },
            ],
          },
          {
            day: "Quarta",
            tasks: [
              {
                time: "1h",
                activity: "Resolver 10 questões do material",
                type: "practice",
              },
            ],
          },
          {
            day: "Sexta",
            tasks: [
              {
                time: "1h",
                activity: "Revisão espaçada dos pontos-chave",
                type: "review",
              },
            ],
          },
          {
            day: "Domingo",
            tasks: [{ time: "—", activity: "Descanso ativo", type: "rest" }],
          },
        ],
      })),
      tips: [
        "Revise em intervalos de 24h, 72h e 7 dias.",
        "Alterne leitura, exercícios e revisão.",
        "Durma bem na véspera da prova.",
      ],
    });
  }

  if (systemPrompt.includes("questões") || systemPrompt.includes("quiz")) {
    const data = {
      questions: [
        {
          type: "objective",
          question: `Qual é o conceito central abordado em "${topic.slice(0, 60)}"?`,
          options: [
            "Conceito A — definição primária",
            "Conceito B — abordagem alternativa",
            "Conceito C — visão complementar",
            "Conceito D — perspectiva crítica",
          ],
          answer: 0,
          explanation:
            "A alternativa correta representa o conceito fundamental identificado no material analisado.",
        },
        {
          type: "objective",
          question: "Qual metodologia é mais adequada para abordar este tema?",
          options: ["Quantitativa", "Qualitativa", "Mista", "Experimental"],
          answer: 2,
          explanation:
            "A abordagem mista combina métodos quantitativos e qualitativos, ideal para temas complexos.",
        },
        {
          type: "discursive",
          question:
            "Discuta as principais implicações teóricas e práticas do tema apresentado.",
          rubric:
            "Avaliar: compreensão do tema (40%), argumentação (30%), exemplos (20%), clareza (10%).",
        },
      ],
    };
    return JSON.stringify(data);
  }

  if (systemPrompt.includes("flashcard")) {
    const cards =
      topicLines.length > 0
        ? topicLines.map((line) => ({
            front: line.slice(0, 80),
            back: "Ponto relevante extraído do material enviado para revisão.",
          }))
        : [
            { front: "Conceito principal", back: topic.slice(0, 150) },
            {
              front: "Definição-chave",
              back: "Termo fundamental relacionado ao conteúdo estudado.",
            },
          ];

    return JSON.stringify({ cards });
  }

  if (systemPrompt.includes("SLIDES_BUILDER_TOOL")) {
    const subject = topic.slice(0, 60) || "Apresentação acadêmica";
    return JSON.stringify({
      title: subject,
      durationMinutes: 5,
      summary: "Prévia local — conecte a OpenAI para slides completos com base no seu material.",
      slides: [
        {
          number: 1,
          title: subject,
          layout: "title",
          bullets: ["Seu nome", "Disciplina / Banca"],
          speakerNotes:
            "Bom dia. Meu nome é [nome] e hoje apresento os principais pontos sobre " +
            subject +
            ".",
          durationSeconds: 45,
          visualHint: "Fundo limpo com título centralizado",
        },
        {
          number: 2,
          title: "Objetivo da apresentação",
          layout: "content",
          bullets: [
            "Contextualizar o tema",
            "Apresentar conceitos-chave do material",
            "Relacionar com a prática",
          ],
          speakerNotes:
            "Neste slide, explico o objetivo geral e o que o ouvinte deve reter até o final.",
          durationSeconds: 60,
        },
        {
          number: 3,
          title: "Obrigado!",
          layout: "thankyou",
          bullets: ["Perguntas?"],
          speakerNotes: "Agradeço a atenção e fico à disposição para perguntas.",
          durationSeconds: 30,
        },
      ],
      tips: ["Ensaie com o cronômetro", "Mantenha contato visual", "Use os bullets como guia, não leia"],
    });
  }

  if (systemPrompt.includes("REFERENCES_BIBLIOGRAPHY_TOOL")) {
    const year = new Date().getFullYear();
    return JSON.stringify({
      summary: "Prévia local — 1 referência demonstrativa. Conecte a OpenAI para formatação real.",
      abnt: [
        {
          formatted: `SOBRENOME, Nome. ${topic.slice(0, 80)}. Imperatriz: [COMPLETAR: instituição], ${year}.`,
          sourceLabel: "Fonte informada",
          type: "thesis",
          missingFields: ["instituição"],
        },
      ],
      warnings: ["Modo demonstração — configure OPENAI_API_KEY para referências precisas."],
    });
  }

  if (systemPrompt.includes("CHAT_PDF_TOOL") || systemPrompt.includes("CHAT COM DOCUMENTO")) {
    const questionLine =
      userPrompt.split("\n").find((l) => l.trim().endsWith("?"))?.trim() ||
      "Qual é o ponto central do material?";
    return JSON.stringify({
      question: questionLine,
      answer:
        "Com base no trecho enviado, o ponto central trata de " +
        topic.slice(0, 120) +
        ". (Prévia local — conecte a OpenAI para resposta completa com citações do documento.)",
      excerpts: topicLines.slice(0, 2).map((line) => ({
        quote: line.slice(0, 120),
        context: "Trecho identificado no material enviado",
      })),
      confidence: "medium",
      followUp: ["Quais são os conceitos-chave?", "Como isso se aplica na prática?"],
    });
  }

  if (systemPrompt.includes("CITATIONS_TOOL") || systemPrompt.includes("CITAÇÕES ABNT")) {
    return JSON.stringify({
      summary: "Prévia local — citações demonstrativas.",
      citations: [
        {
          type: "indirect",
          formatted: `Conforme aponta Autor (${new Date().getFullYear()}), ${topic.slice(0, 80)}.`,
          reference: `AUTOR, Nome. ${topic.slice(0, 60)}. Ano.`,
          sourceLabel: "Fonte informada",
        },
      ],
      warnings: ["Configure OPENAI_API_KEY para citações precisas com dados reais."],
    });
  }

  if (systemPrompt.includes("EXPLAIN_CONTENT_TOOL") || systemPrompt.includes("EXPLICAR CONTEÚDO")) {
    const heading = topicLines[0]?.slice(0, 60) || topic.slice(0, 50);
    return JSON.stringify({
      title: `Explicação — ${heading}`,
      summary: "Prévia didática baseada no trecho enviado.",
      sections: [
        {
          heading: "O que é",
          content: topic.slice(0, 200) || "Conceito extraído do material enviado.",
          example: "Exemplo relacionado ao contexto informado pelo aluno.",
        },
        {
          heading: "Por que importa",
          content: "Este conceito aparece no material porque organiza a compreensão dos demais tópicos.",
        },
      ],
      glossary: [{ term: heading.slice(0, 40), definition: "Termo-chave do trecho analisado." }],
      commonMistakes: ["Confundir conceitos próximos sem reler a definição original."],
      reviewQuestions: ["Explique com suas palavras o conceito principal.", "Dê um exemplo do contexto estudado."],
    });
  }

  if (systemPrompt.includes("EXERCISE_SOLUTION_TOOL")) {
    return JSON.stringify({
      title: "Exercícios resolvidos — prévia",
      exercises: [
        {
          number: 1,
          statement: topic.slice(0, 120) || "Exercício identificado no material enviado.",
          steps: [
            "Identificar os dados fornecidos no enunciado.",
            "Aplicar o procedimento indicado no material.",
            "Verificar a resposta final.",
          ],
          answer: "Resposta conforme método do material (prévia local).",
          verification: "Substituir na expressão original para confirmar.",
        },
      ],
    });
  }

  if (systemPrompt.includes("DEFENSE_SIM_TOOL")) {
    const categories = ["Metodologia", "Resultados", "Teoria", "Limitações", "Contribuição"];
    const questions = categories.map((category, i) => ({
      question: `Como você justifica ${category.toLowerCase()} do seu trabalho sobre ${topic.slice(0, 40)}?`,
      category,
      suggestedAnswer:
        "Resposta sugerida baseada no resumo enviado: apresente objetivo, método e principais achados com clareza e exemplos do seu estudo.",
      tips: "Seja objetivo, cite dados do seu trabalho e reconheça limitações com honestidade.",
    }));
    return JSON.stringify({
      title: "Simulação de banca — prévia",
      questions: questions.slice(0, 6),
    });
  }

  if (systemPrompt.includes("ARTICLE_SEARCH_TOOL")) {
    const kw = topic.slice(0, 40).replace(/\s+/g, " ").trim() || "tema";
    return JSON.stringify({
      title: `Estratégia de busca — ${kw}`,
      databases: ["SciELO", "Google Scholar", "CAPES Periódicos", "PubMed"],
      booleanQueries: [
        { label: "Ampla", query: `("${kw}" OR "${kw.split(" ")[0]}") AND (estudo OR pesquisa)` },
        { label: "Restrita", query: `"${kw}" AND ("Brasil" OR "brasileiro")` },
      ],
      descriptors: { mesh: [kw], decs: [kw] },
      inclusionCriteria: ["Artigos em português ou inglês", "Publicados nos últimos 10 anos"],
      exclusionCriteria: ["Editoriais sem revisão por pares", "Resumos de evento sem texto completo"],
      selectionFlow: ["Busca", "Triagem por título/resumo", "Leitura integral", "Extração de dados"],
      readingStrategy: "Priorize revisões sistemáticas e estudos primários recentes; registre referências em planilha.",
    });
  }

  if (systemPrompt.includes("RESEARCH_THEME_TOOL")) {
    const base = topic.slice(0, 50) || "área informada";
    const themes = [1, 2, 3].map((n) => ({
      title: `Tema ${n}: ${base} — recorte específico ${n}`,
      delimitation: `Foco em aspecto ${n} delimitado ao contexto informado pelo aluno.`,
      justification: "Relevância acadêmica e aplicabilidade para graduação.",
      viability: "Viável com revisão bibliográfica e dados acessíveis.",
      methodology: "Revisão integrativa ou estudo de caso, conforme orientação da instituição.",
      keywords: [base.split(" ")[0] ?? "pesquisa", "graduação", `tema-${n}`],
    }));
    return JSON.stringify({
      title: "Sugestões de temas — prévia",
      themes,
    });
  }

  if (systemPrompt.includes("referência") || systemPrompt.includes("ABNT")) {
    return `[DEMO] Referência gerada:\n\nAUTOR, Nome. Título do trabalho: subtítulo. Ano. Disponível em: <${topic.slice(0, 40)}>. Acesso em: ${new Date().toLocaleDateString("pt-BR")}.\n\n* Configure OPENAI_API_KEY para referências precisas com dados reais.`;
  }

  if (systemPrompt.includes("TRANSFORMAÇÃO DE TEXTO")) {
    const cleaned = userPrompt
      .replace(/\n\nOpções:[\s\S]*$/, "")
      .replace(/\n\n\[Entregue SOMENTE[\s\S]*$/, "")
      .trim();
    return cleaned.slice(0, 8000) || topic;
  }

  if (systemPrompt.includes("FIDELITY_PREAMBLE") || systemPrompt.includes("REGRAS OBRIGATÓRIAS DE FIDELIDADE")) {
    const lines =
      topicLines.length > 0
        ? topicLines.map((line) => `- ${line}`).join("\n")
        : `- ${topic.slice(0, 200)}`;
    return `**Resumo do material enviado**\n\n${lines}\n\n*(Prévia local — conecte a OpenAI para resumo completo e fiel ao texto original.)*`;
  }

  if (systemPrompt.includes("DOCUMENTO ACADÊMICO COMPLETO")) {
    const sectionTitle = topicLines[0]?.slice(0, 60) || topic.slice(0, 50);
    return `# ${sectionTitle}

## Introdução

${topic.slice(0, 300)}

## Desenvolvimento

${topicLines.length > 0 ? topicLines.map((l, i) => `### ${i + 1}. ${l.slice(0, 70)}\n\nDesenvolvimento do ponto com base no material informado.`).join("\n\n") : "Análise dos pontos centrais do material enviado."}

## Considerações finais

Síntese dos aspectos abordados, com aplicação prática para o contexto acadêmico informado.

*(Prévia local — conecte a OpenAI para documento completo.)*`;
  }

  if (json) {
    return JSON.stringify({
      result: `Análise processada sobre: ${topic.slice(0, 100)}`,
      sections: [
        {
          title: "Introdução",
          content: "Contextualização do tema abordado no material fornecido.",
        },
        {
          title: "Desenvolvimento",
          content: "Análise detalhada dos pontos principais identificados no texto.",
        },
        {
          title: "Conclusão",
          content: "Síntese dos aprendizados e recomendações para estudo complementar.",
        },
      ],
    });
  }

  const bulletPoints =
    topicLines.length > 0
      ? topicLines.map((line) => `- ${line.slice(0, 70)}`).join("\n")
      : `- ${topic.slice(0, 120)}`;

  return `${bulletPoints}\n\n*(Prévia local — configure OPENAI_API_KEY para resultado completo.)*`;
}
