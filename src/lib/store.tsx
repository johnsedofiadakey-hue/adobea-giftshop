"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, getSecondaryAuth } from "@/lib/firebase";
import {
  categories as sampleCategories,
  products as sampleProducts,
  type Category,
  type Product,
} from "@/lib/products";
import type { CartLine } from "@/lib/cart-context";

export type OrderStatus =
  | "Pending Review"
  | "Awaiting Payment"
  | "Processing"
  | "Ready for Delivery"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  lines: CartLine[];
  subtotal: number;
  status: OrderStatus;

  // Recipient & delivery (see the client's 10-step brief — Step 6).
  recipientName: string;
  recipientPhone: string;
  deliveryMethod: "Delivery" | "Pickup";
  deliveryLocation?: string; // only meaningful when deliveryMethod === "Delivery"
  preferredDate: string;
  deliveryFeePayer: "customer" | "recipient";
  additionalInfo?: string;

  // Gift packaging (Step 5) — cost is a manual staff quote, not auto-calculated.
  packagingRequested: boolean;
  packagingCost?: number;

  // total = subtotal + (packagingCost ?? 0). Distinct from subtotal because
  // packaging-requested orders don't know their real total until staff quotes it.
  total: number;

  // Payment (Paystack — Mobile Money / Bank Transfer channels).
  paymentMethod?: "mobile_money" | "bank_transfer";
  paymentStatus: "unpaid" | "paid";
  paymentReference?: string;
  paidAt?: string;
};

export type StaffRole = "Admin" | "Sales Staff" | "Inventory Staff";

export type StaffMember = {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
};

export type HeroSettings = {
  badgeText: string;
  headline: string;
  headlineAccent: string;
  subtext: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  statValue: string;
  statLabel: string;
  image: string;
};

export type PromotionSettings = {
  enabled: boolean;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
};

export type WhyUsCard = {
  title: string;
  description: string;
};

export type PageContentSettings = {
  aboutIntro: string;
  aboutStoryTitle: string;
  aboutStoryParagraph1: string;
  aboutStoryParagraph2: string;
  whyUsCards: WhyUsCard[];
  footerTagline: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
};

export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  whatsapp?: string;
};

export type StoreSettings = {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  // Real secret key lives only in the PAYSTACK_SECRET_KEY server env var — never here.
  // `settings` is a public-read Firestore doc (see firestore.rules), same reason
  // ARKESEL_API_KEY/BREVO_API_KEY were kept out of it.
  paystackPublicKey: string;
  smsProvider: string;
  smsSenderId: string;
  emailProvider: string;
  emailFromAddress: string;
  socialLinks: SocialLinks;
  hero: HeroSettings;
  promotion: PromotionSettings;
  theme: ThemeSettings;
  pageContent: PageContentSettings;
};

const DEFAULT_HERO: HeroSettings = {
  badgeText: "Thoughtful Gifting Made Easy",
  headline: "Some Gifts Are",
  headlineAccent: "Remembered Forever",
  subtext:
    "We're here to help you find one of them. Explore our carefully curated collection and discover the perfect gift, all in one place.",
  ctaPrimaryLabel: "Start Shopping",
  ctaPrimaryHref: "/shop",
  ctaSecondaryLabel: "Our Story",
  ctaSecondaryHref: "/about",
  statValue: "100%",
  statLabel: "Gift-Wrapped With Care",
  image: "",
};

const DEFAULT_PROMOTION: PromotionSettings = {
  enabled: false,
  text: "New arrivals just dropped — shop the latest gift collections.",
  ctaLabel: "Shop Now",
  ctaHref: "/shop",
};

// Matches the --theme-* defaults in src/app/globals.css — keep both in sync.
// White / Warm Cream / Gold / Charcoal, per the client's brand brief.
export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: "#C9A227",
  secondaryColor: "#1E1E1E",
  accentColor: "#E4B93C",
  textColor: "#2A2A2A",
  backgroundColor: "#ffffff",
};

const DEFAULT_PAGE_CONTENT: PageContentSettings = {
  aboutIntro:
    "EA_DUBEA'S GIFT HUB started with a simple belief: every gift should feel personal. We hand-pick, package, and deliver every order ourselves — thoughtful gifting, made easy.",
  aboutStoryTitle: "From a Small Idea to a Gift Hub",
  aboutStoryParagraph1:
    "It started with friends and family asking for help finding the right gift for the right person — something more thoughtful than a last-minute run to the mall. That habit of getting gifting right, every time, became EA_DUBEA'S GIFT HUB.",
  aboutStoryParagraph2:
    "Today the collection spans gifts for him, for her, for the kids, curated gift packages, and gift cards — each order packed with care and, if you'd like, professionally gift-wrapped before it reaches your recipient.",
  whyUsCards: [
    {
      title: "Curated, Not Random",
      description:
        "For Him, For Her, Kids, Curated Packages, Gift Cards — every category is hand-picked so you can find the right gift fast.",
    },
    {
      title: "Gift-Ready Packaging",
      description:
        "Want it wrapped? Tell us what's in your order and we'll quote a professional gift-packaging option before you pay.",
    },
    {
      title: "Delivery or Pickup, Your Choice",
      description:
        "Have it delivered to your recipient or pick it up yourself — either way, you choose who covers the delivery fee.",
    },
    {
      title: "A Personal Touch",
      description:
        "Add a message to any gift card — we'll write it in by hand, exactly as you send it.",
    },
  ],
  footerTagline: "Thoughtful gifting, made easy — for him, for her, and everyone in between.",
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "EA_DUBEA'S GIFT HUB",
  storePhone: "024 031 6093",
  storeEmail: "hello@adubeagifthub.com",
  paystackPublicKey: "",
  smsProvider: "Arkesel",
  smsSenderId: "AdubeaGift",
  emailProvider: "Brevo",
  emailFromAddress: "orders@adubeagifthub.com",
  socialLinks: {
    instagram: "EA_DUBEA_GIFTHUB",
    tiktok: "@giftshop_gh",
    snapchat: "adub_ea",
    whatsapp: "Adubea Giftshop",
  },
  hero: DEFAULT_HERO,
  promotion: DEFAULT_PROMOTION,
  theme: DEFAULT_THEME,
  pageContent: DEFAULT_PAGE_CONTENT,
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

// Firestore's client SDK rejects `undefined` field values outright (invalid-argument),
// unlike `null` — but optional fields built from form state (e.g. Order.altPhone,
// Order.email, CartLine.giftMessage via `value || undefined`) naturally end up
// `undefined` when left blank. Recurses into arrays/nested objects too — an order's
// `lines` array is exactly where this bit us: a plain (non-gift-card) cart line still
// carries an explicit `giftMessage: undefined` key in memory, and a top-level-only
// strip doesn't reach it. Every doc write goes through this so an empty optional field
// never turns into a hard checkout failure.
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    ) as T;
  }
  return value;
}

type AdminDataContextValue = {
  products: Product[];
  categories: Category[];
  orders: Order[];
  staff: StaffMember[];
  posts: BlogPost[];
  settings: StoreSettings;
  loading: boolean;

  addProduct: (input: Omit<Product, "slug"> & { slug?: string }) => Promise<Product>;
  updateProduct: (slug: string, patch: Partial<Product>) => Promise<void>;
  removeProduct: (slug: string) => Promise<void>;

  addCategory: (input: Omit<Category, "slug"> & { slug?: string }) => Promise<Category>;
  updateCategory: (slug: string, patch: Partial<Category>) => Promise<void>;
  removeCategory: (slug: string) => Promise<void>;
  reorderCategories: (orderedSlugs: string[]) => Promise<void>;

  // `total` isn't caller-supplied — it starts equal to `subtotal` (packaging cost, if
  // any, isn't known until staff quotes it via setPackagingQuote below).
  addOrder: (
    input: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus" | "total">
  ) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  setPackagingQuote: (id: string, packagingCost: number) => Promise<void>;

  addStaff: (input: {
    name: string;
    email: string;
    password: string;
    role: StaffRole;
    active: boolean;
  }) => Promise<StaffMember>;
  updateStaff: (id: string, patch: Partial<Omit<StaffMember, "id">>) => Promise<void>;
  removeStaff: (id: string) => Promise<void>;

  addPost: (input: Omit<BlogPost, "slug"> & { slug?: string }) => Promise<BlogPost>;
  updatePost: (slug: string, patch: Partial<BlogPost>) => Promise<void>;
  removePost: (slug: string) => Promise<void>;

  updateSettings: (patch: Partial<StoreSettings>) => Promise<void>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  // Seeded with the static sample catalog so the storefront has real content to show
  // before Firestore's first snapshot arrives (or if Firestore is unreachable, e.g. no
  // project configured yet in local dev) — overwritten the moment a real snapshot lands,
  // even with an empty array, since that's a legitimate "no products yet" state.
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [readyFlags, setReadyFlags] = useState({
    products: false,
    categories: false,
    settings: false,
  });

  useEffect(() => {
    // Both subscriptions also flip their ready flag on error (e.g. no Firestore project
    // configured yet, or a transient network/permission failure) — without this, a
    // products/categories read that never resolves leaves every page gating on `loading`
    // stuck in a permanent spinner instead of falling back to the seeded sample data above.
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        // An empty snapshot served from cache (metadata.fromCache) just means "no local
        // cache yet, waiting on the network" — not a confirmed empty catalog. Only trust
        // an empty result once it's server-confirmed, so the seeded sample data above
        // doesn't flash to a blank grid while the real snapshot is still in flight.
        if (snap.docs.length > 0 || !snap.metadata.fromCache) {
          setProducts(snap.docs.map((d) => ({ ...(d.data() as Product), slug: d.id })));
        }
        setReadyFlags((f) => ({ ...f, products: true }));
      },
      () => setReadyFlags((f) => ({ ...f, products: true }))
    );
    const unsubCategories = onSnapshot(
      query(collection(db, "categories"), orderBy("order")),
      (snap) => {
        if (snap.docs.length > 0 || !snap.metadata.fromCache) {
          setCategories(snap.docs.map((d) => ({ ...(d.data() as Category), slug: d.id })));
        }
        setReadyFlags((f) => ({ ...f, categories: true }));
      },
      () => setReadyFlags((f) => ({ ...f, categories: true }))
    );
    // Orders and staff are staff-only reads per firestore.rules (customer order details and
    // the staff roster are both private) — but AdminDataProvider is mounted for every visitor,
    // signed in or not, since the storefront needs the rest of this provider's data too. For a
    // signed-out visitor these two subscriptions are expected to fail with permission-denied;
    // the second callback swallows that instead of leaving it as an uncaught console error.
    // orders/staff simply stay empty for anonymous visitors, which the storefront already
    // handles gracefully (e.g. getTopSellers() falls back when there's no order data).
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snap) => {
        setOrders(snap.docs.map((d) => ({ ...(d.data() as Order), id: d.id })));
      },
      () => {}
    );
    const unsubStaff = onSnapshot(
      collection(db, "staff"),
      (snap) => {
        setStaff(snap.docs.map((d) => ({ ...(d.data() as StaffMember), id: d.id })));
      },
      () => {}
    );
    const unsubPosts = onSnapshot(
      query(collection(db, "posts"), orderBy("date", "desc")),
      (snap) => {
        setPosts(snap.docs.map((d) => ({ ...(d.data() as BlogPost), slug: d.id })));
      }
    );
    const unsubSettings = onSnapshot(doc(db, "settings", "store"), (snap) => {
      if (snap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...(snap.data() as Partial<StoreSettings>) });
      }
      setReadyFlags((f) => ({ ...f, settings: true }));
    });

    // Belt-and-suspenders: a real-time onSnapshot listener can hang indefinitely with
    // neither its success nor error callback ever firing — observed against a Firestore
    // project that doesn't exist (e.g. no Firebase project configured yet in local dev),
    // and plausible in production too against a blocked/flaky network (ad blockers and
    // some corporate firewalls block Firestore's WebChannel stream outright). Without this,
    // every page that gates on `loading` shows a permanent spinner instead of falling back
    // to whatever's already in local state (the seeded sample catalog, or a stale-but-usable
    // cache). 6s is generous — a healthy connection resolves in well under a second.
    const readyTimeout = setTimeout(() => {
      setReadyFlags((f) => ({ ...f, products: true, categories: true }));
    }, 6000);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubStaff();
      unsubPosts();
      unsubSettings();
      clearTimeout(readyTimeout);
    };
  }, []);

  const addProduct = async (input: Omit<Product, "slug"> & { slug?: string }) => {
    const slug = input.slug ?? slugify(input.name);
    const product: Product = { ...input, slug } as Product;
    await setDoc(doc(db, "products", slug), stripUndefined(product));
    return product;
  };

  const updateProduct = async (slug: string, patch: Partial<Product>) => {
    await updateDoc(doc(db, "products", slug), stripUndefined(patch));
  };

  const removeProduct = async (slug: string) => {
    await deleteDoc(doc(db, "products", slug));
  };

  const addCategory = async (input: Omit<Category, "slug"> & { slug?: string }) => {
    const slug = input.slug ?? slugify(input.name);
    const category = { ...input, slug };
    await setDoc(doc(db, "categories", slug), { ...category, order: categories.length });
    return category;
  };

  const updateCategory = async (slug: string, patch: Partial<Category>) => {
    await updateDoc(doc(db, "categories", slug), stripUndefined(patch));
  };

  const removeCategory = async (slug: string) => {
    await deleteDoc(doc(db, "categories", slug));
  };

  const reorderCategories = async (orderedSlugs: string[]) => {
    await Promise.all(
      orderedSlugs.map((slug, index) => updateDoc(doc(db, "categories", slug), { order: index }))
    );
  };

  const addOrder = async (
    input: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus" | "total">
  ) => {
    const id = uid("ord").toUpperCase();
    const order: Order = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
      // Packaging requested -> needs a staff quote before it can be paid for.
      // No packaging -> the total is already known, so it goes straight to payment.
      status: input.packagingRequested ? "Pending Review" : "Awaiting Payment",
      paymentStatus: "unpaid",
      total: input.subtotal,
    };
    await setDoc(doc(db, "orders", id), stripUndefined(order));
    return order;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateDoc(doc(db, "orders", id), { status });
  };

  const setPackagingQuote = async (id: string, packagingCost: number) => {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error(`Order ${id} not found`);
    await updateDoc(doc(db, "orders", id), {
      packagingCost,
      total: order.subtotal + packagingCost,
      status: "Awaiting Payment",
    });
  };

  const addStaff = async (input: {
    name: string;
    email: string;
    password: string;
    role: StaffRole;
    active: boolean;
  }) => {
    const secondaryAuth = getSecondaryAuth();
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      input.email,
      input.password
    );
    const newUid = credential.user.uid;
    await signOut(secondaryAuth);

    const staffMember: StaffMember = {
      id: newUid,
      name: input.name,
      email: input.email,
      role: input.role,
      active: input.active,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "staff", newUid), staffMember);
    return staffMember;
  };

  const updateStaff = async (id: string, patch: Partial<Omit<StaffMember, "id">>) => {
    await updateDoc(doc(db, "staff", id), stripUndefined(patch));
  };

  const removeStaff = async (id: string) => {
    await deleteDoc(doc(db, "staff", id));
  };

  const addPost = async (input: Omit<BlogPost, "slug"> & { slug?: string }) => {
    const slug = input.slug ?? slugify(input.title);
    const post: BlogPost = { ...input, slug } as BlogPost;
    await setDoc(doc(db, "posts", slug), post);
    return post;
  };

  const updatePost = async (slug: string, patch: Partial<BlogPost>) => {
    await updateDoc(doc(db, "posts", slug), stripUndefined(patch));
  };

  const removePost = async (slug: string) => {
    await deleteDoc(doc(db, "posts", slug));
  };

  const updateSettings = async (patch: Partial<StoreSettings>) => {
    await setDoc(doc(db, "settings", "store"), patch, { merge: true });
  };

  // Storefront pages only ever need products/categories, and are reachable by
  // signed-out visitors — settings is staff-only, so it must not gate the
  // public loading state (it would never resolve for an anonymous visitor).
  const loading = !(readyFlags.products && readyFlags.categories);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      products,
      categories,
      orders,
      staff,
      posts,
      settings,
      loading,
      addProduct,
      updateProduct,
      removeProduct,
      addCategory,
      updateCategory,
      removeCategory,
      reorderCategories,
      addOrder,
      updateOrderStatus,
      setPackagingQuote,
      addStaff,
      updateStaff,
      removeStaff,
      addPost,
      updatePost,
      removePost,
      updateSettings,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, categories, orders, staff, posts, settings, loading]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
