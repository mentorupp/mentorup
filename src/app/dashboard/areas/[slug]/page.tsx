"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAreaBySlug } from "@/lib/tools-config";

export default function AreaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const area = getAreaBySlug(slug);

  const [selectedTool, setSelectedTool] = useState(area?.tools[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { update } = useSession();
  const router = useRouter();

  if (!area) {
    return <p className="text-red-600">Área não encontrada.</p>;
  }

  const tool = area.tools.find((t) => t.id === selectedTool);
  const Icon = area.icon;

  const handleSubmit = async () => {
    if (!tool || input.length < 10) {
      setError("Digite pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tools/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaSlug: area.slug,
          toolId: selectedTool,
          input,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) router.push("/dashboard/billing");
        throw new Error(data.error);
      }

      setResult(data.result);
      await update({ credits: data.creditsRemaining });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${area.color} text-white`}>
          <Icon size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold">{area.name}</h1>
          <p className="text-sm text-zinc-500">{area.tools.length} ferramentas especializadas</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {area.tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setSelectedTool(t.id); setResult(""); }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              selectedTool === t.id
                ? "bg-primary-600 text-white"
                : "border border-surface-200 bg-white text-zinc-600 hover:border-primary-200"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {tool && (
        <p className="mb-4 text-sm text-zinc-500">{tool.description} · {tool.credits} créditos</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-200 bg-white p-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Descreva ou cole o conteúdo para ${tool?.name ?? "ferramenta"}...`}
            rows={14}
            className="w-full resize-none rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Processando..." : "Gerar"}
          </button>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-white p-6">
          <h2 className="font-display mb-4 font-bold">Resultado</h2>
          {result ? (
            <div className="prose prose-sm max-h-[500px] max-w-none overflow-y-auto">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Resultado aparecerá aqui.</p>
          )}
        </div>
      </div>
    </div>
  );
}
