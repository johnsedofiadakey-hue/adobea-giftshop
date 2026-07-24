import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { paystackInitialize } from "@/lib/paystack-server";
import { SITE_URL } from "@/lib/site";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderId = typeof body?.orderId === "string" ? body.orderId.trim().toUpperCase() : "";
  const channel =
    body?.channel === "bank_transfer"
      ? ("bank_transfer" as const)
      : body?.channel === "mobile_money"
        ? ("mobile_money" as const)
        : null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!orderId || !channel || !email) {
    return NextResponse.json({ error: "Missing orderId, channel, or email." }, { status: 400 });
  }

  const snap = await getAdminDb().collection("orders").doc(orderId).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  const order = snap.data()!;
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ error: "This order is already paid." }, { status: 400 });
  }

  try {
    const data = await paystackInitialize({
      email,
      amountPesewas: Math.round(order.total * 100),
      reference: orderId,
      channel,
      callbackUrl: `${SITE_URL}/order/${orderId}/complete`,
    });
    return NextResponse.json({ authorization_url: data.authorization_url });
  } catch (err) {
    console.error("[paystack] initialize failed", err);
    return NextResponse.json(
      { error: "Could not start payment right now. Please try again shortly." },
      { status: 502 }
    );
  }
}
