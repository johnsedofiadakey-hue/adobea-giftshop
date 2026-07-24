"use client";

import { PageHero } from "@/components/PageHero";
import { PageLoading } from "@/components/PageLoading";
import { ProductCard } from "@/components/ProductCard";
import { useAdminData } from "@/lib/store";
import { getTopSellers } from "@/lib/top-sellers";

export default function BestSellersPage() {
  const { products, orders, loading } = useAdminData();

  if (loading) {
    return <PageLoading />;
  }

  const bestSellers = getTopSellers(products, orders, 12);

  return (
    <div>
      <PageHero eyebrow="Best Sellers" title="Customer Favorites" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {bestSellers.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
