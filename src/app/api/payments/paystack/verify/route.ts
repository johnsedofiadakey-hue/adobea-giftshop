import { NextResponse } from "next/server";
import { markOrderPaidIfNeeded, paystackVerify } from "@/lib/paystack-server";

/**
 * Called from the /order/[id]/complete redirect-return page for immediate UI
 * feedback. Safe to call more than once — markOrderPaidIfNeeded is idempotent,
 * and the webhook (source of truth) may also fire independently.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const reference =
    typeof body?.reference === "string" ? body.reference.trim().toUpperCase() : "";
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  try {
    const data = await paystackVerify(reference);
    if (data.status !== "success") {
      return NextResponse.json({ paid: false, status: data.status });
    }
    await markOrderPaidIfNeeded(reference, data.channel);
    return NextResponse.json({ paid: true });
  } catch (err) {
    console.error("[paystack] verify failed", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
  }
}
