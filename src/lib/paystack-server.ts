import { getAdminDb } from "@/lib/firebase-admin";

/**
 * Server-only. Real secret key lives in PAYSTACK_SECRET_KEY (env var / deployment
 * secret) — never in Firestore settings, same reason ARKESEL_API_KEY/BREVO_API_KEY
 * are kept out of the public-read `settings` doc.
 */
const PAYSTACK_BASE = "https://api.paystack.co";

export function getPaystackSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return key;
}

export async function paystackInitialize(opts: {
  email: string;
  amountPesewas: number;
  reference: string;
  channel: "mobile_money" | "bank_transfer";
  callbackUrl: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      amount: opts.amountPesewas,
      currency: "GHS",
      reference: opts.reference,
      channels: [opts.channel],
      callback_url: opts.callbackUrl,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack initialize failed");
  }
  return data.data as { authorization_url: string; access_code: string; reference: string };
}

export async function paystackVerify(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${getPaystackSecretKey()}` } }
  );
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack verify failed");
  }
  return data.data as { status: string; reference: string; channel: string; amount: number };
}

/**
 * Marks an order paid + advances its status, idempotently. Safe to call from both
 * the webhook (source of truth) and the redirect-return verify page — whichever
 * fires first wins, the other becomes a no-op via the `alreadyPaid` check.
 */
export async function markOrderPaidIfNeeded(reference: string, channel: string) {
  const db = getAdminDb();
  const ref = db.collection("orders").doc(reference);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false as const, reason: "order-not-found" };

  const order = snap.data()!;
  if (order.paymentStatus === "paid") {
    return { ok: true as const, alreadyPaid: true };
  }

  await ref.update({
    paymentStatus: "paid",
    paymentMethod: channel === "mobile_money" ? "mobile_money" : "bank_transfer",
    paymentReference: reference,
    paidAt: new Date().toISOString(),
    status: "Processing",
  });
  return { ok: true as const, alreadyPaid: false };
}
