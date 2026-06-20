"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Crown,
  GitBranch,
  History,
  Home,
  LayoutGrid,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import MentorUpLogo from "@/components/MentorUpLogo";
import { cn } from "@/lib/utils";
import { areas, tools } from "@/lib/tools-config";

const mainNav = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/tools", label: "Ferramentas", icon: LayoutGrid },
  { href: "/dashboard/areas", label: "Por Área", icon: Stethoscope },
  { href: "/dashboard/history", label: "Histórico", icon: History },
  { href: "/dashboard/billing", label: "Planos", icon: CreditCard },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-surface-200 bg-white">
      <div className="flex h-[4.5rem] items-center border-b border-surface-200 px-5">
        <MentorUpLogo href="/dashboard" size="lg" />
      </div>

      <div
        className={`mx-4 mt-4 rounded-xl p-4 ${
          session?.user?.plan === "FREE"
            ? "bg-gradient-to-br from-primary-600 to-violet-600 text-white"
            : "bg-gradient-to-br from-primary-50 to-accent-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              session?.user?.plan === "FREE" ? "text-primary-100" : "text-primary-600"
            }`}
          >
            Créditos
          </span>
          <Sparkles size={14} className={session?.user?.plan === "FREE" ? "text-white" : "text-primary-500"} />
        </div>
        <p
          className={`font-display mt-1 text-2xl font-bold ${
            session?.user?.plan === "FREE" ? "text-white" : "text-surface-900"
          }`}
        >
          {session?.user?.credits ?? 15}
        </p>
        <p className={`text-xs ${session?.user?.plan === "FREE" ? "text-primary-100" : "text-zinc-500"}`}>
          Plano{" "}
          {session?.user?.plan === "PRO" ? "Pro" : session?.user?.plan === "STUDENT" ? "Estudante" : "Grátis"}
        </p>
        {session?.user?.plan === "FREE" ? (
          <Link
            href="/dashboard/billing"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-center text-xs font-bold text-primary-700 transition hover:brightness-105"
          >
            <Crown size={14} />
            Assinar — a partir de R$ 29/mês
          </Link>
        ) : (
          <Link
            href="/dashboard/billing"
            className="mt-2 block text-center text-xs font-semibold text-primary-600 hover:underline"
          >
            Gerenciar plano
          </Link>
        )}
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          Menu
        </p>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-zinc-600 hover:bg-surface-50 hover:text-surface-900"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {session?.user?.role === "ADMIN" && (
          <>
            <p className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Admin
            </p>
            <Link
              href="/dashboard/admin"
              className={cn(
                "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/dashboard/admin")
                  ? "bg-red-50 text-red-700"
                  : "text-zinc-600 hover:bg-red-50 hover:text-red-700"
              )}
            >
              <Shield size={18} />
              Painel Admin
            </Link>
          </>
        )}

        <p className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          Populares
        </p>
        {tools.filter((t) => t.popular).map((tool) => {
          const Icon = tool.icon;
          const active = pathname === tool.href;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={cn(
                "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-zinc-500 hover:bg-surface-50 hover:text-surface-900"
              )}
            >
              <Icon size={16} />
              <span className="truncate">{tool.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-200 p-4">
        <div className="mb-3 truncate text-sm">
          <p className="font-medium text-surface-900">{session?.user?.name ?? "Estudante"}</p>
          <p className="truncate text-xs text-zinc-500">{session?.user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
