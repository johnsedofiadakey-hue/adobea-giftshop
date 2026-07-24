"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { formatPrice } from "@/lib/utils";

type PaymentInfo = {
  id: string;
  total: number;
  status: string;
  paymentStatus: "unpaid" | "paid";
};

export default function PayOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders/payment-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Order not found.");
        setInfo(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Order not found."));
  }, [orderId]);

  const handlePay = async (channel: "mobile_money" | "bank_transfer") => {
    if (!email) {
      setPayError("Please enter an email address for your payment receipt.");
      return;
    }
    setPayError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, channel, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error ?? "Could not start payment.");
      }
      window.location.href = data.authorization_url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero eyebrow="Complete Payment" title={`Order ${orderId}`} />
      <section className="mx-auto max-w-lg px-6 py-16">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {!error && !info && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        )}

        {info && info.paymentStatus === "paid" && (
          <div className="rounded-2xl border border-forest-700/20 bg-forest-700/5 p-6 text-center">
            <p className="font-semibold text-ink-900">This order is already paid. Thank you!</p>
          </div>
        )}

        {info && info.paymentStatus === "unpaid" && (
          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
              Final Total
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-ink-900">
              {formatPrice(info.total)}
            </p>

            <div className="mt-6 space-y-3">
              <input
                required
                type="email"
                placeholder="Email (required for your payment receipt)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              />
              {payError && <p className="text-sm text-red-700">{payError}</p>}
              <button
                onClick={() => handlePay("mobile_money")}
                disabled={submitting}
                className="w-full rounded-full bg-amber-500 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
              >
                Pay with Mobile Money
              </button>
              <button
                onClick={() => handlePay("bank_transfer")}
                disabled={submitting}
                className="w-full rounded-full border border-amber-500 py-3 font-semibold text-amber-600 transition-colors hover:bg-amber-500/10 disabled:opacity-60"
              >
                Pay with Bank Transfer
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
