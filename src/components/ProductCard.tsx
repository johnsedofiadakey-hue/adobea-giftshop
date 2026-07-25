"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { MotionLink } from "@/components/MotionLink";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product);

  return (
    <MotionLink
      href={`/product/${product.slug}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 border border-sand-200 hover:border-amber-200 hover:shadow-xl`}
    >
      <div className="relative overflow-hidden">
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
      <div className="flex flex-1 flex-col gap-1 p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
          {product.categoryLabel}
        </span>
        <h3 className="font-display text-lg font-bold text-ink-950 transition-colors group-hover:text-amber-600 line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-700 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 flex items-center gap-1 text-sm text-ink-700/80">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span>{product.rating}</span>
          <span className="text-ink-700/50">({product.reviewCount})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2 text-ink-900">
          {discount !== null && (
            <span className="text-sm text-ink-700/40 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
          <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
          <span className="text-sm text-ink-700/70">per {product.unit}</span>
        </div>
      </div>
    </MotionLink>
  );
}
