import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY?.trim()
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY.trim(),
      timeout: 55_000,
      maxRetries: 1,
    })
  : null;

export class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIError";
  }
}

export function isOpenAIConfigured(): boolean {
  return Boolean(openai);
}

export function parseAIJsonResult(result: string): unknown {
  const trimmed = result.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const jsonStr = (fenced ? fenced[1] : trimmed).trim();
  return JSON.parse(jsonStr);
}

function mapOpenAIError(error: unknown): AIError {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return new AIError(
        "Chave da OpenAI inválida no servidor. Verifique OPENAI_API_KEY na Vercel e faça redeploy."
      );
    }
    if (error.status === 429) {
      return new AIError(
        "Limite de uso da IA atingido. Aguarde alguns minutos e tente novamente."
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

export async function generateAI(
  systemPrompt: string,
  userPrompt: string,
  json = false
): Promise<string> {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt.slice(0, 12_000) },
        ],
        temperature: 0.6,
        max_tokens: json ? 4_096 : 3_000,
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
      if (error instanceof AIError) throw error;
      throw mapOpenAIError(error);
    }
  }

  return generateDemoResponse(systemPrompt, userPrompt, json);
}

function generateDemoResponse(
  systemPrompt: string,
  userPrompt: string,
  json: boolean
): string {
  const topic =
    userPrompt.slice(0, 200).replace(/\n/g, " ").trim() || "conteúdo acadêmico";

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

  if (systemPrompt.includes("simulado de prova")) {
    const data = {
      exam: {
        title: `Simulado — ${topic.slice(0, 50)}`,
        duration: "90 minutos",
        questions: [
          {
            type: "objective",
            question: `Qual é o tema central abordado em "${topic.slice(0, 60)}"?`,
            options: [
              "Conceito A — definição primária",
              "Conceito B — abordagem alternativa",
              "Conceito C — visão complementar",
              "Conceito D — perspectiva crítica",
            ],
            answer: 0,
            points: 1,
            explanation: "Alternativa correta com base no material analisado.",
          },
          {
            type: "objective",
            question: "Qual abordagem metodológica é mais adequada para este tema?",
            options: ["Quantitativa", "Qualitativa", "Mista", "Experimental"],
            answer: 2,
            points: 1,
            explanation: "A abordagem mista integra métodos quantitativos e qualitativos.",
          },
          {
            type: "discursive",
            question: "Discuta as principais implicações teóricas e práticas do conteúdo estudado.",
            points: 3,
          },
        ],
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
    const data = {
      cards: [
        { front: "Conceito principal", back: topic.slice(0, 150) },
        {
          front: "Definição-chave",
          back: "Termo fundamental relacionado ao conteúdo estudado, essencial para compreensão do tema.",
        },
        {
          front: "Aplicação prática",
          back: "Como este conhecimento se aplica em contextos acadêmicos e profissionais.",
        },
        {
          front: "Relação teórica",
          back: "Conexão com teorias e autores relevantes na área de conhecimento.",
        },
        {
          front: "Ponto de atenção",
          back: "Aspecto crítico que frequentemente aparece em provas e avaliações.",
        },
      ],
    };
    return JSON.stringify(data);
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

  return `## Resultado — MentorUp IA

**Tema analisado:** ${topic.slice(0, 120)}

### Resumo
Conteúdo processado com sucesso. Esta é uma resposta de demonstração — configure \`OPENAI_API_KEY\` no servidor para resultados completos e personalizados com IA avançada.

### Pontos Principais
1. **Conceito central** — Identificado a partir do material enviado
2. **Relações teóricas** — Conexões com a literatura acadêmica da área
3. **Aplicações práticas** — Como utilizar este conhecimento em trabalhos e provas

### Recomendações
- Revise o material original complementando com as sugestões acima
- Use o Mapa Mental para visualizar as relações entre conceitos
- Gere flashcards para fixar os termos-chave

---
*Modo demonstração ativo. Conecte OpenAI para resultados completos.*`;
}
