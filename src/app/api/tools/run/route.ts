import type { ToolType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAI } from "@/lib/ai";
import { logActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { checkAndDeductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { getToolById } from "@/lib/tools-config";

export const dynamic = "force-dynamic";

const schema = z.object({
  toolId: z.string(),
  input: z.string().min(10),
  options: z.record(z.string()).optional(),
  title: z.string().optional(),
});

const PROMPTS: Record<string, { system: string; json?: boolean }> = {
  "mind-map": {
    system:
      "Você é um especialista em pedagogia. Gere um mapa mental acadêmico em JSON com formato: { title: string, nodes: [{ id, label, type: 'root'|'branch'|'leaf', parent?: id }] }. Responda APENAS com JSON válido em português.",
    json: true,
  },
  "pdf-quiz": {
    system:
      "Você é professor universitário. Gere questões de prova em JSON: { questions: [{ type: 'objective'|'discursive', question, options?, answer?, explanation?, rubric? }] }. Mínimo 5 questões. Responda APENAS JSON em português.",
    json: true,
  },
  rewrite: {
    system:
      "Você é revisor acadêmico. Reescreva o texto melhorando clareza, coesão e tom formal acadêmico. Mantenha o significado original. Responda em markdown em português.",
  },
  summarize: {
    system:
      "Você é especialista acadêmico. Crie um resumo estruturado com: título, resumo executivo, tópicos principais (bullet points), palavras-chave ABNT, e conclusão. Responda em markdown em português.",
  },
  flashcards: {
    system:
      "Gere flashcards de estudo em JSON: { cards: [{ front, back }] }. Mínimo 8 cartões concisos. Responda APENAS JSON em português.",
    json: true,
  },
  references: {
    system:
      "Gere referências bibliográficas corretas em ABNT NBR 6023:2025 e APA 7ª ed. a partir dos dados fornecidos. Formate claramente ambas as versões. Responda em markdown em português.",
  },
  grammar: {
    system:
      "Corrija o texto acadêmico: ortografia, concordância, pontuação e clareza. Mostre o texto corrigido e liste as principais alterações. Responda em markdown em português.",
  },
  "chat-pdf": {
    system:
      "Você é tutor acadêmico. Responda perguntas sobre o documento fornecido, citando trechos relevantes. Responda em markdown em português.",
  },
  "exam-sim": {
    system:
      "Crie um simulado de prova completo em JSON: { exam: { title, duration, questions: [{ type, question, options?, answer?, points }] } }. Mínimo 10 questões variadas. Responda APENAS JSON em português.",
    json: true,
  },
  "case-study": {
    system:
      "Estruture um estudo de caso acadêmico completo: contexto, problema, análise, alternativas, recomendação e referências sugeridas. Responda em markdown em português.",
  },
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { toolId, input, options, title } = schema.parse(body);

    const tool = getToolById(toolId);
    if (!tool) {
      return NextResponse.json({ error: "Ferramenta não encontrada" }, { status: 404 });
    }

    const promptConfig = PROMPTS[toolId];
    if (!promptConfig) {
      return NextResponse.json({ error: "Prompt não configurado" }, { status: 400 });
    }

    await checkAndDeductCredits(
      session.user.id,
      tool.type as ToolType,
      tool.credits,
      title ?? tool.name,
      { toolId, inputLength: input.length }
    );

    await logActivity("TOOL_USE", {
      userId: session.user.id,
      label: tool.name,
      meta: { toolId, credits: tool.credits },
    });

    let userPrompt = input;
    if (options) {
      userPrompt += "\n\nOpções: " + JSON.stringify(options);
    }

    const result = await generateAI(
      promptConfig.system,
      userPrompt,
      promptConfig.json
    );

    let parsed = result;
    if (promptConfig.json) {
      try {
        parsed = JSON.parse(result);
      } catch {
        parsed = result;
      }
    }

    await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        tool: tool.type as ToolType,
        title: title ?? `${tool.name} — ${new Date().toLocaleDateString("pt-BR")}`,
        content: typeof parsed === "string" ? { text: parsed } : parsed,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      result: parsed,
      creditsRemaining: user?.credits ?? 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CREDITS_INSUFFICIENT") {
      return NextResponse.json(
        { error: "Créditos insuficientes. Faça upgrade do seu plano." },
        { status: 402 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}
