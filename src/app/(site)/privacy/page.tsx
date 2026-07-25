"use client";

import { PageHero } from "@/components/PageHero";
import { useAdminData } from "@/lib/store";

export default function PrivacyPage() {
  const { settings } = useAdminData();
  const storeName = settings.storeName || "EA_DUBEA'S GIFT HUB";

  return (
    <div>
      <PageHero eyebrow="Legal" title="Privacy Policy" />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-ink-700/60">Last updated: 24 July 2026</p>

        <p className="mt-6 text-ink-700/80">
          This Privacy Policy explains what information {storeName}{" "}
          collects when you use our website, why we collect it, and how it&apos;s handled. By
          placing an order or browsing our site, you agree to the practices described here.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              1. Information We Collect
            </h2>
            <p className="mt-3 text-ink-700/80">
              When you place an order, we collect the information needed to fulfil it: your name,
              phone number, email (if provided), and the recipient&apos;s name, phone number, and
              delivery address or pickup preference. If you add a gift card message, we store the
              text you provide so it can be included with your order.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              2. How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-700/80">
              <li>To process, package, and deliver your order.</li>
              <li>To contact you about order status, packaging quotes, and payment.</li>
              <li>To respond to questions sent through our contact form.</li>
              <li>To improve our catalogue and store experience.</li>
            </ul>
            <p className="mt-3 text-ink-700/80">
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              3. Payment Processing
            </h2>
            <p className="mt-3 text-ink-700/80">
              Online payments (Mobile Money and Bank Transfer) are processed by Paystack, a
              third-party payment provider. We do not see or store your full card, Mobile Money
              PIN, or banking credentials — these are handled directly by Paystack under their own
              privacy and security policies.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">4. Data Storage</h2>
            <p className="mt-3 text-ink-700/80">
              Order and account information is stored securely using our hosting and database
              providers. We keep order records for as long as needed to fulfil orders, handle
              disputes, and meet accounting requirements.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">5. Cookies</h2>
            <p className="mt-3 text-ink-700/80">
              We use minimal local storage in your browser to remember your shopping cart between
              visits. We do not use tracking cookies for advertising.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">6. Your Rights</h2>
            <p className="mt-3 text-ink-700/80">
              You can ask us to correct or delete personal information we hold about you, subject
              to what we&apos;re legally required to retain (e.g. order records for accounting).
              Contact us using the details below to make a request.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              7. Children&apos;s Privacy
            </h2>
            <p className="mt-3 text-ink-700/80">
              Our store is not directed at children, and we do not knowingly collect personal
              information from children.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              8. Changes to This Policy
            </h2>
            <p className="mt-3 text-ink-700/80">
              We may update this policy from time to time. Changes will be posted on this page
              with an updated date.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">9. Contact Us</h2>
            <p className="mt-3 text-ink-700/80">
              Questions about this policy? Reach us at{" "}
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
