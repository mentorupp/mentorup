import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

    const [events, usage] = await Promise.all([
      prisma.activityEvent.findMany({
        where: type ? { type: type as never } : undefined,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.usageLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({ events, usage });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
