import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersToday,
      newUsersWeek,
      contactsNew,
      contactsTotal,
      ordersPending,
      ordersOverdue,
      ordersPaid,
      usageToday,
      usageWeek,
      loginsToday,
      lowCredits,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.contactLead.count({ where: { status: "NEW" } }),
      prisma.contactLead.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "OVERDUE" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.usageLog.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.usageLog.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.activityEvent.count({
        where: { type: "LOGIN", createdAt: { gte: todayStart } },
      }),
      prisma.user.count({ where: { credits: { lte: 2 }, role: "USER" } }),
      prisma.activityEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      newUsersToday,
      newUsersWeek,
      contactsNew,
      contactsTotal,
      ordersPending,
      ordersOverdue,
      ordersPaid,
      usageToday,
      usageWeek,
      loginsToday,
      lowCredits,
      recentActivity,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    console.error(e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
