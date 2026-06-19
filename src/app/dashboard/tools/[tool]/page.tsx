import ToolRunner from "@/components/dashboard/ToolRunner";
import { getToolById } from "@/lib/tools-config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const toolPages: Record<string, { placeholder: string }> = {
  "mind-map": { placeholder: "Envie PDF/Word ou cole o conteúdo da aula, artigo ou capítulo..." },
  "pdf-quiz": { placeholder: "Envie PDF/Word ou cole o material de estudo para gerar questões..." },
  rewrite: { placeholder: "Envie PDF/Word ou cole o texto que deseja reescrever..." },
  summarize: { placeholder: "Envie PDF/Word ou cole o material completo para resumir..." },
  flashcards: { placeholder: "Envie PDF/Word ou cole o conteúdo para gerar flashcards..." },
  references: { placeholder: "Informe: autor, título, ano, editora, URL ou DOI..." },
  grammar: { placeholder: "Envie PDF/Word ou cole o texto para correção gramatical..." },
  "chat-pdf": { placeholder: "Envie PDF/Word ou cole o documento — depois faça sua pergunta no início do texto..." },
  "exam-sim": { placeholder: "Envie PDF/Word ou cole o material da disciplina para o simulado..." },
  "case-study": { placeholder: "Envie PDF/Word, cole o material ou descreva o caso..." },
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);
  const pageConfig = toolPages[toolId];

  if (!tool || !pageConfig) notFound();

  const Icon = tool.icon;

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
      <ToolRunner toolId={toolId} placeholder={pageConfig.placeholder} />
    </div>
  );
}
