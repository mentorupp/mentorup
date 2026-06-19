import type { Plan, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  credits: z.number().int().min(0).max(99999).optional(),
  creditsDelta: z.number().int().optional(),
  plan: z.enum(["FREE", "STUDENT", "PRO"]).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  adminNote: z.string().max(2000).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = schema.parse(await req.json());

    const current = await prisma.user.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    let credits = current.credits;
    if (body.credits !== undefined) credits = body.credits;
    if (body.creditsDelta !== undefined) credits = Math.max(0, credits + body.creditsDelta);

    const user = await prisma.user.update({
      where: { id },
      data: {
        credits,
        plan: body.plan as Plan | undefined,
        role: body.role as Role | undefined,
        adminNote: body.adminNote,
      },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        plan: true,
        role: true,
        adminNote: true,
      },
    });

    await logActivity("ADMIN_ACTION", {
      userId: session.user.id,
      label: `Atualizou ${user.email}`,
      meta: {
        targetId: id,
        changes: body,
        newCredits: credits,
      },
    });

    return NextResponse.json({ user });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        usageLogs: { orderBy: { createdAt: "desc" }, take: 20 },
        contactLeads: { orderBy: { createdAt: "desc" }, take: 10 },
        orders: { orderBy: { createdAt: "desc" }, take: 10 },
        activityEvents: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    const { password: _, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
