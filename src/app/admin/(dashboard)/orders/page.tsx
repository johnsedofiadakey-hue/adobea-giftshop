"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, Send, ShoppingBag } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageLoading } from "@/components/PageLoading";
import { useAdminData, type OrderStatus } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

const STATUSES: OrderStatus[] = [
  "Pending Review",
  "Awaiting Payment",
  "Processing",
  "Ready for Delivery",
  "Delivered",
  "Cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  "Pending Review": "🟡 Pending Review",
  "Awaiting Payment": "🟠 Awaiting Payment",
  Processing: "🔵 Processing",
  "Ready for Delivery": "🟢 Ready for Delivery",
  Delivered: "✅ Delivered",
  Cancelled: "❌ Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  "Pending Review": "bg-amber-500/15 text-amber-700",
  "Awaiting Payment": "bg-sunset-500/15 text-sunset-600",
  Processing: "bg-blue-500/10 text-blue-700",
  "Ready for Delivery": "bg-forest-600/10 text-forest-700",
  Delivered: "bg-forest-800/10 text-forest-800",
  Cancelled: "bg-red-500/10 text-red-700",
};

function PackagingQuoteForm({
  orderId,
  onSend,
}: {
  orderId: string;
  onSend: (cost: number) => Promise<void>;
}) {
  const [cost, setCost] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const parsed = Number(cost);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    setSending(true);
    try {
      await onSend(parsed);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700/70">
        Packaging cost (GH₵)
      </label>
      <input
        type="number"
        min={0}
        step="0.01"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="0.00"
        className="w-28 rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
      />
      <button
        onClick={handleSend}
        disabled={sending || cost === ""}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
      >
        <Send className="h-3.5 w-3.5" />
        {sending ? "Sending…" : "Send Quote"}
      </button>
      <p className="w-full text-xs text-ink-700/50">
        Order {orderId}: sets the final total and emails/texts the customer a payment link.
      </p>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { orders, loading, updateOrderStatus, setPackagingQuote, settings } = useAdminData();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return <PageLoading />;
  }

  const handleSendQuote = async (orderId: string, packagingCost: number) => {
    await setPackagingQuote(orderId, packagingCost);

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const total = order.subtotal + packagingCost;

    fetch("/api/notifications/order-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        subtotal: total,
        lines: order.lines,
        smsSenderId: settings.smsSenderId,
        emailFromAddress: settings.emailFromAddress,
        storeEmail: settings.storeEmail,
        storeName: settings.storeName,
        theme: settings.theme,
      }),
    }).catch(() => {
      // Best-effort — the quote is already saved regardless of notification delivery.
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description={`${orders.length} order${orders.length === 1 ? "" : "s"}`}
      />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-900/15 bg-cream-50 p-10 text-center text-sm text-ink-700/60">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5 text-ink-700/40">
            <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <p>No orders yet. Orders placed at checkout on the storefront will show up here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-cream-50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/8 text-xs uppercase tracking-wide text-ink-700/50">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {orders.map((order) => {
                const isOpen = expanded === order.id;
                const needsQuote =
                  order.status === "Pending Review" && order.packagingRequested;
                return (
                  <Fragment key={order.id}>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-ink-900">{order.id}</td>
                      <td className="px-5 py-3 text-ink-700/80">
                        {order.customerName}
                        <div className="text-xs text-ink-700/50">{order.phone}</div>
                      </td>
                      <td className="px-5 py-3 text-ink-700/70">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-ink-900">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3 text-xs">
                        <span
                          className={
                            order.paymentStatus === "paid"
                              ? "text-forest-700 font-semibold"
                              : "text-ink-700/50"
                          }
                        >
                          {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        {order.paymentMethod && (
                          <div className="text-ink-700/50">
                            {order.paymentMethod === "mobile_money" ? "Mobile Money" : "Bank Transfer"}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setExpanded(isOpen ? null : order.id)}
                          aria-label="Toggle details"
                          className="rounded-full p-2 text-ink-700 hover:bg-ink-900/5"
                        >
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="bg-sand-100 px-5 py-4">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">
                                Recipient
                              </p>
                              <p className="mt-1 text-sm text-ink-800">
                                {order.recipientName} · {order.recipientPhone}
                              </p>

                              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-700/50">
                                {order.deliveryMethod === "Delivery" ? "Delivery" : "Pickup"}
                              </p>
                              <p className="mt-1 text-sm text-ink-800">
                                {order.deliveryMethod === "Delivery"
                                  ? order.deliveryLocation
                                  : "Customer will pick up"}
                              </p>
                              <p className="text-sm text-ink-700/70">
                                Preferred date: {order.preferredDate}
                              </p>
                              <p className="text-sm text-ink-700/70">
                                Delivery fee paid by:{" "}
                                {order.deliveryFeePayer === "customer" ? "Customer" : "Recipient"}
                              </p>
                              {order.additionalInfo && (
                                <p className="mt-2 text-sm italic text-ink-700/70">
                                  &ldquo;{order.additionalInfo}&rdquo;
                                </p>
                              )}
                              {order.email && (
                                <p className="mt-2 text-sm text-ink-700/70">{order.email}</p>
                              )}
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">
                                Items
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {order.lines.map((line, i) => (
                                  <li key={i} className="text-sm text-ink-800">
                                    <div className="flex justify-between">
                                      <span>
                                        {line.name} ({line.color}, {line.size}) × {line.quantity}
                                      </span>
                                      <span>{formatPrice(line.price * line.quantity)}</span>
                                    </div>
                                    {line.giftMessage && (
                                      <p className="text-xs italic text-ink-700/60">
                                        Card message: &ldquo;{line.giftMessage}&rdquo;
                                      </p>
                                    )}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3 flex justify-between border-t border-ink-900/8 pt-2 text-sm">
                                <span className="text-ink-700/70">Subtotal</span>
                                <span className="text-ink-900">{formatPrice(order.subtotal)}</span>
                              </div>
                              {order.packagingRequested && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-ink-700/70">Packaging</span>
                                  <span className="text-ink-900">
                                    {order.packagingCost != null
                                      ? formatPrice(order.packagingCost)
                                      : "Not yet quoted"}
                                  </span>
                                </div>
                              )}
                              <div className="mt-1 flex justify-between font-semibold">
                                <span className="text-ink-900">Total</span>
                                <span className="text-ink-900">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {needsQuote && (
                            <PackagingQuoteForm
                              orderId={order.id}
                              onSend={(cost) => handleSendQuote(order.id, cost)}
                            />
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
