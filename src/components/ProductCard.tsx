"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Minus, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use first available color and size as defaults since they are selecting inline
    const color = product.colors[0]?.name ?? "";
    const size = product.sizes[0] ?? "";
    addToCart(product, { color, size, quantity });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 border border-sand-200 hover:border-amber-200 hover:shadow-xl`}
    >
      <Link href={`/product/${product.slug}`} className="relative overflow-hidden block">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <ProductArt category={product.category} className="aspect-square w-full transition-transform duration-500 ease-out group-hover:scale-105" />
        )}
        
        {/* Ribbon Badges */}
        <div className="absolute left-0 top-6 z-20 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-r-full bg-sunset-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discount !== null && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-fit rounded-r-full bg-forest-600/90 px-4 py-1.5 text-xs font-bold text-white shadow-sm"
            >
              -{discount}%
            </motion.span>
          )}
        </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
          {product.categoryLabel}
        </span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg font-bold text-ink-950 transition-colors hover:text-amber-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm leading-relaxed text-ink-700">
          {product.description}
        </p>

        {product.specs && product.specs.length > 0 && (
          <ul className="space-y-1.5 text-xs text-ink-700/80">
            {product.specs.slice(0, 3).map((spec) => (
              <li key={spec} className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                {spec}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 border-t border-sand-100 flex flex-col gap-4">
          <div className="flex items-baseline gap-2 text-ink-900 justify-between">
            <div>
              {discount !== null && (
                <span className="text-sm text-ink-700/40 line-through mr-2">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
              <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
            </div>
            
            <div className="flex items-center rounded-full border border-sand-200 bg-sand-50/50">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity((q) => Math.max(1, q - 1)); }}
                className="p-1.5 text-ink-800 hover:text-amber-600"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity((q) => Math.min(product.stock, q + 1)); }}
                className="p-1.5 text-ink-800 hover:text-amber-600"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.96 }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-2.5 font-semibold text-white transition-colors hover:bg-amber-600"
            >
              <ShoppingCart className="h-4 w-4" />
              {justAdded ? "Added ✓" : `Add to Cart — ${formatPrice(product.price * quantity)}`}
            </motion.button>
            
            <AnimatePresence>
              {justAdded && (
                <motion.button
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push("/cart"); }}
                  className="text-sm font-semibold text-ink-800 underline hover:text-amber-600"
                >
                  View cart
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
