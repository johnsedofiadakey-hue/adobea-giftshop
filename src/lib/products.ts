export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type ColorVariant = {
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  badge?: "Best Seller" | "Eco-Friendly" | "New";
  rating: number;
  reviewCount: number;
  price: number;
  compareAtPrice?: number;
  unit: string;
  stock: number;
  description: string;
  colors: ColorVariant[];
  sizes: string[];
  specs: string[];
  image?: string;
  // Which occasions this product suits — powers the homepage Gift Matcher and the
  // Occasion filter on /shop. Optional: untagged products just won't surface when a
  // customer filters by occasion, so tag anything meant to be occasion-discoverable.
  occasions?: string[];
};

// Fixed list so the homepage Gift Matcher and the admin tagging checkboxes always
// stay in sync — add/remove an occasion here and both update together.
export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Graduation / New Job",
  "Thank You",
  "Just Because",
] as const;

// "Best Sellers" is deliberately not a category here — it's computed from real order
// data (see src/lib/top-sellers.ts) and rendered as an extra nav/homepage tile instead
// of a manually-maintained 6th category, so it never goes stale.
export const categories: Category[] = [
  { slug: "for-him", name: "For Him", description: "Gifts he'll actually use" },
  { slug: "for-her", name: "For Her", description: "Thoughtful picks she'll love" },
  { slug: "curated-packages", name: "Curated Packages", description: "Hand-picked gift bundles, ready to give" },
  { slug: "kids", name: "Kids", description: "Gifts that bring out the smiles" },
  { slug: "gift-cards", name: "Gift Cards", description: "Let them pick — with a personal message" },
];

// A small starting catalog so the storefront/admin isn't blank on first look — not
// real inventory. Replace via Admin -> Products (CRUD) or the CSV bulk-import tool.
export const products: Product[] = [
  {
    slug: "classic-gift-hamper",
    name: "Classic Gift Hamper",
    category: "curated-packages",
    categoryLabel: "Curated Packages",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 32,
    price: 250,
    unit: "hamper",
    stock: 25,
    description:
      "A hand-packed hamper of treats, a scented candle, and a keepsake card — ready to give as-is or customize with your own note.",
    colors: [{ name: "Classic", hex: "#C9A227" }],
    sizes: ["Standard"],
    specs: [
      "Hand-packed by our team",
      "Ready to give, no extra wrapping needed",
      "Customizable on request",
    ],
    occasions: ["Birthday", "Thank You", "Just Because"],
  },
  {
    slug: "the-gentlemans-set",
    name: "The Gentleman's Set",
    category: "for-him",
    categoryLabel: "For Him",
    rating: 4.6,
    reviewCount: 18,
    price: 180,
    unit: "set",
    stock: 40,
    description:
      "A sharp grooming and accessories set for the man who has everything — solid, useful, and gift-ready.",
    colors: [{ name: "Charcoal", hex: "#1E1E1E" }],
    sizes: ["Standard"],
    specs: ["Comes gift-boxed", "Great for birthdays & anniversaries"],
    occasions: ["Birthday", "Anniversary", "Graduation / New Job"],
  },
  {
    slug: "her-self-care-set",
    name: "Her Self-Care Set",
    category: "for-her",
    categoryLabel: "For Her",
    badge: "New",
    rating: 4.9,
    reviewCount: 21,
    price: 200,
    unit: "set",
    stock: 35,
    description:
      "A pampering set of self-care favorites, beautifully arranged and ready to make her day.",
    colors: [{ name: "Blush", hex: "#e14f82" }],
    sizes: ["Standard"],
    specs: ["Comes gift-boxed", "A note card included on request"],
    occasions: ["Birthday", "Anniversary", "Thank You"],
  },
  {
    slug: "kids-surprise-box",
    name: "Kids' Surprise Box",
    category: "kids",
    categoryLabel: "Kids",
    rating: 4.7,
    reviewCount: 14,
    price: 120,
    unit: "box",
    stock: 50,
    description: "A playful mix of toys and treats that's guaranteed to bring out the smiles.",
    colors: [{ name: "Bright Mix", hex: "#ffb100" }],
    sizes: ["Standard"],
    specs: ["Age-appropriate items only", "Fun unboxing presentation"],
    occasions: ["Birthday", "Just Because"],
  },
  {
    slug: "gift-card-gh100",
    name: "EA_DUBEA'S GIFT HUB Gift Card — GH₵100",
    category: "gift-cards",
    categoryLabel: "Gift Cards",
    rating: 5,
    reviewCount: 9,
    price: 100,
    unit: "card",
    stock: 999,
    description:
      "Let them choose exactly what they want. Add a personal message and we'll write it in the card by hand — or leave it blank and write your own later.",
    colors: [
      { name: "Gold", hex: "#C9A227" },
      { name: "Rose", hex: "#e14f82" },
      { name: "Charcoal", hex: "#1E1E1E" },
    ],
    sizes: ["Standard"],
    specs: ["Delivered as a printed gift card", "Add a personal message at checkout", "Never expires"],
    occasions: ["Birthday", "Anniversary", "Wedding", "Graduation / New Job", "Thank You", "Just Because"],
  },
];

export function getProductBySlug(list: Product[], slug: string) {
  return list.find((p) => p.slug === slug);
}

export function getProductsByCategory(list: Product[], categorySlug: string) {
  return list.filter((p) => p.category === categorySlug);
}

export function getRelatedProducts(list: Product[], product: Product, count = 3) {
  return list
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, count);
}

export const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "Eco-Friendly": "bg-forest-800 text-cream-50",
  New: "bg-sunset-500 text-white",
};

export function isGiftCardCategory(categorySlug: string) {
  return categorySlug === "gift-cards";
}
