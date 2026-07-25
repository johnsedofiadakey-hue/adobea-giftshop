"use client";

import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ShopCatalogue } from "@/components/ShopCatalogue";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const occasion = searchParams.get("occasion") ?? undefined;
  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  return (
    <div>
      <PageHero eyebrow="Our Catalogue" title="All Products" />
      <ShopCatalogue initialCategory={category} initialOccasion={occasion} initialMaxPrice={maxPrice} />
    </div>
  );
}
