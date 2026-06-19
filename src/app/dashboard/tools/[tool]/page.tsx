import ToolRunner from "@/components/dashboard/ToolRunner";
import { getToolById } from "@/lib/tools-config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const toolPages: Record<string, { placeholder: string }> = {
  "mind-map": { placeholder: "Cole o conteúdo do PDF, artigo ou aula para gerar o mapa mental..." },
  "pdf-quiz": { placeholder: "Cole o texto do material de estudo para gerar questões..." },
  rewrite: { placeholder: "Cole o texto que deseja reescrever ou melhorar..." },
  summarize: { placeholder: "Cole o material completo para resumir..." },
  flashcards: { placeholder: "Cole o conteúdo para gerar flashcards de estudo..." },
  references: { placeholder: "Informe: autor, título, ano, editora, URL ou DOI..." },
  grammar: { placeholder: "Cole o texto para correção gramatical..." },
  "chat-pdf": { placeholder: "Cole o conteúdo do documento e depois faça sua pergunta no início do texto..." },
  "exam-sim": { placeholder: "Cole o material da disciplina para gerar um simulado completo..." },
  "case-study": { placeholder: "Descreva o caso ou cole o material para estruturar o estudo de caso..." },
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
