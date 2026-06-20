import type { ToolType, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AIError, generateAI, parseAIJsonResult } from "@/lib/ai";
import { logActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { checkAndDeductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { getToolById } from "@/lib/tools-config";
import { TOOL_PROMPTS } from "@/lib/tool-prompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  toolId: z.string(),
  input: z.string().min(10),
  options: z.record(z.string()).optional(),
  title: z.string().optional(),
});

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

    const promptConfig = TOOL_PROMPTS[toolId];
    if (!promptConfig) {
      return NextResponse.json({ error: "Prompt não configurado" }, { status: 400 });
    }

    if (!tool.freeUnlimited) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });
      if ((user?.credits ?? 0) < tool.credits) {
        return NextResponse.json(
          { error: "Créditos insuficientes. Faça upgrade do seu plano." },
          { status: 402 }
        );
      }
    }

    let userPrompt = input;
    if (options) {
      userPrompt += "\n\nOpções: " + JSON.stringify(options);
    }

    const result = await generateAI(
      promptConfig.system,
      userPrompt,
      promptConfig.json
    );

    let parsed: string | Record<string, unknown> = result;
    if (promptConfig.json) {
      try {
        parsed = parseAIJsonResult(result) as Record<string, unknown>;
      } catch {
        parsed = { raw: result };
      }
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

    await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        tool: tool.type as ToolType,
        title: title ?? `${tool.name} — ${new Date().toLocaleDateString("pt-BR")}`,
        content:
          typeof parsed === "string"
            ? { text: parsed }
            : (parsed as Prisma.InputJsonValue),
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
    if (error instanceof AIError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    console.error("tools/run:", error);
    return NextResponse.json(
      { error: "Erro ao processar. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
