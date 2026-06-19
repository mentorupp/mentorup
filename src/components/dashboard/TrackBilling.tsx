"use client";

import { useEffect } from "react";

export function TrackBillingView() {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "BILLING_VIEW", path: "/dashboard/billing" }),
    }).catch(() => {});
  }, []);
  return null;
}

export function TrackPlanInterest(plan: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "PLAN_INTEREST", label: plan, path: "/dashboard/billing" }),
  }).catch(() => {});
}
