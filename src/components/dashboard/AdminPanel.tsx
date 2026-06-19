"use client";

import {
  Activity,
  CreditCard,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn, formatDate } from "@/lib/utils";

type Tab = "overview" | "users" | "contacts" | "orders" | "activity";

interface Stats {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  contactsNew: number;
  contactsTotal: number;
  ordersPending: number;
  ordersOverdue: number;
  ordersPaid: number;
  usageToday: number;
  usageWeek: number;
  loginsToday: number;
  lowCredits: number;
  recentActivity: Array<{
    id: string;
    type: string;
    label: string | null;
    path: string | null;
    createdAt: string;
    user: { name: string | null; email: string } | null;
  }>;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  course: string | null;
  credits: number;
  plan: string;
  role: string;
  adminNote: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  _count: { usageLogs: number; contactLeads: number; orders: number };
}

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Visão geral", icon: Activity },
  { id: "users", label: "Usuários", icon: Users },
  { id: "contacts", label: "Contatos", icon: Mail },
  { id: "orders", label: "Pagamentos", icon: CreditCard },
  { id: "activity", label: "Atividade", icon: Activity },
];

const activityLabels: Record<string, string> = {
  REGISTER: "Cadastro",
  LOGIN: "Login",
  PAGE_VIEW: "Página vista",
  TOOL_USE: "Ferramenta usada",
  CONTACT_SUBMIT: "Contato enviado",
  BILLING_VIEW: "Viu planos",
  PLAN_INTEREST: "Interesse em plano",
  ADMIN_ACTION: "Ação admin",
};

const contactStatusLabels: Record<string, string> = {
  NEW: "Novo",
  CONTACTED: "Contactado",
  CONVERTED: "Convertido",
  CLOSED: "Fechado",
};

const orderStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  OVERDUE: "Em atraso",
};

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [contacts, setContacts] = useState<Array<Record<string, unknown>>>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [activity, setActivity] = useState<{
    events: Array<Record<string, unknown>>;
    usage: Array<Record<string, unknown>>;
  }>({ events: [], usage: [] });
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [creditDelta, setCreditDelta] = useState("15");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, contactsRes, ordersRes, activityRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch(`/api/admin/users${search ? `?q=${encodeURIComponent(search)}` : ""}`),
          fetch("/api/admin/contacts"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/activity?limit=40"),
        ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers((await usersRes.json()).users);
      if (contactsRes.ok) setContacts((await contactsRes.json()).contacts);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
      if (activityRes.ok) setActivity(await activityRes.json());
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const updateUser = async (id: string, data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setEditUser(null);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const updateContact = async (id: string, status: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  const updateOrder = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl border border-surface-200 bg-white p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  tab === t.id
                    ? "bg-primary-600 text-white"
                    : "text-zinc-600 hover:bg-surface-50"
                )}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="btn-secondary py-2 text-xs"
          disabled={loading}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Atualizar
        </button>
      </div>

      {loading && !stats ? (
        <div className="flex h-40 items-center justify-center text-zinc-400">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : (
        <>
          {tab === "overview" && stats && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Usuários", value: stats.totalUsers, sub: `+${stats.newUsersToday} hoje` },
                  { label: "Contatos novos", value: stats.contactsNew, sub: `${stats.contactsTotal} total` },
                  { label: "Pagamentos pendentes", value: stats.ordersPending, sub: `${stats.ordersOverdue} em atraso` },
                  { label: "Ferramentas hoje", value: stats.usageToday, sub: `${stats.loginsToday} logins hoje` },
                  { label: "Créditos baixos", value: stats.lowCredits, sub: "≤ 2 créditos" },
                  { label: "Pagos", value: stats.ordersPaid, sub: "pedidos confirmados" },
                  { label: "Novos (7 dias)", value: stats.newUsersWeek, sub: "cadastros" },
                  { label: "Uso (7 dias)", value: stats.usageWeek, sub: "ferramentas" },
                ].map((card) => (
                  <div key={card.label} className="card-premium p-4">
                    <p className="text-xs text-zinc-500">{card.label}</p>
                    <p className="font-display mt-1 text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-zinc-400">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="card-premium p-5">
                <h3 className="font-display font-bold">Atividade recente</h3>
                <div className="mt-4 divide-y divide-surface-100">
                  {stats.recentActivity.map((ev) => (
                    <div key={ev.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">
                          {activityLabels[ev.type] ?? ev.type}
                          {ev.label ? ` · ${ev.label}` : ""}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {ev.user?.name ?? ev.user?.email ?? "Visitante"}
                          {ev.path ? ` · ${ev.path}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-zinc-400">
                        {formatDate(ev.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou curso..."
                  className="w-full rounded-xl border border-surface-200 py-2.5 pr-3 pl-9 text-sm outline-none focus:border-primary-400"
                />
              </div>

              <div className="overflow-x-auto rounded-2xl border border-surface-200 bg-white">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-surface-100 bg-surface-50 text-xs text-zinc-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Usuário</th>
                      <th className="px-4 py-3">Plano</th>
                      <th className="px-4 py-3">Créditos</th>
                      <th className="px-4 py-3">Uso</th>
                      <th className="px-4 py-3">Último login</th>
                      <th className="px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {u.role === "ADMIN" && (
                              <Shield size={14} className="text-primary-600" />
                            )}
                            <div>
                              <p className="font-medium">{u.name ?? "—"}</p>
                              <p className="text-xs text-zinc-500">{u.email}</p>
                              {u.course && (
                                <p className="text-xs text-zinc-400">{u.course}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{u.plan}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "font-bold",
                              u.credits <= 2 ? "text-red-600" : "text-primary-600"
                            )}
                          >
                            {u.credits}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">
                          {u._count.usageLogs} tools · {u._count.contactLeads} contatos
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">
                          {u.lastLoginAt ? formatDate(u.lastLoginAt) : "Nunca"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setEditUser(u)}
                            className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                          >
                            Gerenciar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "contacts" && (
            <div className="space-y-3">
              {contacts.length === 0 ? (
                <p className="text-sm text-zinc-400">Nenhum contato ainda.</p>
              ) : (
                contacts.map((c) => {
                  const contact = c as {
                    id: string;
                    name: string;
                    email: string;
                    phone: string;
                    course: string;
                    service: string;
                    message: string;
                    status: string;
                    createdAt: string;
                    user: { email: string } | null;
                  };
                  return (
                    <div key={contact.id} className="card-premium p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-display font-bold">{contact.name}</p>
                          <p className="text-sm text-zinc-500">
                            {contact.email} · {contact.phone}
                          </p>
                          <p className="mt-1 text-sm">
                            <span className="font-medium">{contact.service}</span> · {contact.course}
                          </p>
                          <p className="mt-2 text-sm text-zinc-600">{contact.message}</p>
                          <p className="mt-2 text-xs text-zinc-400">
                            {formatDate(contact.createdAt)}
                            {contact.user ? ` · conta: ${contact.user.email}` : " · sem login"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(["NEW", "CONTACTED", "CONVERTED", "CLOSED"] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateContact(contact.id, s)}
                              className={cn(
                                "rounded-lg px-2.5 py-1 text-xs font-medium",
                                contact.status === s
                                  ? "bg-primary-600 text-white"
                                  : "bg-surface-100 text-zinc-600 hover:bg-surface-200"
                              )}
                            >
                              {contactStatusLabels[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="rounded-xl border border-dashed border-surface-200 p-8 text-center text-sm text-zinc-400">
                  Nenhum pedido registrado. Crie manualmente quando alguém fechar consultoria ou plano.
                </p>
              ) : (
                orders.map((o) => {
                  const order = o as {
                    id: string;
                    description: string;
                    amountCents: number;
                    status: string;
                    createdAt: string;
                    user: { name: string | null; email: string };
                  };
                  return (
                    <div key={order.id} className="card-premium flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <p className="font-medium">{order.description}</p>
                        <p className="text-sm text-zinc-500">
                          {order.user.name ?? order.user.email} · R${" "}
                          {(order.amountCents / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-zinc-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(["PENDING", "PAID", "OVERDUE", "CANCELLED"] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateOrder(order.id, s)}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-xs font-medium",
                              order.status === s
                                ? s === "PAID"
                                  ? "bg-accent-600 text-white"
                                  : s === "OVERDUE"
                                    ? "bg-red-600 text-white"
                                    : "bg-primary-600 text-white"
                                : "bg-surface-100 text-zinc-600"
                            )}
                          >
                            {orderStatusLabels[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "activity" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card-premium p-5">
                <h3 className="font-display font-bold">Eventos</h3>
                <div className="mt-4 max-h-[480px] space-y-2 overflow-y-auto">
                  {activity.events.map((ev) => {
                    const e = ev as {
                      id: string;
                      type: string;
                      label: string | null;
                      path: string | null;
                      createdAt: string;
                      user: { email: string } | null;
                    };
                    return (
                      <div key={e.id} className="rounded-lg bg-surface-50 px-3 py-2 text-sm">
                        <p className="font-medium">
                          {activityLabels[e.type] ?? e.type}
                          {e.label ? ` · ${e.label}` : ""}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {e.user?.email ?? "Anônimo"} · {formatDate(e.createdAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="card-premium p-5">
                <h3 className="font-display font-bold">Uso de ferramentas</h3>
                <div className="mt-4 max-h-[480px] space-y-2 overflow-y-auto">
                  {activity.usage.map((u) => {
                    const log = u as {
                      id: string;
                      tool: string;
                      creditsUsed: number;
                      title: string | null;
                      createdAt: string;
                      user: { email: string };
                    };
                    return (
                      <div key={log.id} className="rounded-lg bg-surface-50 px-3 py-2 text-sm">
                        <p className="font-medium">{log.title ?? log.tool}</p>
                        <p className="text-xs text-zinc-500">
                          {log.user.email} · -{log.creditsUsed} cr · {formatDate(log.createdAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold">Gerenciar usuário</h3>
            <p className="mt-1 text-sm text-zinc-500">{editUser.email}</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium">Adicionar créditos</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={creditDelta}
                    onChange={(e) => setCreditDelta(e.target.value)}
                    className="flex-1 rounded-lg border border-surface-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      updateUser(editUser.id, {
                        creditsDelta: Number(creditDelta),
                      })
                    }
                    className="btn-primary py-2 text-xs"
                  >
                    + Créditos
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Definir créditos exatos</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={editUser.credits}
                    id="exact-credits"
                    className="flex-1 rounded-lg border border-surface-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      const el = document.getElementById("exact-credits") as HTMLInputElement;
                      updateUser(editUser.id, { credits: Number(el.value) });
                    }}
                    className="btn-secondary py-2 text-xs"
                  >
                    Definir
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Plano</label>
                <div className="flex gap-2">
                  {(["FREE", "STUDENT", "PRO"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      disabled={saving}
                      onClick={() => updateUser(editUser.id, { plan: p })}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium",
                        editUser.plan === p
                          ? "bg-primary-600 text-white"
                          : "bg-surface-100 text-zinc-600"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="btn-secondary py-2 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
