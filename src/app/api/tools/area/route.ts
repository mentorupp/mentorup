import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAI } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { checkAndDeductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { getAreaBySlug } from "@/lib/tools-config";

export const dynamic = "force-dynamic";

const schema = z.object({
  areaSlug: z.string(),
  toolId: z.string(),
  input: z.string().min(10),
  title: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { areaSlug, toolId, input, title } = schema.parse(body);

    const area = getAreaBySlug(areaSlug);
    const areaTool = area?.tools.find((t) => t.id === toolId);
    if (!area || !areaTool) {
      return NextResponse.json({ error: "Ferramenta não encontrada" }, { status: 404 });
    }

    await checkAndDeductCredits(
      session.user.id,
      "AREA_TOOL",
      areaTool.credits,
      title ?? areaTool.name,
      { areaSlug, toolId }
    );

    const system =
      areaTool.systemPrompt ??
      `Você é especialista em ${area.name}. Ferramenta: ${areaTool.name}. Contexto: ${areaTool.promptHint}. ${areaTool.description}. Responda em markdown estruturado em português, com rigor acadêmico.`;

    const result = await generateAI(system, input);

    await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        tool: "AREA_TOOL",
        title: title ?? `${areaTool.name} — ${new Date().toLocaleDateString("pt-BR")}`,
        content: { text: result, area: area.name, tool: areaTool.name },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      result,
      creditsRemaining: user?.credits ?? 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CREDITS_INSUFFICIENT") {
      return NextResponse.json(
        { error: "Créditos insuficientes" },
        { status: 402 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}
