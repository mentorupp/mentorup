import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { AIError } from "@/lib/ai";
import { logActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { checkAndDeductCredits } from "@/lib/credits";
import {
  EXAM_CORRECTION_TOOL_ID,
  ExamPhotoError,
  preprocessExamImage,
  runExamCorrection,
} from "@/lib/exam-correction";
import {
  isAcceptedImageFile,
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
} from "@/lib/image-upload-formats";
import { prisma } from "@/lib/prisma";
import { getToolById } from "@/lib/tools-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const tool = getToolById(EXAM_CORRECTION_TOOL_ID);
    if (!tool) {
      return NextResponse.json({ error: "Ferramenta não configurada" }, { status: 404 });
    }

    const formData = await req.formData();
    const includeExplanation = formData.get("includeExplanation") !== "false";
    const notes = String(formData.get("notes") ?? "").trim();

    const files = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "Envie pelo menos uma imagem da prova." }, { status: 400 });
    }

    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Máximo de ${MAX_IMAGES} imagens por envio.` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!isAcceptedImageFile(file)) {
        return NextResponse.json(
          { error: "Formato inválido. Use JPG, PNG ou WEBP." },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Imagem muito grande. Máximo 8 MB." }, { status: 400 });
      }
    }

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

    const visionImages = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return preprocessExamImage(buffer);
      })
    );

    const { result, demo, demoReason } = await runExamCorrection({
      images: visionImages,
      includeExplanation,
      notes: notes || undefined,
    });

    const creditCost = demo ? 0 : tool.credits;

    await checkAndDeductCredits(session.user.id, "EXAM_CORRECT", creditCost, tool.name, {
      toolId: EXAM_CORRECTION_TOOL_ID,
      imageCount: files.length,
      includeExplanation,
      demo,
    });

    await logActivity("TOOL_USE", {
      userId: session.user.id,
      label: tool.name,
      meta: { toolId: EXAM_CORRECTION_TOOL_ID, credits: creditCost, demo },
    });

    await prisma.savedItem.create({
      data: {
        userId: session.user.id,
        tool: "EXAM_CORRECT",
        title: `${tool.name} — ${new Date().toLocaleDateString("pt-BR")}`,
        content: { ...result, demo } as Prisma.InputJsonValue,
      },
    });

    const updated = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      result,
      creditsRemaining: updated?.credits ?? 0,
      demo,
      demoReason: demoReason ?? null,
    });
  } catch (error) {
    if (error instanceof ExamPhotoError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof AIError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("tools/correct-exam:", error);
    return NextResponse.json(
      { error: "Erro ao corrigir a prova. Tente outra foto." },
      { status: 500 }
    );
  }
}
