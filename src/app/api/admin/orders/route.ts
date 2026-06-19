import type { OrderStatus, Plan } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const status = new URL(req.url).searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status ? { status: status as OrderStatus } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, plan: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

const createSchema = z.object({
  userId: z.string(),
  description: z.string().min(2),
  plan: z.enum(["FREE", "STUDENT", "PRO"]).optional(),
  amountCents: z.number().int().min(0),
  status: z.enum(["PENDING", "PAID", "CANCELLED", "OVERDUE"]).optional(),
  dueAt: z.string().optional(),
  adminNote: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = createSchema.parse(await req.json());

    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        description: body.description,
        plan: body.plan as Plan | undefined,
        amountCents: body.amountCents,
        status: (body.status as OrderStatus) ?? "PENDING",
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        adminNote: body.adminNote,
        paidAt: body.status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
