"use client";

import Link from "next/link";
import { ArrowRight, Heart, Gift, Sparkles } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { PageHero } from "@/components/PageHero";
import { ProductArt } from "@/components/ProductArt";
import { useAdminData } from "@/lib/store";

const VALUES = [
  {
    icon: Heart,
    title: "Personal, Not Generic",
    description:
      "Every gift card message is handwritten, and every order is packed like it's going to someone we know.",
  },
  {
    icon: Gift,
    title: "Gift-Ready, Always",
    description:
      "Want it professionally wrapped? Tell us what's in your order and we'll quote a packaging option before you pay.",
  },
  {
    icon: Sparkles,
    title: "Curated, Not Random",
    description:
      "For Him, For Her, Kids, Curated Packages, Gift Cards — every category is hand-picked.",
  },
];

export default function AboutPage() {
  const { settings } = useAdminData();
  const content = settings.pageContent;

  return (
    <div>
      <PageHero eyebrow="Our Story" title="We Started Because We Love Getting Gifting Right" />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="max-w-2xl text-lg text-ink-700/80">{content.aboutIntro}</p>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ProductArt category="curated-packages" className="aspect-4/3 w-full rounded-3xl" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              How We Started
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink-900">
              {content.aboutStoryTitle}
            </h2>
            <p className="mt-4 text-ink-700/80">{content.aboutStoryParagraph1}</p>
            <p className="mt-4 text-ink-700/80">{content.aboutStoryParagraph2}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-3xl font-bold text-ink-900">
            What We Stand For
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl bg-cream-50 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                  <value.icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-display font-semibold text-ink-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-ink-700/80">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl bg-forest-800 p-8 text-cream-50">
            <Sparkles className="h-8 w-8 text-amber-400" />
            <div>
              <p className="font-display text-2xl font-bold">
                <CountUp value="100%" /> Handled With Care
              </p>
              <p className="text-sm text-cream-100/70">
                From gift cards to curated packages — every order is packed and, if you&apos;d
                like, professionally gift-wrapped before it reaches your recipient.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-ink-900">
          Ready to find the perfect gift?
        </h2>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
