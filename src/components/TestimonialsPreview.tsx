import { ArrowRight, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { testimonials } from "@/lib/data";

export default function TestimonialsPreview() {
  const preview = testimonials.filter((t) => !t.featured).slice(0, 3);

  return (
    <section className="section-padding-sm border-t border-zinc-200/60 bg-white">
      <div className="container-custom">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="section-label">Depoimentos</span>
            <h2 className="section-title mt-2 text-2xl sm:text-3xl">Quem usou, conta como foi</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Situação real, serviço usado e resultado — não só elogio genérico.
            </p>
          </div>
          <Link
            href="/depoimentos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Ver todas as histórias
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {preview.map((item) => (
            <div key={item.id} className="card-premium flex flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                  {item.service}
                </span>
              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
                {item.situation}
              </p>

              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-700">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent-50/60 px-3 py-2">
                <Trophy size={14} className="mt-0.5 shrink-0 text-accent-600" />
                <p className="text-xs font-semibold text-surface-900">{item.outcome}</p>
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-bold text-white">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    {item.course} · {item.university}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
