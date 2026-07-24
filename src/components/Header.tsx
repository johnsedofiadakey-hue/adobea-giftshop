"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/lib/cart-context";
import { useAdminData } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/track", label: "Track Order" },
];

export function Header() {
  const { itemCount, setCartOpen } = useCart();
  const { categories } = useAdminData();
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-2 transition-all duration-300 ease-out bg-transparent pointer-events-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pointer-events-auto">
        <Link href="/" className="flex items-center gap-3 px-2 py-2 transition-transform hover:scale-[1.02]">
          <Logo className="h-16 w-auto" />
          <span className="font-display leading-tight hidden md:block">
            <span className="block whitespace-nowrap text-base font-bold tracking-tight text-ink-900">
              EA_DUBEA&apos;S GIFT HUB
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full bg-white/90 px-3 py-2 backdrop-blur-md border border-sand-200 shadow-sm md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-white/50"
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              href="/shop"
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-white/50"
            >
              Shop Collection
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>

            {shopOpen && (
              <div className="absolute left-0 top-full pt-4">
                <div className="glass w-56 rounded-2xl p-2 shadow-xl">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-amber-500/10 hover:text-amber-700"
                    >
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/best-sellers"
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-amber-500/10 hover:text-amber-700"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="/shop"
                    className="mt-1 block rounded-xl px-4 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-500/10"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-white/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 rounded-full bg-white/90 p-1.5 backdrop-blur-md border border-sand-200 shadow-sm">
          <Link
            href="/shop"
            aria-label="Search products"
            className="rounded-full p-2.5 text-ink-900 transition-colors hover:bg-white/50"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="ml-1 flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-amber-600"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-amber-700">
                {itemCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-ink-900 transition-colors hover:bg-white/50 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-6 pt-4 pointer-events-auto md:hidden">
          <nav className="flex flex-col gap-1 rounded-2xl bg-white/70 p-3 backdrop-blur-xl border border-white/30 shadow-lg">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-white/50"
            >
              Shop Collection
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 pl-6 text-sm font-medium text-ink-800 hover:bg-white/50"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/best-sellers"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 pl-6 text-sm font-medium text-ink-800 hover:bg-white/50"
            >
              Best Sellers
            </Link>
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-white/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
