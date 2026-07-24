"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-ink-700/60">Loading…</div>}>
      <OrderCompleteInner />
    </Suspense>
  );
}

function OrderCompleteInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"checking" | "paid" | "failed">("checking");

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref") || id;
    fetch("/api/payments/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((res) => res.json())
      .then((data) => setState(data.paid ? "paid" : "failed"))
      .catch(() => setState("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHero eyebrow="Payment" title="Order Confirmation" />
      <section className="mx-auto max-w-lg px-6 py-16 text-center">
        {state === "checking" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-amber-500" />
            <p className="mt-4 text-ink-700/70">Confirming your payment…</p>
          </>
        )}
        {state === "paid" && (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-800/10 text-forest-800">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink-900">
              Payment received!
            </h2>
            <p className="mt-2 text-ink-700/70">
              Your order is confirmed and being processed — we&apos;ll keep you updated every
              step of the way.
            </p>
          </>
        )}
        {state === "failed" && (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <XCircle className="h-8 w-8" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink-900">
              We couldn&apos;t confirm payment
            </h2>
            <p className="mt-2 text-ink-700/70">
              If you were charged, contact us with your order number below and we&apos;ll sort
              it out.
            </p>
          </>
        )}

        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
            Order number
          </p>
          <p className="mt-1 font-display text-xl font-bold tracking-wide text-ink-900">{id}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/track?order=${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 font-semibold text-ink-900 transition-colors hover:border-amber-500 hover:text-amber-600"
          >
            Track Your Order
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
