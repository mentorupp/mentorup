import type { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELLED", "OVERDUE"]).optional(),
  adminNote: z.string().max(2000).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = schema.parse(await req.json());

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status as OrderStatus | undefined,
        adminNote: body.adminNote,
        paidAt: body.status === "PAID" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ order });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
