"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Gift, SlidersHorizontal, Sparkles, Star, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OCCASIONS, type Category, type Product } from "@/lib/products";
import { MagneticButton } from "@/components/MagneticButton";
import { ProductArt } from "@/components/ProductArt";

interface HeroCarouselProps {
  // Full live catalog — the Gift Matcher filters against this, so its counts and
  // budget bounds are always real, not guessed.
  allProducts: Product[];
  // The smaller rotating set (best sellers, or a fallback slice) shown in the
  // showcase card on the right.
  showcaseProducts: Product[];
  categories: Category[];
  settings: {
    badgeText: string;
    headline: string;
    headlineAccent: string;
    subtext: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
  };
}

export function HeroCarousel({ allProducts, showcaseProducts, categories, settings }: HeroCarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // A brand-new store (or one whose catalog is temporarily empty) still needs a
  // hero — the headline/subtext/CTAs aren't tied to any specific product, only
  // the right-side showcase and the matcher (which has nothing to match against
  // without a catalog) depend on there being products at all.
  const hasProducts = Boolean(showcaseProducts && showcaseProducts.length > 0);
  const currentProduct = hasProducts ? showcaseProducts[currentIndex] : null;

  useEffect(() => {
    if (isHovered || !hasProducts || showcaseProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, hasProducts, showcaseProducts.length]);

  // Gift Matcher state — its bounds and live count come from the real catalog, not
  // a guessed range, so "N matching gifts" is always an honest number.
  const [recipient, setRecipient] = useState("all");
  const [occasion, setOccasion] = useState("all");
  const catalogPrices = allProducts.map((p) => p.price);
  const minBudget = catalogPrices.length ? Math.floor(Math.min(...catalogPrices) / 10) * 10 : 0;
  const maxBudget = catalogPrices.length ? Math.ceil(Math.max(...catalogPrices) / 10) * 10 : 1000;
  const [budget, setBudget] = useState(maxBudget);

  const matchCount = useMemo(
    () =>
      allProducts.filter((p) => {
        const matchesRecipient = recipient === "all" || p.category === recipient;
        const matchesOccasion = occasion === "all" || (p.occasions ?? []).includes(occasion);
        return matchesRecipient && matchesOccasion && p.price <= budget;
      }).length,
    [allProducts, recipient, occasion, budget]
  );

  const handleFindGifts = () => {
    const params = new URLSearchParams();
    if (recipient !== "all") params.set("category", recipient);
    if (occasion !== "all") params.set("occasion", occasion);
    params.set("maxPrice", String(budget));
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-sand-50 overflow-visible flex items-center pt-28 pb-12">
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">

        {/* Left Column: Typography & Interactive Gift Matcher */}
        <div className="flex flex-col items-start z-20 pl-4 lg:pl-0 max-w-[540px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 text-ink-600"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
              NEW ARRIVAL
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] font-medium leading-[1.05] text-ink-950 tracking-tight"
          >
            {settings.headline}
            <br />
            <span className="italic font-normal">
              {settings.headlineAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-[15px] text-ink-700 max-w-sm leading-relaxed"
          >
            {settings.subtext}
          </motion.p>

          {allProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 w-full rounded-3xl border border-sand-200 bg-white/70 p-5 shadow-sm backdrop-blur-md sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
                  <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                  Find the Perfect Gift
                </h3>
                <span className="text-xs font-medium text-amber-600">Takes 10 seconds</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-ink-700/70">
                    Who are you gifting?
                  </span>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="all">Anyone</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-ink-700/70">
                    What&apos;s the occasion?
                  </span>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="all">Any occasion</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-ink-700/70">Budget up to</span>
                  <span className="text-xs font-bold text-amber-600">{formatPrice(budget)}</span>
                </div>
                <input
                  type="range"
                  min={minBudget}
                  max={maxBudget}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-2 w-full accent-amber-500"
                />
                <div className="mt-1 flex justify-between text-[11px] text-ink-700/40">
                  <span>{formatPrice(minBudget)}</span>
                  <span>{formatPrice(maxBudget)}</span>
                </div>
              </div>

              <button
                onClick={handleFindGifts}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-600"
              >
                <Sparkles className="h-4 w-4" />
                Show {matchCount} matching {matchCount === 1 ? "gift" : "gifts"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Feature Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center justify-between gap-6 border border-white/40 shadow-sm max-w-[420px]"
          >
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-ink-950" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-ink-950 uppercase">Premium</span>
                <span className="text-[11px] text-ink-600">Packaging</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-ink-200" />
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-ink-950" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-ink-950 uppercase">Swift</span>
                <span className="text-[11px] text-ink-600">Delivery</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-ink-200" />
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-ink-950" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-ink-950 uppercase">Curated</span>
                <span className="text-[11px] text-ink-600">Selection</span>
              </div>
            </div>
          </motion.div>

          {/* Honest brand line — no fabricated review counts/ratings on a brand-new store */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-3"
          >
            <Gift className="h-4 w-4 text-ink-600" strokeWidth={1.5} />
            <p className="text-[13px] font-medium text-ink-700">
              New in Accra — every gift hand-packed by our team.
            </p>
          </motion.div>
        </div>

        {/* Right Column: Rotating Product Showcase — only when there's an actual
            product to feature; the left column above never depends on this. */}
        {hasProducts && currentProduct && (
          <div className="w-full lg:pl-6">
            <div
              className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-400/20 via-sand-100 to-forest-600/10">
                <AnimatePresence mode="wait">
                  {currentProduct.image ? (
                    <motion.img
                      key={currentProduct.slug}
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <motion.div
                      key={currentProduct.slug}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex h-full w-full items-center justify-center"
                    >
                      <ProductArt category={currentProduct.category} className="h-4/5 w-4/5" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Real badge only (e.g. "Best Seller") — never a fabricated status */}
                {currentProduct.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                    {currentProduct.badge}
                  </span>
                )}
              </div>

              <div className="space-y-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                      {currentProduct.categoryLabel}
                    </p>
                    <h3 className="mt-0.5 font-display text-xl font-bold text-ink-900">
                      {currentProduct.name}
                    </h3>
                  </div>
                  <p className="whitespace-nowrap text-xl font-extrabold text-amber-600">
                    {formatPrice(currentProduct.price)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-ink-900">{currentProduct.rating}</span>
                  <span className="text-ink-700/50">({currentProduct.reviewCount})</span>
                </div>

                {currentProduct.specs.length > 0 && (
                  <ul className="grid grid-cols-1 gap-1.5 pt-1">
                    {currentProduct.specs.slice(0, 3).map((spec) => (
                      <li key={spec} className="flex items-center gap-2 text-xs text-ink-700">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-600" />
                        <span className="truncate">{spec}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center justify-between border-t border-sand-200 pt-3">
                  <div className="flex gap-1.5">
                    {showcaseProducts.map((product, idx) => (
                      <button
                        key={product.slug}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Show ${product.name}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? "w-6 bg-amber-500"
                            : "w-2 bg-sand-300 hover:bg-sand-400"
                        }`}
                      />
                    ))}
                  </div>
                  <MagneticButton
                    href={`/product/${currentProduct.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-black"
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
