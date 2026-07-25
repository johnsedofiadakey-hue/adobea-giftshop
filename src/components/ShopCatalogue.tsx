"use client";

import { useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { OCCASIONS } from "@/lib/products";
import { useAdminData } from "@/lib/store";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export function ShopCatalogue({
  initialCategory,
  initialOccasion,
  initialMaxPrice,
}: {
  initialCategory?: string;
  initialOccasion?: string;
  initialMaxPrice?: number;
}) {
  const { products, categories } = useAdminData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [occasion, setOccasion] = useState(initialOccasion ?? "all");

  // The budget slider's own bounds come from the real catalog, not a guessed range —
  // so it's never narrower than what's actually for sale, and never absurdly wide either.
  const catalogPrices = products.map((p) => p.price);
  const catalogMin = catalogPrices.length ? Math.floor(Math.min(...catalogPrices) / 10) * 10 : 0;
  const catalogMax = catalogPrices.length ? Math.ceil(Math.max(...catalogPrices) / 10) * 10 : 1000;
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ?? catalogMax);

  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesOccasion = occasion === "all" || (p.occasions ?? []).includes(occasion);
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesOccasion && matchesPrice;
    });

    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, query, category, occasion, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-cream-200 bg-cream-100 py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-cream-200 bg-cream-100 px-5 py-3 text-sm font-medium text-ink-900 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-700/70">
              Category
            </h3>
            <div className="mt-3 flex flex-col gap-1">
              <button
                onClick={() => setCategory("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-left text-sm font-medium transition-colors",
                  category === "all"
                    ? "bg-amber-500 text-white"
                    : "text-ink-800 hover:bg-cream-100"
                )}
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "rounded-full px-4 py-2 text-left text-sm font-medium transition-colors",
                    category === c.slug
                      ? "bg-amber-500 text-white"
                      : "text-ink-800 hover:bg-cream-100"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-700/70">
              Occasion
            </h3>
            <div className="mt-3 flex flex-col gap-1">
              <button
                onClick={() => setOccasion("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-left text-sm font-medium transition-colors",
                  occasion === "all" ? "bg-amber-500 text-white" : "text-ink-800 hover:bg-cream-100"
                )}
              >
                Any Occasion
              </button>
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={cn(
                    "rounded-full px-4 py-2 text-left text-sm font-medium transition-colors",
                    occasion === o ? "bg-amber-500 text-white" : "text-ink-800 hover:bg-cream-100"
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-700/70">
                Max Budget
              </h3>
              <span className="text-xs font-semibold text-amber-600">GH₵ {maxPrice}</span>
            </div>
            <input
              type="range"
              min={catalogMin}
              max={catalogMax}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-amber-500"
            />
            <div className="mt-1 flex justify-between text-[11px] text-ink-700/50">
              <span>GH₵ {catalogMin}</span>
              <span>GH₵ {catalogMax}</span>
            </div>
          </div>
        </aside>

        <div>
          <p className="mb-6 text-sm text-ink-700/70">
            {filtered.length} product{filtered.length === 1 ? "" : "s"} found
          </p>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-900/20 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5 text-ink-700/40">
                <PackageSearch className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <p className="text-ink-700/70">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
