"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, XCircle } from "lucide-react";

export function BillingStatusBanner() {
  const searchParams = useSearchParams();
  const { update } = useSession();
  const success = searchParams.get("success") === "1";
  const canceled = searchParams.get("canceled") === "1";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!success) return;

    const confirm = async () => {
      if (sessionId) {
        await fetch("/api/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }).catch(() => {});
      }
      update();
    };

    confirm();
  }, [success, sessionId, update]);

  if (!success && !canceled) return null;

  if (success) {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold">Pagamento recebido!</p>
          <p className="mt-1 text-sm text-emerald-800">
            Sua assinatura está sendo ativada. Se os créditos não atualizarem em alguns segundos,
            atualize a página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <XCircle size={22} className="mt-0.5 shrink-0 text-amber-600" />
      <div>
        <p className="font-semibold">Pagamento cancelado</p>
        <p className="mt-1 text-sm text-amber-800">
          Nenhuma cobrança foi feita. Você pode tentar de novo quando quiser.
        </p>
      </div>
    </div>
  );
}
