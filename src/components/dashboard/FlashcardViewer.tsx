"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function FlashcardViewer({
  data,
}: {
  data: { cards: { front: string; back: string }[] };
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = data.cards ?? [];
  if (!cards.length) return null;

  const card = cards[index];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-zinc-500">
        <span>Cartão {index + 1} de {cards.length}</span>
        <button
          type="button"
          onClick={() => { setIndex(0); setFlipped(false); }}
          className="flex items-center gap-1 text-primary-600 hover:underline"
        >
          <RotateCcw size={14} /> Reiniciar
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white p-8 text-center transition-all hover:shadow-lg"
      >
        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-500">
          {flipped ? "Resposta" : "Pergunta"}
        </span>
        <p className="text-lg font-medium text-surface-900">
          {flipped ? card.back : card.front}
        </p>
        <span className="mt-4 text-xs text-zinc-400">Clique para virar</span>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => { setIndex(index - 1); setFlipped(false); }}
          className="flex items-center gap-1 rounded-lg border border-surface-200 px-4 py-2 text-sm disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <button
          type="button"
          disabled={index === cards.length - 1}
          onClick={() => { setIndex(index + 1); setFlipped(false); }}
          className="flex items-center gap-1 rounded-lg border border-surface-200 px-4 py-2 text-sm disabled:opacity-40"
        >
          Próximo <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
