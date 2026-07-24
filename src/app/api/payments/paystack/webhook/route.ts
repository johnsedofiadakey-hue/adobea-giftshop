import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getPaystackSecretKey, markOrderPaidIfNeeded } from "@/lib/paystack-server";

/**
 * Source of truth for payment confirmation — set this URL as the webhook in the
 * Paystack dashboard. The redirect-return page (/order/[id]/complete) also calls
 * verify() for immediate UI feedback, but this webhook is what's trusted even if
 * the customer closes the tab before the redirect completes.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  let secretKey: string;
  try {
    secretKey = getPaystackSecretKey();
  } catch {
    // No secret configured yet (e.g. still in local dev before it's set) — nothing to verify against.
    return NextResponse.json({ ok: true });
  }

  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const validSignature =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    const channel = event.data?.channel;
    if (reference) {
      await markOrderPaidIfNeeded(reference, channel).catch((err) => {
        console.error("[paystack] webhook failed to update order", err);
      });
    }
  }

  // Paystack expects a fast 200 regardless, or it will keep retrying the webhook.
  return NextResponse.json({ ok: true });
}
