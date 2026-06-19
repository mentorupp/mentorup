import Link from "next/link";
import { areas } from "@/lib/tools-config";

export default function AreasPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Ferramentas por Área</h1>
      <p className="mt-1 text-zinc-600">
        Selecione sua área do conhecimento para ferramentas especializadas.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {areas.map((area) => {
          const Icon = area.icon;
          return (
            <Link
              key={area.slug}
              href={`/dashboard/areas/${area.slug}`}
              className="group rounded-2xl border border-surface-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${area.color} text-white shadow-lg`}>
                <Icon size={24} />
              </div>
              <h2 className="font-display text-xl font-bold">{area.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {area.tools.length} ferramentas especializadas
              </p>
              <ul className="mt-3 space-y-1">
                {area.tools.slice(0, 3).map((t) => (
                  <li key={t.id} className="text-xs text-zinc-400">• {t.name}</li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
