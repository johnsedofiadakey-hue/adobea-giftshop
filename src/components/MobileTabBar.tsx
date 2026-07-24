"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Store, ShoppingCart, PackageSearch } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/track", label: "Track", icon: PackageSearch },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();
  const { itemCount, setCartOpen } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-sm items-stretch justify-around rounded-3xl bg-white/50 px-2 py-2 shadow-[0_8px_32px_rgba(36,31,22,0.15)] backdrop-blur-xl border border-white/30"
      >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        const isCart = href === "/cart";
        const Component = isCart ? "button" : Link;
        const props = isCart ? { onClick: () => setCartOpen(true) } : { href };

        return (
          <Component
            key={href}
            {...(props as any)}
            className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
          >
            {active && (
              <motion.span
                layoutId="mobileTabIndicator"
                className="absolute inset-x-2 top-0 h-8 rounded-2xl bg-amber-500/15"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <motion.span
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center gap-0.5"
            >
              <span className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-amber-600" : "text-ink-700/60"
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
                {href === "/cart" && itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[11px] font-medium transition-colors ${
                  active ? "text-amber-600" : "text-ink-700/60"
                }`}
              >
                {label}
              </span>
            </motion.span>
          </Component>
        );
      })}
      </nav>
    </div>
  );
}
