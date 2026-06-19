import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { testimonials } from "@/lib/data";

export default function TestimonialsPreview() {
  const preview = testimonials.slice(0, 3);

  return (
    <section className="section-padding-sm border-t border-zinc-200/60 bg-white">
      <div className="container-custom">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="section-label">Depoimentos</span>
            <h2 className="section-title mt-2">Quem usa, recomenda</h2>
          </div>
          <Link
            href="/depoimentos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Ver todos
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {preview.map((item) => (
            <div key={item.id} className="card-premium flex flex-col p-5">
              <div className="mb-3 flex gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-zinc-600">
                &ldquo;{item.text}&rdquo;
              </p>
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
