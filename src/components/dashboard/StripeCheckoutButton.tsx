"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TrackPlanInterest } from "./TrackBilling";

type PlanId = "STUDENT" | "PRO";

interface StripeCheckoutButtonProps {
  plan: PlanId;
  label: string;
  className?: string;
}

export function StripeCheckoutButton({ plan, label, className }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    TrackPlanInterest(plan);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao iniciar pagamento");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("URL de pagamento não retornada");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="inline animate-spin" /> Redirecionando…
          </>
        ) : (
          label
        )}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function StripePortalButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao abrir portal");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("URL do portal não retornada");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading} className={className}>
        {loading ? (
          <>
            <Loader2 size={16} className="inline animate-spin" /> Abrindo…
          </>
        ) : (
          "Gerenciar assinatura"
        )}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
