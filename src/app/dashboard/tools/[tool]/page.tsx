import ToolRunner from "@/components/dashboard/ToolRunner";
import ExamCorrectionRunner from "@/components/dashboard/ExamCorrectionRunner";
import StudyScheduleRunner from "@/components/dashboard/StudyScheduleRunner";
import ReferencesRunner from "@/components/dashboard/ReferencesRunner";
import SlidesRunner from "@/components/dashboard/SlidesRunner";
import ChatPdfRunner from "@/components/dashboard/ChatPdfRunner";
import { getToolById } from "@/lib/tools-config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const placeholders: Record<string, string> = {
  summarize: "Envie PDF/Word ou cole o artigo, capítulo ou apostila para resumir...",
  "explain-content": "Cole o trecho ou descreva o conceito que você não entendeu...",
  "mind-map": "Envie PDF/Word ou cole o conteúdo da aula para gerar o mapa mental...",
  flashcards: "Envie PDF/Word ou cole o material para gerar flashcards...",
  "pdf-quiz": "Envie PDF/Word ou cole o material para gerar questões de estudo...",
  "exam-sim": "Envie PDF/Word ou cole o material da disciplina para o simulado...",
  "exam-correction": "Opcional: informe a matéria ou número das questões...",
  "exercise-solution": "Cole a lista de exercícios ou questões para resolução comentada...",
  "study-schedule": "Ex.: Psicologia — Ansiedade e estresse (caps. 3-5). Prova dia 15/08. Inclua revisão e simulado...",
  "chat-pdf": "Cole o texto do documento abaixo ou use o upload — sua pergunta vai no campo dedicado acima.",
  references: "Cole DOI, URL, bibliografia ou capa do trabalho (autor, título, ano, cidade)...",
  citations: "Cole o trecho a citar e os dados da fonte (autor, ano, página)...",
  "abnt-format": "Cole trechos do trabalho ou descreva o que precisa formatar (capa, citações, referências)...",
  rewrite: "Envie PDF/Word ou cole o texto que deseja reescrever...",
  grammar: "Envie PDF/Word ou cole o texto para correção gramatical...",
  "scientific-language": "Cole o texto informal ou coloquial para adequar ao padrão científico...",
  translate: "Cole o texto e indique: traduzir para PT ou EN...",
  "expand-text": "Cole o parágrafo ou seção que precisa expandir (informe meta de extensão se quiser)...",
  fichamento: "Envie PDF/Word ou cole o artigo/livro para fichamento analítico...",
  "literature-synthesis": "Cole resumos, fichamentos ou trechos de vários artigos sobre o mesmo tema...",
  "research-gap": "Cole sua revisão bibliográfica ou descreva o tema para identificar lacunas...",
  "article-search": "Descreva o tema da pesquisa e o curso — geramos estratégia de busca...",
  "research-theme": "Informe seu curso, área de interesse e restrições (tempo, acesso a dados)...",
  "research-problem": "Descreva o tema delimitado para formular problema e objetivos...",
  "methodology-builder": "Descreva tema, tipo de pesquisa pretendida e contexto (curso, prazo)...",
  "tcc-structure": "Descreva tema, curso, tipo de pesquisa e orientações da instituição...",
  "case-study": "Envie PDF/Word, cole o material ou descreva o caso...",
  "slides-builder": "Cole resumo do TCC, capítulos ou tema — geramos slides + roteiro de fala com tempo...",
  "defense-sim": "Cole resumo do TCC (introdução, metodologia, resultados) para simular a banca...",
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) notFound();

  const Icon = tool.icon;
  const placeholder =
    placeholders[toolId] ?? "Envie PDF/Word ou cole o conteúdo aqui...";

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <Icon size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-surface-900">{tool.name}</h1>
          <p className="text-sm text-zinc-500">{tool.description}</p>
        </div>
      </div>
      {toolId === "exam-correction" ? (
        <ExamCorrectionRunner toolId={toolId} />
      ) : toolId === "study-schedule" ? (
        <StudyScheduleRunner toolId={toolId} placeholder={placeholder} />
      ) : toolId === "references" ? (
        <ReferencesRunner toolId={toolId} placeholder={placeholder} />
      ) : toolId === "slides-builder" ? (
        <SlidesRunner toolId={toolId} placeholder={placeholder} />
      ) : toolId === "chat-pdf" ? (
        <ChatPdfRunner toolId={toolId} />
      ) : (
        <ToolRunner toolId={toolId} placeholder={placeholder} />
      )}
    </div>
  );
}
