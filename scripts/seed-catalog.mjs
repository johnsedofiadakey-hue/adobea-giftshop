// One-off seed script — writes categories + sample products directly to the
// real Firestore via Admin SDK (bypasses security rules, no admin account
// needed). Mirrors what the Admin -> Dashboard "Seed Sample Catalog" button
// does client-side, just runnable before any staff account exists.
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = "adubeagiftshop";
const app = initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore(app);

const categories = [
  { slug: "for-him", name: "For Him", description: "Gifts he'll actually use" },
  { slug: "for-her", name: "For Her", description: "Thoughtful picks she'll love" },
  { slug: "curated-packages", name: "Curated Packages", description: "Hand-picked gift bundles, ready to give" },
  { slug: "kids", name: "Kids", description: "Gifts that bring out the smiles" },
  { slug: "gift-cards", name: "Gift Cards", description: "Let them pick — with a personal message" },
];

const products = [
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
    description: "A hand-packed hamper of treats, a scented candle, and a keepsake card — ready to give as-is or customize with your own note.",
    colors: [{ name: "Classic", hex: "#C9A227" }],
    sizes: ["Standard"],
    specs: ["Hand-packed by our team", "Ready to give, no extra wrapping needed", "Customizable on request"],
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
    description: "A sharp grooming and accessories set for the man who has everything — solid, useful, and gift-ready.",
    colors: [{ name: "Charcoal", hex: "#1E1E1E" }],
    sizes: ["Standard"],
    specs: ["Comes gift-boxed", "Great for birthdays & anniversaries"],
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
    description: "A pampering set of self-care favorites, beautifully arranged and ready to make her day.",
    colors: [{ name: "Blush", hex: "#e14f82" }],
    sizes: ["Standard"],
    specs: ["Comes gift-boxed", "A note card included on request"],
  },
];

for (const [i, category] of categories.entries()) {
  await db.collection("categories").doc(category.slug).set({ ...category, order: i });
  console.log("category:", category.slug);
}

for (const product of products) {
  await db.collection("products").doc(product.slug).set(product);
  console.log("product:", product.slug);
}

console.log("Done — " + categories.length + " categories, " + products.length + " products.");
