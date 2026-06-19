"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { areas } from "@/lib/tools-config";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [course, setCourse] = useState(session?.user?.course ?? "");
  const [area, setArea] = useState(session?.user?.area ?? "");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, course, area, university }),
      });

      if (res.ok) {
        await update({ name, course, area });
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Configurações</h1>
      <p className="mt-1 text-zinc-600">Personalize seu perfil acadêmico.</p>

      <div className="mt-8 max-w-lg space-y-5 rounded-2xl border border-surface-200 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nome completo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">E-mail</label>
          <input
            value={session?.user?.email ?? ""}
            disabled
            className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-zinc-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Curso</label>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Ex: Engenharia Civil"
            className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Universidade</label>
          <input
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="Ex: USP, UFMG, UNICAMP..."
            className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Área do conhecimento</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            <option value="">Selecione sua área</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : null}
          {saved ? "Salvo!" : "Salvar alterações"}
        </button>
      </div>

      <div className="mt-8 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        <strong>Uso ético de IA:</strong> A MentorUp é uma ferramenta de apoio ao estudo.
        Declare o uso de IA na metodologia do seu trabalho conforme ABNT NBR 6023:2025.
        A autoria e revisão final são sempre sua responsabilidade.
      </div>
    </div>
  );
}
