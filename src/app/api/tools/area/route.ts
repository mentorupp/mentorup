import { NextResponse } from "next/server";
import { z } from "zod";
import { AIError, generateAI } from "@/lib/ai";
import { getAreaMaxTokens, USER_MATERIAL_SUFFIX, withAreaToolPreamble } from "@/lib/ai-config";
import { auth } from "@/lib/auth";
import { checkAndDeductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { getAreaBySlug } from "@/lib/tools-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });
    if ((user?.credits ?? 0) < areaTool.credits) {
      return NextResponse.json({ error: "Créditos insuficientes" }, { status: 402 });
    }

    const system = withAreaToolPreamble(
      areaTool.systemPrompt ??
        `Você é especialista em ${area.name}. Ferramenta: ${areaTool.name}. Contexto: ${areaTool.promptHint}. ${areaTool.description}. Entregue EXATAMENTE o tipo de documento descrito — conteúdo específico, profissional e pronto para uso real.`
    );

    const aiResult = await generateAI(system, input + USER_MATERIAL_SUFFIX, false, {
      maxTokens: getAreaMaxTokens(),
    });

    const creditCost = aiResult.demo ? 0 : areaTool.credits;

    await checkAndDeductCredits(
      session.user.id,
      "AREA_TOOL",
      creditCost,
      title ?? areaTool.name,
      { areaSlug, toolId, demo: aiResult.demo }
    );

    await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        tool: "AREA_TOOL",
        title: title ?? `${areaTool.name} — ${new Date().toLocaleDateString("pt-BR")}`,
        content: {
          text: aiResult.text,
          area: area.name,
          tool: areaTool.name,
          demo: aiResult.demo,
        },
      },
    });

    const updated = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      result: aiResult.text,
      creditsRemaining: updated?.credits ?? 0,
      demo: aiResult.demo,
      demoReason: aiResult.demoReason ?? null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CREDITS_INSUFFICIENT") {
      return NextResponse.json(
        { error: "Créditos insuficientes" },
        { status: 402 }
      );
    }
    if (error instanceof AIError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("tools/area:", error);
    return NextResponse.json(
      { error: "Erro ao processar. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
