"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Gift, Sparkles, Truck, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { MagneticButton } from "@/components/MagneticButton";
import { ProductArt } from "@/components/ProductArt";

interface HeroCarouselProps {
  products: Product[];
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

export function HeroCarousel({ products, settings }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // A brand-new store (or one whose catalog is temporarily empty) still needs a
  // hero — the headline/subtext/CTAs aren't tied to any specific product, only
  // the right-side visual stage is. Returning null here used to hide the whole
  // section, headline included, whenever the catalog had zero products.
  const hasProducts = Boolean(products && products.length > 0);
  const currentProduct = hasProducts ? products[currentIndex] : null;

  // Auto-advance
  useEffect(() => {
    if (isHovered || !hasProducts || products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, hasProducts, products.length]);

  return (
    <section className="relative w-full min-h-[90vh] bg-sand-50 overflow-visible flex items-center pt-20 pb-12 lg:pt-0 lg:pb-0">
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Typography & Content */}
        <div className="flex flex-col items-start z-20 mt-10 lg:mt-0 pl-4 lg:pl-0 max-w-[500px]">
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
            className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-medium leading-[1.05] text-ink-950 tracking-tight"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <MagneticButton
              href={settings.ctaPrimaryHref}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1e231e] px-8 py-3.5 text-[15px] font-medium text-white shadow-xl transition-colors hover:bg-black"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href={settings.ctaSecondaryHref}
              className="inline-flex items-center justify-center gap-3 bg-transparent px-4 py-3 text-[15px] font-medium text-ink-950 transition-colors hover:opacity-70"
            >
              Explore Features 
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-300">
                <span className="ml-0.5 border-y-4 border-l-6 border-r-0 border-y-transparent border-l-ink-900" />
              </span>
            </MagneticButton>
          </motion.div>

          {/* Feature Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center justify-between gap-6 border border-white/40 shadow-sm max-w-[420px]"
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

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-sand-200 border-2 border-[#e6e2db] shadow-sm relative z-10"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                    backgroundSize: "cover",
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[12px] font-medium text-ink-900">Loved by 10,000+ customers</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#767962] text-[#767962]" />
                ))}
                <span className="text-[12px] font-bold text-ink-900 ml-1 mt-0.5">4.9/5</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Stage (Full Circle) — only when there's an actual
            product to feature; the left column above never depends on this. */}
        {hasProducts && currentProduct && (
        <>
        <div
          className="absolute right-0 top-0 w-[50%] h-full hidden lg:flex items-center justify-center z-0 pointer-events-none pr-12"
        >
          {/* Background Circle Mask - Full circle */}
          <div className="relative w-full max-w-[800px] aspect-square rounded-full overflow-hidden shadow-2xl bg-[#a0a599]">
            {/* Inner dynamic background for the circle (scenic placeholder) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop')" }}
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        <div 
          className="relative w-full aspect-square lg:h-[80vh] lg:w-auto mx-auto mt-12 lg:mt-0 flex items-center justify-center z-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mobile only background circle */}
          <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl bg-[#a0a599] lg:hidden z-0">
             <div 
              className="absolute inset-0 bg-cover bg-center opacity-80" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop')" }}
            />
          </div>

          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none mb-10">
            <AnimatePresence>
              {currentProduct.image ? (
                <motion.img
                  key={currentIndex}
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50, position: "absolute" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[95%] h-[95%] lg:w-[110%] lg:h-[110%] object-contain drop-shadow-[0_40px_30px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-transform duration-500 pointer-events-auto cursor-pointer relative z-20"
                  onClick={() => window.location.href = `/product/${currentProduct.slug}`}
                />
              ) : (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50, position: "absolute" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[80%] h-[80%] lg:w-[90%] lg:h-[90%] hover:scale-[1.02] transition-transform duration-500 pointer-events-auto cursor-pointer relative z-20 flex items-center justify-center"
                  onClick={() => window.location.href = `/product/${currentProduct.slug}`}
                >
                  <ProductArt category={currentProduct.category} className="w-full h-full drop-shadow-[0_40px_30px_rgba(0,0,0,0.4)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Top Right Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-12 right-0 lg:-right-12 z-30 bg-[#e4e1d9] px-5 py-4 rounded-[20px] shadow-lg flex items-center gap-4 pointer-events-none border border-white/50"
          >
            <div className="flex items-center justify-center text-ink-950">
              <Sparkles className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-medium text-ink-900 leading-tight">Featured</p>
              <p className="text-[12px] font-medium text-ink-900 leading-tight">Item</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-2 w-2 rounded-full bg-[#6a7f5a]" />
                <p className="text-[10px] text-ink-600">On</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Thumbnail Carousel (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute -bottom-6 lg:bottom-12 right-0 lg:-right-12 z-30 bg-[#e4e1d9] pl-4 pr-1 py-1 rounded-[24px] shadow-2xl flex items-center gap-6 pointer-events-auto max-w-[95vw] overflow-x-auto border border-white/50 scrollbar-hide touch-pan-x"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <div className="flex items-center gap-3 shrink-0 py-3">
              {products.map((product, idx) => (
                <button
                  key={product.slug}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-10 w-10 shrink-0 cursor-pointer rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center bg-white border border-sand-200 ${
                    idx === currentIndex
                      ? "ring-1 ring-ink-950 ring-offset-2 scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[120%] h-[120%] object-cover scale-[1.3]" // zoom in on thumbnail like reference
                    />
                  ) : (
                    <ProductArt category={product.category} className="w-[120%] h-[120%] scale-[1.2]" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 shrink-0 bg-[#d9d5cd] rounded-[20px] px-4 py-2 mr-1">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-ink-600 line-clamp-1 max-w-[90px]">
                  {currentProduct.name}
                </span>
                <span className="text-sm font-bold text-ink-900">
                  {formatPrice(currentProduct.price)}
                </span>
              </div>
              <MagneticButton
                href={`/product/${currentProduct.slug}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e231e] text-white transition-colors hover:bg-black"
              >
                <ArrowRight className="h-3 w-3" />
              </MagneticButton>
            </div>
          </motion.div>

        </div>
        </>
        )}
      </div>
    </section>
  );
}
