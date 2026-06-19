"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useState } from "react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="depoimentos" className="section-padding bg-surface-50">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase">
            Depoimentos
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            O que nossos{" "}
            <span className="text-gradient">alunos dizem</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Histórias reais de estudantes que conquistaram suas metas com a
            MentorUp.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white p-8 shadow-xl shadow-primary-500/5 sm:p-10">
            <Quote
              size={40}
              className="text-primary-200"
              fill="currentColor"
            />

            <p className="mt-6 text-lg leading-relaxed text-zinc-700 sm:text-xl">
              &ldquo;{testimonials[active].text}&rdquo;
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-lg font-bold text-white">
                  {testimonials[active].avatar}
                </div>
                <div>
                  <p className="font-display font-bold text-surface-900">
                    {testimonials[active].name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {testimonials[active].course} — {testimonials[active].university}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
                    {testimonials[active].service}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-800 transition-colors hover:border-primary-200 hover:bg-primary-50"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active
                      ? "w-8 bg-primary-600"
                      : "w-2 bg-surface-200 hover:bg-primary-300"
                  }`}
                  aria-label={`Ir para depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-800 transition-colors hover:border-primary-200 hover:bg-primary-50"
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-500">{t.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
