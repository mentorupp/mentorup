"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import MentorUpLogo from "@/components/MentorUpLogo";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const configError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        result.error === "Configuration"
          ? "Erro de configuração do servidor. Verifique AUTH_SECRET na Vercel."
          : "E-mail ou senha incorretos."
      );
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-12 text-white lg:flex">
        <MentorUpLogo href="/" variant="white" size="lg" />
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            Sua plataforma acadêmica com IA
          </h1>
          <p className="mt-4 max-w-md text-primary-100">
            Mapas mentais, questões de PDF, flashcards, referências ABNT e muito mais.
          </p>
        </div>
        <p className="text-sm text-primary-200">15 créditos grátis ao criar conta</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <MentorUpLogo href="/" size="md" />
          </div>

          <h2 className="font-display text-2xl font-extrabold">Entrar</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Não tem conta?{" "}
            <Link href="/register" className="font-semibold text-primary-600 hover:underline">
              Cadastre-se grátis
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {configError && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Erro de autenticação ({configError}). Confirme AUTH_SECRET e NEXTAUTH_URL na Vercel.
              </p>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
