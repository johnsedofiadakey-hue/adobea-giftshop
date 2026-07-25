"use client";

import Link from "next/link";
import { ChevronDown, Search, User, ShoppingBag, Gift } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Logo } from "@/components/Logo";

export function Header() {
  const { itemCount, setCartOpen } = useCart();

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-2 transition-transform hover:scale-[1.02]">
          <Logo className="h-16 w-auto" />
          <span className="font-display leading-tight hidden md:block">
            <span className="block whitespace-nowrap text-base font-bold tracking-tight text-ink-900">
              EA_DUBEA&apos;S GIFT HUB
            </span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="text-[#C86267] relative py-1 border-b-2 border-[#C86267]">
            Home
          </Link>
          <Link href="/shop" className="flex items-center gap-1 hover:text-[#C86267] transition-colors">
            Shop <ChevronDown size={14} />
          </Link>
          <Link href="#" className="hover:text-[#C86267] transition-colors">
            Build Your Box
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-[#C86267] transition-colors">
            Occasions <ChevronDown size={14} />
          </Link>
          <Link href="/about" className="hover:text-[#C86267] transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-[#C86267] transition-colors">
            Contact Us
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-5 text-gray-700">
          <button aria-label="Search" className="hover:text-[#C86267] transition-colors">
            <Search size={20} />
          </button>
          <button aria-label="Account" className="hover:text-[#C86267] transition-colors">
            <User size={20} />
          </button>
          <button 
            aria-label="Cart" 
            onClick={() => setCartOpen(true)}
            className="hover:text-[#C86267] transition-colors relative"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1.5 -right-2 bg-[#C86267] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
