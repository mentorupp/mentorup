"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { areas } from "@/lib/tools-config";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    area: "",
    university: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao criar conta");
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary-600 to-accent-500 p-12 text-white lg:flex">
        <Link href="/" className="font-display text-2xl font-bold">MentorUp</Link>
        <div>
          <h1 className="font-display text-4xl font-extrabold">Comece grátis</h1>
          <p className="mt-4 max-w-md text-primary-100">
            15 créditos mensais, referências ABNT ilimitadas e acesso a todas as ferramentas essenciais.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="font-display text-2xl font-extrabold">Criar conta</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:underline">Entrar</Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {[
              { key: "name", label: "Nome completo", type: "text", required: true },
              { key: "email", label: "E-mail", type: "email", required: true },
              { key: "password", label: "Senha (mín. 6 caracteres)", type: "password", required: true },
              { key: "course", label: "Curso", type: "text", required: false },
              { key: "university", label: "Universidade", type: "text", required: false },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium">{field.label}</label>
                <input
                  type={field.type}
                  required={field.required}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-medium">Área do conhecimento</label>
              <select
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400"
              >
                <option value="">Selecione (opcional)</option>
                {areas.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Criar conta grátis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
