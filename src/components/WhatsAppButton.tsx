"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { contactInfo } from "@/lib/data";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      {showTooltip && (
        <div className="relative rounded-2xl border border-surface-200 bg-white px-4 py-3 shadow-xl">
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface-200 text-surface-600 transition-colors hover:bg-surface-300"
            aria-label="Fechar dica"
          >
            <X size={12} />
          </button>
          <p className="text-sm font-medium text-surface-900">
            Precisa de ajuda? Fale conosco!
          </p>
          <p className="text-xs text-zinc-500">Respondemos em minutos</p>
        </div>
      )}

      <a
        href={`https://wa.me/${contactInfo.whatsapp}?text=Olá! Gostaria de solicitar um orçamento na MentorUp.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contato via WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/30 transition-all hover:scale-110 hover:shadow-xl"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
