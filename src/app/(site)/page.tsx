"use client";

import Link from "next/link";
import { ArrowRight, Truck, Gift, Sparkles, Heart } from "lucide-react";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { HeroSection } from "@/components/HeroSection";
import { MagneticButton } from "@/components/MagneticButton";
import { Newsletter } from "@/components/Newsletter";
import { Reveal } from "@/components/Reveal";
import { MotionLink } from "@/components/MotionLink";
import { useAdminData } from "@/lib/store";
import { getTopSellers } from "@/lib/top-sellers";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Curated, Not Random",
    description:
      "For Him, For Her, Kids, Curated Packages, Gift Cards — every category is hand-picked so you can find the right gift fast.",
  },
  {
    icon: Gift,
    title: "Gift-Ready Packaging",
    description:
      "Want it wrapped? Tell us what's in your order and we'll quote a professional gift-packaging option before you pay.",
  },
  {
    icon: Truck,
    title: "Delivery or Pickup, Your Choice",
    description:
      "Have it delivered to your recipient or pick it up yourself — either way, you choose who covers the delivery fee.",
  },
  {
    icon: Heart,
    title: "A Personal Touch",
    description: "Add a message to any gift card — we'll write it in by hand, exactly as you send it.",
  },
];

export default function Home() {
  const { products, categories, orders, settings } = useAdminData();
  const bestSellers = getTopSellers(products, orders, 4);
  const heroProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  const hero = settings.hero;

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Category carousel */}
      <section className="relative overflow-hidden py-20">
        <div
          aria-hidden
          className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-clay-700/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-amber-600">
              Browse by Category
            </p>
            <h2 className="mt-2 text-center font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
              Who Are You Shopping For?
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <CategoryCarousel>
              {categories.map((category) => (
                <MotionLink
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="glass group flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-lg sm:w-64"
                >
                  <ProductArt category={category.slug} className="aspect-4/3 w-full" />
                  <div className="flex items-center justify-between gap-2 p-4">
                    <div>
                      <p className="font-display font-semibold text-ink-900">{category.name}</p>
                      <p className="text-xs text-ink-700/60">{category.description}</p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </MotionLink>
              ))}
            </CategoryCarousel>
          </Reveal>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-sand-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-forest-600">
                Top Picks
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 font-semibold text-ink-800 hover:text-amber-600"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="relative overflow-hidden py-20">
        <div
          aria-hidden
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-forest-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-sunset-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-amber-600">
              Why Us
            </p>
            <h2 className="mt-2 text-center font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
              The EA_DUBEA&apos;S GIFT HUB Difference
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => {
              const card = settings.pageContent.whyUsCards[index] ?? feature;
              return (
                <Reveal
                  key={feature.title}
                  delay={index * 0.08}
                  className="glass rounded-2xl p-6 bg-white/60 border border-sand-200 hover:bg-white transition-colors"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600`}
                  >
                    <feature.icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700/90">{card.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-sand-100 py-24">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <div className="rounded-3xl border-8 border-white shadow-xl overflow-hidden">
              <ProductArt category="curated-packages" className="aspect-4/3 w-full" />
            </div>
            <div className="absolute -bottom-6 -right-6 flex items-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-ink-900 shadow-xl border border-sand-200">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Hand-Packed With Care
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm font-bold uppercase tracking-widest text-forest-600">
              Our Story
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
              From a Small Idea to a <span className="text-forest-600">Gift Hub.</span>
            </h2>
            <p className="mt-6 text-lg text-ink-700/80">
              It started with friends and family asking for help finding the right gift for
              the right person — something more thoughtful than a last-minute run to the
              mall. That habit of getting gifting right, every time, became EA_DUBEA&apos;S
              GIFT HUB. Today the collection spans gifts for him, for her, for the kids,
              curated gift packages, and gift cards — each order packed with care.
            </p>
            <MotionLink
              href="/about"
              whileTap={{ scale: 0.96 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-forest-700 px-6 py-3 font-semibold text-forest-700 transition-colors hover:bg-forest-700/5"
            >
              Read Our Story
              <ArrowRight className="h-4 w-4" />
            </MotionLink>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-700/80">
            New arrivals, curated collections, and the occasional discount — straight to
            your inbox.
          </p>
          <div className="mt-6">
            <Newsletter />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
