import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateAI(
  systemPrompt: string,
  userPrompt: string,
  json = false
): Promise<string> {
  if (openai) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt.slice(0, 12000) },
      ],
      temperature: 0.7,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    });
    return response.choices[0]?.message?.content ?? "";
  }

  return generateDemoResponse(systemPrompt, userPrompt, json);
}

function generateDemoResponse(
  systemPrompt: string,
  userPrompt: string,
  json: boolean
): string {
  const topic = userPrompt.slice(0, 200).replace(/\n/g, " ").trim() || "conteúdo acadêmico";

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

  if (systemPrompt.includes("questões") || systemPrompt.includes("quiz")) {
    const data = {
      questions: [
        {
          type: "objective",
          question: `Qual é o conceito central abordado em "${topic.slice(0, 60)}"?`,
          options: ["Conceito A — definição primária", "Conceito B — abordagem alternativa", "Conceito C — visão complementar", "Conceito D — perspectiva crítica"],
          answer: 0,
          explanation: "A alternativa correta representa o conceito fundamental identificado no material analisado.",
        },
        {
          type: "objective",
          question: "Qual metodologia é mais adequada para abordar este tema?",
          options: ["Quantitativa", "Qualitativa", "Mista", "Experimental"],
          answer: 2,
          explanation: "A abordagem mista combina métodos quantitativos e qualitativos, ideal para temas complexos.",
        },
        {
          type: "discursive",
          question: "Discuta as principais implicações teóricas e práticas do tema apresentado.",
          rubric: "Avaliar: compreensão do tema (40%), argumentação (30%), exemplos (20%), clareza (10%).",
        },
      ],
    };
    return JSON.stringify(data);
  }

  if (systemPrompt.includes("flashcard")) {
    const data = {
      cards: [
        { front: "Conceito principal", back: topic.slice(0, 150) },
        { front: "Definição-chave", back: "Termo fundamental relacionado ao conteúdo estudado, essencial para compreensão do tema." },
        { front: "Aplicação prática", back: "Como este conhecimento se aplica em contextos acadêmicos e profissionais." },
        { front: "Relação teórica", back: "Conexão com teorias e autores relevantes na área de conhecimento." },
        { front: "Ponto de atenção", back: "Aspecto crítico que frequentemente aparece em provas e avaliações." },
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
        { title: "Introdução", content: "Contextualização do tema abordado no material fornecido." },
        { title: "Desenvolvimento", content: "Análise detalhada dos pontos principais identificados no texto." },
        { title: "Conclusão", content: "Síntese dos aprendizados e recomendações para estudo complementar." },
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
