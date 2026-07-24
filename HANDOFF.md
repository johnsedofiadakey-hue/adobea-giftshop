# EA_DUBEA'S GIFT HUB — Project Handoff

Last updated: 2026-07-24 (rebranded from the Helyz Scents baseline into a real gift-shop build,
per the client's 10-step customer journey brief). Read this before touching the codebase — it
explains what exists, why it's built the way it is, and what's still missing. Keep it updated as
the project changes.

## What this is

An e-commerce storefront + admin portal for **EA_DUBEA'S GIFT HUB** (Instagram
`ea_dubea_gifthub`, TikTok `giftshop_gh`, Snapchat `adub_ea`, phone `024 031 6093`), a Ghana-based
gift shop selling curated gifts across five categories (For Him, For Her, Curated Packages, Kids,
Gift Cards) plus a computed Best Sellers view. This codebase started as a template baseline
carried through two prior rebrands (STORMGLIDE packaging supplies → Helyz Scents home fragrance →
this) — the architecture, admin portal, Firebase data layer, and design-system infrastructure
were reused deliberately; only the identity, catalog, checkout flow, and payment integration are
new to this pass. See "Template origin" at the bottom for the full lineage.

**Not a standard Next.js version.** Per `AGENTS.md`: this Next.js version has breaking changes
from training-data conventions (e.g. `middleware.ts` → `proxy.ts`). Check
`node_modules/next/dist/docs/` before writing Next-specific code.

## Quick start

```bash
npm install
npm run dev
```

Requires `.env.local` (gitignored) with `NEXT_PUBLIC_FIREBASE_*` (6 vars, from a real Firebase
project — none exists yet, see Known Gaps). **No Firebase project = the app won't even render**:
`src/lib/firebase.ts` calls `getAuth(app)` eagerly at module load, and the Auth SDK throws
synchronously (`auth/invalid-api-key`) if the key isn't at least well-formed. A syntactically
plausible-but-fake key (`AIzaSy` + 33 chars) is enough to get past that for local UI/visual QA —
Firestore reads then just come back empty/permission-denied and fall back to the seeded sample
catalog (existing, designed behavior) — but nothing writes anywhere real until a genuine project
exists.

Server env vars, all optional (each integration no-ops/errors clearly without its own key —
nothing silently pretends to succeed):
- `ARKESEL_API_KEY`, `BREVO_API_KEY` — SMS/email order notifications.
- `PAYSTACK_SECRET_KEY` — required for checkout to actually process a payment. Also add
  `{domain}/api/payments/paystack/webhook` as a webhook URL in the Paystack dashboard.

**Admin login**: `/admin/login`, same manual-bootstrap process as before (Firebase Auth user +
matching `staff/{uid}` doc with `role: "Admin"`, `active: true`, created via Firebase console).

## What's new in this pass (vs. the Helyz Scents baseline)

- **Identity**: name, logo (extracted from the client's PDF via `pdftoppm`/PIL — see
  `public/logo.PNG` / `src/app/icon.png`), copy, and theme colors (White / Warm Cream / Gold /
  Charcoal — `DEFAULT_THEME` in `src/lib/store.tsx`, no exact brand hex was supplied so these are
  a placeholder, swap anytime via Admin → Settings → Colors & Branding). `formatPrice()` in
  `src/lib/utils.ts` was also fixed from a hardcoded `$` to `GH₵` — the rest of the app (price
  filters, Paystack `currency: "GHS"`) already assumed Ghana Cedis; that one spot didn't.
- **Categories & catalog** (`src/lib/products.ts`): `for-him` / `for-her` / `curated-packages` /
  `kids` / `gift-cards`. **Best Sellers is deliberately not a category** — it's `/best-sellers`,
  a computed view over `getTopSellers()` (real order data, `src/lib/top-sellers.ts`), so it can't
  go stale. `ProductArt.tsx` has new hand-drawn SVG illustrations per category (no real product
  photography yet, same "no stock art" design philosophy as before).
- **Gift-card messages**: gated on `product.category === "gift-cards"`
  (`isGiftCardCategory()` in `products.ts`). `ProductDetail.tsx` shows a "write a message" (100
  char max) vs. "leave it blank" choice before Add to Cart; stored as `CartLine.giftMessage`
  (`cart-context.tsx`) — included in the line's dedupe key so two gift cards with different
  messages don't merge into one line with a stomped-over message.
- **Order status pipeline** (`OrderStatus` in `store.tsx`) is now 6 states, replacing the old
  Pending/Processing/Delivered/Cancelled:
  🟡 Pending Review → 🟠 Awaiting Payment → 🔵 Processing → 🟢 Ready for Delivery → ✅ Delivered
  (plus ❌ Cancelled, staff-triggered any time). **Packaging-requested orders** start at Pending
  Review (unpaid, no `total` yet); staff enters a packaging cost in `/admin/orders`
  (`setPackagingQuote()` in `store.tsx`), which sets `total = subtotal + packagingCost` and flips
  to Awaiting Payment, texting/emailing the customer a `/pay/{orderId}` link. **No-packaging
  orders** go straight to Awaiting Payment with a known total and an immediate Paystack redirect.
  Either way, **payment confirmation is what auto-advances Awaiting Payment → Processing** — no
  staff click needed for that specific transition (see Payments below).
  `OrderStatusStepper.tsx` renders 5 steps if `order.packagingRequested`, 4 if not (skips
  "Pending Review", since that path never goes through it).
- **Checkout** (`(site)/cart/page.tsx`) is a 5-step wizard now instead of one inline form: cart
  review → gift packaging yes/no → delivery details (recipient name/phone, delivery-or-pickup,
  location, preferred date, who-pays-the-delivery-fee, additional info) → order summary
  (branches: "Submit for Review" if packaging requested, or "Pay with Mobile Money"/"Pay with Bank
  Transfer" if not) → confirmation. The pay-now branch redirects to Paystack instead of showing an
  in-app confirmation; that lands on `/order/[id]/complete` instead.
- **Payments — real Paystack integration** (`src/lib/paystack-server.ts` + three routes under
  `api/payments/paystack/`): `initialize` (creates the hosted-checkout session, channel restricted
  to whichever button — `mobile_money` or `bank_transfer` — the customer clicked), `webhook`
  (HMAC-SHA512 signature verification, source of truth, `charge.success` → marks paid + advances
  status), `verify` (same logic, called from the redirect-return page for immediate feedback —
  safe to call twice, idempotent via `markOrderPaidIfNeeded()`). No new npm dependency — plain
  `fetch` against Paystack's REST API, matching how Arkesel/Brevo are already integrated.
  **`paystackSecretKey` was removed from `StoreSettings` entirely** (it used to live in the
  public-read `settings` Firestore doc — a real security hole the Helyz Scents HANDOFF had already
  flagged but never fixed) — the real secret now lives only in the `PAYSTACK_SECRET_KEY` server
  env var, same pattern as Arkesel/Brevo. `paystackPublicKey` stays in Settings for reference but
  isn't actually used by the redirect-based checkout flow.
- **`/pay/[orderId]`**: the page a packaging-quote notification link points to. Public, looks up
  just enough via `/api/orders/payment-info` (same sanitized-lookup pattern as `/api/orders/track`
  — never name/address/phone) to show the final total and the same two Paystack buttons.
- **Firestore rules fix**: the `orders` `create` rule used to hard-require `status == 'Pending'`,
  which no longer exists as a valid status — **this would have silently broken all guest checkout**
  had it shipped unfixed. Now checks for either of the two valid entry statuses
  (`'Pending Review'` / `'Awaiting Payment'`) and `paymentStatus == 'unpaid'`. All later status/
  payment transitions are written server-side via `firebase-admin` (webhook/verify/admin quote
  flow), which bypasses these rules entirely — the `create` check is the only gate guest checkout
  actually goes through.
- **`export const dynamic = "force-dynamic"`** added to the root layout — every page depends on
  live Firestore data via `AdminDataProvider`, and the admin portal is per-request auth-gated;
  none of it should be statically prerendered. Without this, `next build` tries to evaluate the
  Firebase client SDK at build time against whatever `NEXT_PUBLIC_FIREBASE_*` is set, which fails
  outright without a real project.
- **Footer** now actually reads `settings.storePhone`/`settings.storeEmail` (those fields already
  existed in the schema but were hardcoded over in the Helyz Scents version) and a new
  `settings.socialLinks` (Instagram/TikTok/Snapchat) — no icons for TikTok/Snapchat exist in
  lucide-react, so all three use a generic `AtSign` icon with a text label instead of guessing at
  a brand icon that might not exist in this Next/lucide version.

## Known gaps (honest, prioritized)

**Blocking a real launch:**
1. **No live Firebase project yet.** `.firebaserc`/`firebase.json`/`apphosting.yaml` all have
   placeholder values (deliberately, so this repo can never accidentally deploy to either prior
   client's project). Create a new Firebase project (Blaze plan, for App Hosting), enable Auth/
   Firestore/Storage, copy the real config into `.env.local` and `apphosting.yaml`, deploy
   `firestore.rules`/`storage.rules`, create the first admin account.
2. **No real Paystack keys.** Checkout will error clearly (not silently) until `PAYSTACK_SECRET_KEY`
   is set and the webhook URL is registered in the Paystack dashboard. Test end-to-end with
   Paystack's test-mode keys/cards before going live.
3. **SMS/email notification content is generic**, not the exact wording from the client's brief
   (e.g. "Your order has been reviewed. Your final total is GH₵850...") — the existing
   `order-confirmation` route's copy wasn't forked into packaging-review vs. payment-link variants
   to keep this pass's scope bounded. The in-app confirmation *screens* do use the brief's exact
   wording; only the background SMS/email text is generic. Worth a follow-up pass.
4. **No real WhatsApp Business API.** The brief asks for a WhatsApp confirmation specifically;
   this pass uses the already-working Arkesel SMS + Brevo email instead, since a real WhatsApp
   integration needs its own Meta Business verification and approved message templates — outside
   what could be wired up sight-unseen. Swap in later behind the same notification call sites.
5. **Sample catalog is a starting point** — 5 products across the 5 categories, seeded the same
   way the template always has (`AdminDataProvider` local-state seed + admin "Seed Sample Catalog"
   button). Replace with real inventory via Admin → Products or the CSV bulk-import tool.

**Should verify with a real person once Firebase + Paystack exist:**
6. Full checkout click-through against real Firestore writes (only verified up to the point of
   the actual `setDoc` call in this pass, using a syntactically-fake local Firebase config —
   see Quick Start).
7. A real Paystack test-mode charge end-to-end (initialize → redirect → pay → webhook → status
   flips to Processing) — couldn't be exercised without live keys.
8. Gold theme color and the "100%" hero/about stats are placeholders, not exact brand values or
   real metrics — swap the color via Settings whenever an exact brand hex exists; the stats are
   deliberately non-specific rather than a fabricated number.

## Template origin

Adapted from the Helyz Scents baseline (itself adapted from an earlier STORMGLIDE
packaging-supplies build) — see this doc's git history (once a repo exists) for that lineage. The
architecture, admin portal, Firebase data layer, and design-system infrastructure are the reusable
parts carried forward; the previous project's detailed session history was not carried forward
(different client engagement) — this document now tracks EA_DUBEA'S GIFT HUB's own history going
forward. Add new session entries here as work happens.
