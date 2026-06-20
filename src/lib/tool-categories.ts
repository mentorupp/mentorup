export type ToolGroup = "producao" | "pesquisa" | "estudo" | "tcc" | "apresentacao";

export const toolGroups: Record<
  ToolGroup,
  { label: string; description: string; emoji: string }
> = {
  estudo: {
    label: "Apoio ao estudo",
    description: "Resumos, flashcards, questões, mapas mentais e explicações — o que mais cresceu entre universitários.",
    emoji: "🤖",
  },
  producao: {
    label: "Produção acadêmica",
    description: "ABNT, referências, citações, revisão, reescrita e linguagem científica.",
    emoji: "📚",
  },
  pesquisa: {
    label: "Pesquisa científica",
    description: "Síntese bibliográfica, lacunas, busca em bases e comparação de estudos.",
    emoji: "🔍",
  },
  tcc: {
    label: "TCC e projetos",
    description: "Tema, problema, objetivos, metodologia e preparação para defesa.",
    emoji: "🎓",
  },
  apresentacao: {
    label: "Apresentações",
    description: "Slides, roteiro de fala e simulação de perguntas da banca.",
    emoji: "📊",
  },
};
