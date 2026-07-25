"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gift,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useCart, lineKey } from "@/lib/cart-context";
import { useAdminData } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

type Step = "cart" | "packaging" | "delivery" | "summary" | "confirmation";

type DeliveryDetails = {
  name: string;
  phone: string;
  altPhone: string;
  email: string;
  recipientName: string;
  recipientPhone: string;
  deliveryMethod: "Delivery" | "Pickup";
  deliveryLocation: string;
  preferredDate: string;
  deliveryFeePayer: "customer" | "recipient";
  additionalInfo: string;
};

const EMPTY_DELIVERY: DeliveryDetails = {
  name: "",
  phone: "",
  altPhone: "",
  email: "",
  recipientName: "",
  recipientPhone: "",
  deliveryMethod: "Delivery",
  deliveryLocation: "",
  preferredDate: "",
  deliveryFeePayer: "customer",
  additionalInfo: "",
};

// Shown on both Delivery Details and Order Summary so the packaging choice made
// back in Step 2 stays visible instead of silently carrying through the rest of
// the wizard — previously the only place it showed was a line of plain text
// buried in the Step 4 summary.
function PackagingBadge({ requested }: { requested: boolean | null }) {
  if (requested === null) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        requested ? "bg-amber-500/15 text-amber-700" : "bg-ink-900/5 text-ink-700/70"
      }`}
    >
      <Gift className="h-3.5 w-3.5" />
      {requested ? "Gift packaging requested" : "No gift packaging"}
    </span>
  );
}

export default function CartPage() {
  const { lines, updateQuantity, removeLine, itemCount, subtotal, clearCart } = useCart();
  const { addOrder, settings } = useAdminData();

  const [step, setStep] = useState<Step>("cart");
  const [packagingRequested, setPackagingRequested] = useState<boolean | null>(null);
  const [delivery, setDelivery] = useState<DeliveryDetails>(EMPTY_DELIVERY);
  const [payEmail, setPayEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const buildOrderInput = () => ({
    customerName: delivery.name,
    phone: delivery.phone,
    altPhone: delivery.altPhone || undefined,
    email: delivery.email || undefined,
    address: delivery.deliveryMethod === "Delivery" ? delivery.deliveryLocation : "Pickup",
    lines,
    subtotal,
    recipientName: delivery.recipientName,
    recipientPhone: delivery.recipientPhone,
    deliveryMethod: delivery.deliveryMethod,
    deliveryLocation:
      delivery.deliveryMethod === "Delivery" ? delivery.deliveryLocation : undefined,
    preferredDate: delivery.preferredDate,
    deliveryFeePayer: delivery.deliveryFeePayer,
    additionalInfo: delivery.additionalInfo || undefined,
  });

  const notifyOrderCreated = (order: { id: string; customerName: string; phone: string; email?: string; subtotal: number; lines: typeof lines }) => {
    fetch("/api/notifications/order-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        subtotal: order.subtotal,
        lines: order.lines,
        smsSenderId: settings.smsSenderId,
        emailFromAddress: settings.emailFromAddress,
        storeEmail: settings.storeEmail,
        storeName: settings.storeName,
        theme: settings.theme,
      }),
    }).catch(() => {
      // Best-effort — checkout already succeeded regardless of notification delivery.
    });
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    setPayError(null);
    try {
      const order = await addOrder({ ...buildOrderInput(), packagingRequested: true });
      clearCart();
      setReviewOrderId(order.id);
      setStep("confirmation");
      notifyOrderCreated(order);
    } catch (err) {
      console.error("[checkout] submit for review failed", err);
      setPayError("Something went wrong submitting your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (channel: "mobile_money" | "bank_transfer") => {
    setPayError(null);
    const email = delivery.email || payEmail;
    if (!email) {
      setPayError("Please enter an email address to receive your payment receipt.");
      return;
    }
    setSubmitting(true);
    try {
      let orderId = payingOrderId;
      if (!orderId) {
        const order = await addOrder({
          ...buildOrderInput(),
          email,
          packagingRequested: false,
        });
        orderId = order.id;
        setPayingOrderId(orderId);
        notifyOrderCreated(order);
      }

      const res = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, channel, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error ?? "Could not start payment. Please try again.");
      }
      clearCart();
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("[checkout] payment failed", err);
      setPayError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Step: confirmation (packaging-review path only — the pay-now path redirects
  // away to Paystack instead, and lands back on /order/[id]/complete). ---
  if (step === "confirmation" && reviewOrderId) {
    return (
      <div>
        <PageHero eyebrow="Order Placed" title="Thank You!" />
        <section className="mx-auto max-w-lg px-6 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-800/10 text-forest-800">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-ink-900">
            We&apos;ve received your order
          </h2>
          <p className="mt-2 text-ink-700/70">
            Our team is reviewing your packaging request and will confirm the final total
            shortly — we&apos;ll message you with the total and a link to complete payment.
          </p>
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
              Your tracking number
            </p>
            <p className="mt-1 font-display text-xl font-bold tracking-wide text-ink-900">
              {reviewOrderId}
            </p>
            <p className="mt-1 text-xs text-ink-700/60">
              Save this — you&apos;ll need it to track your order.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/track?order=${reviewOrderId}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 font-semibold text-ink-900 transition-colors hover:border-amber-500 hover:text-amber-600"
            >
              Track Your Order
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // --- Step: cart review ---
  if (step === "cart") {
    if (lines.length === 0) {
      return (
        <div>
          <PageHero eyebrow="Your Cart" title="0 items" />
          <section className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-ink-700/40">
                <ShoppingBag className="h-8 w-8" strokeWidth={1.5} />
              </span>
              <h2 className="font-display text-2xl font-semibold text-ink-900">
                Your cart is empty
              </h2>
              <p className="text-ink-700/70">Looks like you haven&apos;t added anything yet.</p>
              <Link
                href="/shop"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div>
        <PageHero eyebrow="Your Cart" title={`${itemCount} item${itemCount === 1 ? "" : "s"}`} />
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-cream-200">
              {lines.map((line) => {
                const key = lineKey(line);
                return (
                  <li key={key} className="flex flex-wrap items-center gap-4 py-5">
                    <div className="flex-1">
                      <p className="font-display font-semibold text-ink-900">{line.name}</p>
                      <p className="text-sm text-ink-700/70">
                        {line.color} · {line.size} · {formatPrice(line.price)} per {line.unit}
                      </p>
                      {line.giftMessage && (
                        <p className="mt-1 text-xs italic text-ink-700/60">
                          Card message: &ldquo;{line.giftMessage}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center rounded-full border border-cream-200">
                      <button
                        onClick={() => updateQuantity(key, line.quantity - 1)}
                        className="p-2 text-ink-800 hover:text-amber-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(key, line.quantity + 1)}
                        className="p-2 text-ink-800 hover:text-amber-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="w-24 text-right font-display font-semibold text-ink-900">
                      {formatPrice(line.price * line.quantity)}
                    </p>
                    <button
                      onClick={() => removeLine(key)}
                      aria-label="Remove item"
                      className="text-ink-700/50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-2xl border border-cream-200 bg-cream-50 p-6">
              <h2 className="font-display text-lg font-semibold text-ink-900">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm text-ink-700/80">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-ink-700/80">
                <span>Delivery</span>
                <span>Confirmed at delivery</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-cream-200 pt-4 font-display text-lg font-bold text-ink-900">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <button
                onClick={() => setStep("packaging")}
                className="mt-6 w-full rounded-full bg-amber-500 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Checkout
              </button>

              <Link
                href="/shop"
                className="mt-3 block text-center text-sm font-semibold text-ink-800 hover:text-amber-600"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  // --- Step: gift packaging ---
  if (step === "packaging") {
    return (
      <div>
        <PageHero eyebrow="Step 2 of 4" title="Gift Packaging" />
        <section className="mx-auto max-w-lg px-6 py-16">
          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-6">
            <p className="font-semibold text-ink-900">
              Would you like your order professionally gift packaged at a charge?
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setPackagingRequested(false)}
                className={`flex-1 rounded-full py-3 font-semibold transition-colors ${
                  packagingRequested === false
                    ? "bg-amber-500 text-white"
                    : "bg-white text-ink-800 hover:bg-cream-200"
                }`}
              >
                No
              </button>
              <button
                onClick={() => setPackagingRequested(true)}
                className={`flex-1 rounded-full py-3 font-semibold transition-colors ${
                  packagingRequested === true
                    ? "bg-amber-500 text-white"
                    : "bg-white text-ink-800 hover:bg-cream-200"
                }`}
              >
                Yes
              </button>
            </div>
            <p className="mt-4 text-xs text-ink-700/60">
              Packaging costs vary depending on the selected items and packaging
              requirements. The final amount will be confirmed before payment.
            </p>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep("cart")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-800 hover:text-amber-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              disabled={packagingRequested === null}
              onClick={() => setStep("delivery")}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-40"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // --- Step: delivery details ---
  if (step === "delivery") {
    return (
      <div>
        <PageHero eyebrow="Step 3 of 4" title="Delivery Details" />
        <section className="mx-auto max-w-lg px-6 pt-10">
          <div className="flex items-center justify-between gap-3">
            <PackagingBadge requested={packagingRequested} />
            <button
              type="button"
              onClick={() => setStep("packaging")}
              className="text-xs font-semibold text-ink-700/60 hover:text-amber-600"
            >
              Change
            </button>
          </div>
        </section>
        <section className="mx-auto max-w-lg px-6 pb-16 pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep("summary");
            }}
            className="space-y-4"
          >
            <input
              required
              placeholder="Your full name"
              value={delivery.name}
              onChange={(e) => setDelivery((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            />
            <div className="flex gap-3">
              <input
                required
                type="tel"
                placeholder="Your phone number"
                value={delivery.phone}
                onChange={(e) => setDelivery((d) => ({ ...d, phone: e.target.value }))}
                className="w-1/2 rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              />
              <input
                type="tel"
                placeholder="Alt. phone (optional)"
                value={delivery.altPhone}
                onChange={(e) => setDelivery((d) => ({ ...d, altPhone: e.target.value }))}
                className="w-1/2 rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              />
            </div>
            <input
              type="email"
              placeholder="Email (optional — for your receipt)"
              value={delivery.email}
              onChange={(e) => setDelivery((d) => ({ ...d, email: e.target.value }))}
              className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            />

            <div className="border-t border-cream-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
                Recipient
              </p>
              <div className="mt-3 space-y-3">
                <input
                  required
                  placeholder="Recipient's full name"
                  value={delivery.recipientName}
                  onChange={(e) => setDelivery((d) => ({ ...d, recipientName: e.target.value }))}
                  className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                />
                <input
                  required
                  type="tel"
                  placeholder="Recipient's phone number"
                  value={delivery.recipientPhone}
                  onChange={(e) => setDelivery((d) => ({ ...d, recipientPhone: e.target.value }))}
                  className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                />
              </div>
            </div>

            <div className="border-t border-cream-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
                Delivery or Pickup
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDelivery((d) => ({ ...d, deliveryMethod: "Delivery" }))}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                    delivery.deliveryMethod === "Delivery"
                      ? "bg-amber-500 text-white"
                      : "bg-cream-100 text-ink-800 hover:bg-cream-200"
                  }`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDelivery((d) => ({ ...d, deliveryMethod: "Pickup" }))}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                    delivery.deliveryMethod === "Pickup"
                      ? "bg-amber-500 text-white"
                      : "bg-cream-100 text-ink-800 hover:bg-cream-200"
                  }`}
                >
                  Pickup
                </button>
              </div>
              {delivery.deliveryMethod === "Delivery" && (
                <textarea
                  required
                  rows={2}
                  placeholder="Delivery location"
                  value={delivery.deliveryLocation}
                  onChange={(e) => setDelivery((d) => ({ ...d, deliveryLocation: e.target.value }))}
                  className="mt-3 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                />
              )}
              <input
                required
                type="date"
                min={todayStr}
                value={delivery.preferredDate}
                onChange={(e) => setDelivery((d) => ({ ...d, preferredDate: e.target.value }))}
                className="mt-3 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-ink-800 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              />
            </div>

            <div className="border-t border-cream-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
                Delivery Fee
              </p>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm text-ink-800">
                  <input
                    type="radio"
                    name="deliveryFeePayer"
                    checked={delivery.deliveryFeePayer === "customer"}
                    onChange={() => setDelivery((d) => ({ ...d, deliveryFeePayer: "customer" }))}
                  />
                  I&apos;ll pay the delivery fee myself
                </label>
                <label className="flex items-center gap-2 text-sm text-ink-800">
                  <input
                    type="radio"
                    name="deliveryFeePayer"
                    checked={delivery.deliveryFeePayer === "recipient"}
                    onChange={() => setDelivery((d) => ({ ...d, deliveryFeePayer: "recipient" }))}
                  />
                  Recipient will pay the delivery fee
                </label>
              </div>
              <p className="mt-2 text-xs text-ink-700/50">
                Our team will communicate the delivery fee with the customer or recipient on
                the delivery date.
              </p>
            </div>

            <textarea
              rows={2}
              placeholder="Any additional information? (optional)"
              value={delivery.additionalInfo}
              onChange={(e) => setDelivery((d) => ({ ...d, additionalInfo: e.target.value }))}
              className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            />

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep("packaging")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-800 hover:text-amber-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  // --- Step: order summary + submit/pay ---
  const needsPayEmail = !delivery.email;

  return (
    <div>
      <PageHero eyebrow="Step 4 of 4" title="Order Summary" />
      <section className="mx-auto max-w-lg px-6 pt-10">
        <div className="flex items-center justify-between gap-3">
          <PackagingBadge requested={packagingRequested} />
          <button
            type="button"
            onClick={() => setStep("packaging")}
            className="text-xs font-semibold text-ink-700/60 hover:text-amber-600"
          >
            Change
          </button>
        </div>
      </section>
      <section className="mx-auto max-w-lg px-6 pb-16 pt-6">
        <div className="rounded-2xl border border-cream-200 bg-cream-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">
            Products
          </p>
          <ul className="mt-2 space-y-1.5">
            {lines.map((line, i) => (
              <li key={i} className="flex justify-between text-sm text-ink-800">
                <span>
                  {line.name} × {line.quantity}
                </span>
                <span>{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-cream-200 pt-3 font-semibold text-ink-900">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-700/60">
            Packaging
          </p>
          <p className="mt-1 text-sm text-ink-800">
            {packagingRequested
              ? "Requested — final packaging cost will be confirmed before payment."
              : "Not requested."}
          </p>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-700/60">
            Delivery
          </p>
          <p className="mt-1 text-sm text-ink-800">
            {delivery.deliveryMethod === "Delivery"
              ? `Deliver to ${delivery.recipientName} — ${delivery.deliveryLocation}`
              : `Pickup for ${delivery.recipientName}`}
          </p>
          <p className="text-sm text-ink-700/70">Preferred date: {delivery.preferredDate}</p>
          {delivery.deliveryMethod === "Delivery" && (
            <p className="text-sm text-ink-700/70">
              Delivery fee paid by:{" "}
              {delivery.deliveryFeePayer === "customer" ? "You" : "Recipient"}
            </p>
          )}

          {delivery.additionalInfo && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-700/60">
                Additional Notes
              </p>
              <p className="mt-1 text-sm italic text-ink-700/80">
                &ldquo;{delivery.additionalInfo}&rdquo;
              </p>
            </>
          )}
        </div>

        {payError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{payError}</p>
        )}

        {packagingRequested ? (
          <button
            onClick={handleSubmitForReview}
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Submitting…" : "Submit for Review"}
          </button>
        ) : (
          <div className="mt-6 space-y-3">
            {needsPayEmail && (
              <input
                required
                type="email"
                placeholder="Email (required for your payment receipt)"
                value={payEmail}
                onChange={(e) => setPayEmail(e.target.value)}
                className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
              />
            )}
            <button
              onClick={() => handlePay("mobile_money")}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Pay with Mobile Money
            </button>
            <button
              onClick={() => handlePay("bank_transfer")}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-amber-500 py-3 font-semibold text-amber-600 transition-colors hover:bg-amber-500/10 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Pay with Bank Transfer
            </button>
          </div>
        )}

        <button
          onClick={() => setStep("delivery")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-800 hover:text-amber-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </section>
    </div>
  );
}
