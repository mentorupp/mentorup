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
};

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
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt.slice(0, inputLimit) },
        ],
        temperature: 0.6,
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
  maxTokens?: number
): Promise<string> {
  if (!openai) throw new AIError("OpenAI não configurada.");

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
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [{ type: "text", text: userPrompt }, ...imageParts],
          },
        ],
        temperature: 0.3,
        max_tokens: maxTokens ?? getToolMaxTokens("exam-correction", json),
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
  json = false
): Promise<AIResult> {
  if (!openai) {
    return {
      text: generateDemoResponse(systemPrompt, userPrompt, json),
      demo: true,
      demoReason: "OpenAI não configurada — prévia local. Configure a chave para corrigir fotos de verdade.",
    };
  }

  try {
    const text = await callOpenAIVision(systemPrompt, userPrompt, images, json);
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

  if (systemPrompt.includes("corrigindo provas")) {
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

  if (systemPrompt.includes("simulado de prova")) {
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

  if (systemPrompt.includes("referência") || systemPrompt.includes("ABNT")) {
    return `[DEMO] Referência gerada:\n\nAUTOR, Nome. Título do trabalho: subtítulo. Ano. Disponível em: <${topic.slice(0, 40)}>. Acesso em: ${new Date().toLocaleDateString("pt-BR")}.\n\n* Configure OPENAI_API_KEY para referências precisas com dados reais.`;
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
      ? topicLines.map((line) => `- **${line.slice(0, 70)}**`).join("\n")
      : "1. **Conceito central** — Identificado a partir do material enviado\n2. **Relações teóricas** — Conexões com a literatura da área\n3. **Aplicações práticas** — Uso em trabalhos e provas";

  return `1 INTRODUÇÃO

${topic.slice(0, 120)}

2 DESENVOLVIMENTO

${bulletPoints.replace(/^- /gm, "").split("\n").map((line, i) => `${i + 1}. ${line.replace(/\*\*/g, "")}`).join("\n\n")}

3 CONSIDERAÇÕES FINAIS

Síntese dos pontos centrais do material analisado, com aplicação para estudo e avaliação acadêmica.`;
}
