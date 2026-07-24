import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AdminDataProvider } from "@/lib/store";
import { ThemeInjector } from "@/components/ThemeInjector";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Every page ultimately depends on live Firestore data (products, categories,
// settings, orders) via AdminDataProvider, and the admin portal is auth-gated
// per-request — none of this should be statically prerendered at build time.
// Without this, `next build` tries to evaluate the Firebase client SDK against
// whatever NEXT_PUBLIC_FIREBASE_* is set at build time, which fails outright
// until a real Firebase project's config is in place.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "EA_DUBEA'S GIFT HUB",
  description: "Thoughtful gifting made easy — curated gifts for him, her, and the kids, gift cards, and beautifully packaged orders.",
  openGraph: {
    title: "EA_DUBEA'S GIFT HUB",
    description: "Thoughtful gifting made easy.",
    images: [{ url: "/opengraph-image.png" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AdminDataProvider>
          <ThemeInjector />
          {children}
        </AdminDataProvider>
      </body>
    </html>
  );
}
