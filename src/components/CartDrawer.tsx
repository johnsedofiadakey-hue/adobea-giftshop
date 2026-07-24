"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, lineKey } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isCartOpen, setCartOpen, lines, updateQuantity, removeLine, subtotal } = useCart();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[100] bg-ink-950/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
              <h2 className="font-display text-xl font-bold text-ink-900">Your Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-ink-700 transition-colors hover:bg-cream-100 hover:text-ink-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-ink-700/40">
                    <ShoppingBag className="h-8 w-8" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-sm text-ink-700/70">
                    Looks like you haven&apos;t added anything yet.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-cream-100">
                  {lines.map((line) => {
                    const key = lineKey(line);
                    return (
                      <li key={key} className="flex gap-4 py-4">
                        <div className="flex-1">
                          <p className="font-display font-semibold text-ink-900">{line.name}</p>
                          <p className="text-sm text-ink-700/70">
                            {line.color} · {line.size}
                          </p>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center rounded-full border border-cream-200">
                              <button
                                onClick={() => updateQuantity(key, line.quantity - 1)}
                                className="p-1.5 text-ink-800 hover:text-amber-600"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(key, line.quantity + 1)}
                                className="p-1.5 text-ink-800 hover:text-amber-600"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeLine(key)}
                              className="text-ink-700/50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="font-display font-semibold text-ink-900">
                          {formatPrice(line.price * line.quantity)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-cream-200 bg-cream-50 p-6">
                <div className="flex justify-between font-display text-lg font-bold text-ink-900">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-700/70">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3.5 font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
