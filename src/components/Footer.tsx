"use client";

import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAdminData } from "@/lib/store";

export function Footer() {
  const { settings, categories } = useAdminData();
  const socials = [
    { platform: "Instagram", handle: settings.socialLinks?.instagram },
    { platform: "TikTok", handle: settings.socialLinks?.tiktok },
    { platform: "Snapchat", handle: settings.socialLinks?.snapchat },
  ].filter((s): s is { platform: string; handle: string } => Boolean(s.handle));

  return (
    <footer className="bg-forest-900 text-cream-100/90">
      <div
        aria-hidden
        className="h-[3px] w-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-forest-600), var(--color-clay-700), var(--color-sunset-500), var(--color-amber-500))",
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-14 rounded-xl bg-white/90 p-1.5" />
            <span className="font-display text-lg font-bold text-white">
              EA_DUBEA&apos;S GIFT HUB
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-cream-100/70">
            {settings.pageContent.footerTagline}
          </p>
          {socials.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm">
              {socials.map((s) => (
                <li key={s.platform} className="flex items-center gap-2 text-cream-100/70">
                  <AtSign className="h-3.5 w-3.5 shrink-0 text-sunset-500" />
                  {s.platform}: {s.handle}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-sunset-500">
            Shop
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/best-sellers" className="hover:text-white">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-sunset-500">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/track" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-sunset-500">
            Get in Touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sunset-500" />
              Accra, Ghana
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sunset-500" />
              {settings.storePhone}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sunset-500" />
              {settings.storeEmail}
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-6 py-5 text-center text-xs text-cream-100/60">
        © {new Date().getFullYear()} EA_DUBEA&apos;S GIFT HUB. All rights reserved.
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:text-cream-100">
          Privacy Policy
        </Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-cream-100">
          Terms of Service
        </Link>
        <Link
          href="/admin/login"
          className="mt-2 block text-cream-100/20 transition-colors hover:text-cream-100/50 sm:absolute sm:right-6 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        >
          Staff Login
        </Link>
      </div>
    </footer>
  );
}
