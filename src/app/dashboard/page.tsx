import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tools, areas } from "@/lib/tools-config";
import {
  ArrowRight,
  GitBranch,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let recentLogs: { tool: string; title: string | null; createdAt: Date; creditsUsed: number }[] = [];
  let totalUsage = 0;

  if (userId) {
    try {
      recentLogs = await prisma.usageLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { tool: true, title: true, createdAt: true, creditsUsed: true },
      });
      totalUsage = await prisma.usageLog.count({ where: { userId } });
    } catch {
      /* DB not connected */
    }
  }

  const popularTools = tools.filter((t) => t.popular || t.category === "core").slice(0, 6);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-surface-900">
          Olá, {session?.user?.name?.split(" ")[0] ?? "Estudante"} 👋
        </h1>
        <p className="mt-1 text-zinc-600">
          {session?.user?.course
            ? `${session.user.course}${session.user.area ? ` · ${session.user.area}` : ""}`
            : "Selecione sua área em Configurações para ferramentas personalizadas."}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-surface-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Sparkles size={16} className="text-primary-500" />
            Créditos disponíveis
          </div>
          <p className="font-display mt-2 text-3xl font-bold text-primary-600">
            {session?.user?.credits ?? 15}
          </p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <TrendingUp size={16} className="text-accent-500" />
            Ferramentas usadas
          </div>
          <p className="font-display mt-2 text-3xl font-bold text-surface-900">{totalUsage}</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <GitBranch size={16} className="text-violet-500" />
            Plano atual
          </div>
          <p className="font-display mt-2 text-3xl font-bold text-surface-900">
            {session?.user?.plan === "PRO" ? "Pro" : session?.user?.plan === "STUDENT" ? "Estudante" : "Grátis"}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-6 text-white">
        <h2 className="font-display text-xl font-bold">Comece por aqui</h2>
        <p className="mt-1 text-primary-100">
          Mapa mental, questões de PDF e referências ABNT — teste grátis com seus 15 créditos.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/tools/mind-map"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary-600 transition hover:brightness-105"
          >
            Criar Mapa Mental
          </Link>
          <Link
            href="/dashboard/tools/references"
            className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            Referências ABNT
          </Link>
          {session?.user?.plan === "FREE" && (
            <Link
              href="/dashboard/billing"
              className="rounded-xl border border-amber-300/50 bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-400/30"
            >
              Assinar — 150 créditos/mês
            </Link>
          )}
        </div>
      </div>

      <h2 className="font-display mb-4 text-xl font-bold">Ferramentas</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popularTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="group rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                <Icon size={20} />
              </div>
              <h3 className="font-display font-bold text-surface-900">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{tool.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                {tool.freeUnlimited ? "Grátis" : `${tool.credits} créditos`}
                <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      <h2 className="font-display mb-4 text-xl font-bold">Saúde e Humanas</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <Link
              key={area.slug}
              href={`/dashboard/areas/${area.slug}`}
              className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${area.color} text-white`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900">{area.name}</p>
                <p className="text-xs text-zinc-500">{area.tools.length} ferramentas</p>
              </div>
            </Link>
          );
        })}
      </div>

      {recentLogs.length > 0 && (
        <>
          <h2 className="font-display mb-4 text-xl font-bold">Atividade Recente</h2>
          <div className="rounded-2xl border border-surface-200 bg-white divide-y divide-surface-100">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-surface-900">{log.title ?? log.tool}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(log.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="text-xs text-zinc-400">-{log.creditsUsed} cr</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
