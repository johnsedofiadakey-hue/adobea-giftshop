"use client";

import { PageHero } from "@/components/PageHero";
import { useAdminData } from "@/lib/store";

export default function TermsPage() {
  const { settings } = useAdminData();
  const storeName = settings.storeName || "EA_DUBEA'S GIFT HUB";

  return (
    <div>
      <PageHero eyebrow="Legal" title="Terms of Service" />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-ink-700/60">Last updated: 24 July 2026</p>

        <p className="mt-6 text-ink-700/80">
          These Terms of Service govern your use of the {storeName}{" "}
          website and any order you place with us. By using our site or placing an order, you
          agree to these terms.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">1. Orders</h2>
            <p className="mt-3 text-ink-700/80">
              Placing an order is an offer to purchase. We may contact you to confirm details
              before an order is finalized, particularly for orders that include gift packaging,
              where the final packaging cost is confirmed by our team before payment.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">2. Pricing & Payment</h2>
            <p className="mt-3 text-ink-700/80">
              All prices are listed in Ghanaian Cedis (GH₵) and are subject to change without
              notice. Payment is accepted via Mobile Money or Bank Transfer through our payment
              processor, Paystack. Orders are processed once payment is confirmed, except where
              packaging is requested and quoted separately.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              3. Delivery & Pickup
            </h2>
            <p className="mt-3 text-ink-700/80">
              You may choose to have your order delivered or pick it up yourself. Delivery fees
              are confirmed by our team ahead of the delivery date and may be paid by either the
              customer or the recipient, as selected at checkout. Delivery dates are estimates,
              not guarantees, and may shift due to circumstances outside our control.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">4. Gift Packaging</h2>
            <p className="mt-3 text-ink-700/80">
              Professional gift packaging is optional and comes at an additional charge based on
              the items and packaging requested. The final packaging cost is confirmed by our
              team before payment is completed.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              5. Cancellations & Refunds
            </h2>
            <p className="mt-3 text-ink-700/80">
              Orders can be cancelled before they enter processing — contact us as soon as
              possible if you need to cancel. Once an order has been packed or dispatched, it may
              not be eligible for cancellation. Refunds for eligible cancellations or issues with
              your order are reviewed case by case; contact us to start the process.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              6. Product Availability
            </h2>
            <p className="mt-3 text-ink-700/80">
              Items are subject to availability. If something in your order becomes unavailable
              after purchase, we&apos;ll contact you to arrange a substitute, partial refund, or
              full refund.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              7. Intellectual Property
            </h2>
            <p className="mt-3 text-ink-700/80">
              All content on this site — including our name, logo, product photography, and
              written content — belongs to {storeName}{" "}
              and may not be used without our permission.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              8. Limitation of Liability
            </h2>
            <p className="mt-3 text-ink-700/80">
              We aim to describe our products accurately, but we don&apos;t guarantee the site
              will always be error-free or uninterrupted. To the extent permitted by law, we
              aren&apos;t liable for indirect or consequential losses arising from your use of the
              site or a delayed/undelivered order.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">9. Governing Law</h2>
            <p className="mt-3 text-ink-700/80">
              These terms are governed by the laws of Ghana.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              10. Changes to These Terms
            </h2>
            <p className="mt-3 text-ink-700/80">
              We may update these terms from time to time. Continued use of the site after a
              change means you accept the updated terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">11. Contact Us</h2>
            <p className="mt-3 text-ink-700/80">
              Questions about these terms? Reach us at{" "}
              <a href={`mailto:${settings.storeEmail}`} className="text-amber-600 hover:underline">
                {settings.storeEmail}
              </a>{" "}
              or {settings.storePhone}.
            </p>
          </div>
        </div>

        <p className="mt-14 rounded-xl border border-sand-300 bg-sand-100 p-4 text-xs text-ink-700/60">
          This is a general-purpose template, not legal advice. Since real payments and personal
          data are involved, we&apos;d recommend having a lawyer review this before relying on it
          for compliance purposes.
        </p>
      </section>
    </div>
  );
}
