import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  "for-him": "from-ink-950/5 via-sand-100 to-sand-200",
  "for-her": "from-clay-500/15 via-sand-100 to-sand-200",
  "curated-packages": "from-amber-500/15 via-sand-100 to-sand-200",
  kids: "from-sunset-500/20 via-sand-100 to-sand-300",
  "gift-cards": "from-amber-400/20 via-sand-100 to-sand-200",
  "best-sellers": "from-sunset-500/15 via-sand-100 to-sand-200",
};

function ForHimArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3" fill="none">
      <ellipse cx="100" cy="176" rx="36" ry="7" className="fill-ink-900/10" />
      <rect x="46" y="96" width="108" height="72" rx="8" className="fill-forest-700" />
      <rect x="46" y="96" width="108" height="20" className="fill-forest-600" />
      <path d="M92 60 L100 46 L108 60 L102 76 L98 76 Z" className="fill-clay-500" />
      <path d="M94 76 L106 76 L102 140 L100 148 L98 140 Z" className="fill-clay-700" />
    </svg>
  );
}

function ForHerArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3" fill="none">
      <ellipse cx="100" cy="176" rx="36" ry="7" className="fill-ink-900/10" />
      <rect x="54" y="98" width="92" height="70" rx="8" className="fill-clay-500" />
      <rect x="90" y="98" width="20" height="70" className="fill-clay-700" />
      <rect x="54" y="122" width="92" height="14" className="fill-clay-700" />
      <circle cx="84" cy="88" r="13" className="fill-sunset-500" opacity=".9" />
      <circle cx="116" cy="88" r="13" className="fill-sunset-500" opacity=".9" />
      <circle cx="100" cy="76" r="13" className="fill-sunset-500" />
      <circle cx="100" cy="86" r="7" className="fill-amber-400" />
    </svg>
  );
}

function CuratedPackageArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3" fill="none">
      <ellipse cx="100" cy="176" rx="46" ry="7" className="fill-ink-900/10" />
      <path d="M50 110 L150 110 L138 172 L62 172 Z" className="fill-amber-600" />
      <path d="M50 110 L150 110 L146 128 L54 128 Z" className="fill-amber-500" />
      <path
        d="M70 110 Q100 66 130 110"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="6"
        fill="none"
      />
      <circle cx="82" cy="100" r="9" className="fill-clay-500" />
      <circle cx="100" cy="94" r="9" className="fill-sunset-500" />
      <circle cx="118" cy="100" r="9" className="fill-forest-600" />
    </svg>
  );
}

function KidsArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3" fill="none">
      <ellipse cx="100" cy="176" rx="30" ry="7" className="fill-ink-900/10" />
      <path d="M76 62 L96 128" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M124 72 L104 128" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M76 20 Q56 40 76 62 Q96 40 76 20 Z" className="fill-clay-500" />
      <path d="M124 30 Q104 50 124 72 Q144 50 124 30 Z" className="fill-forest-600" />
      <rect x="68" y="128" width="64" height="46" rx="8" className="fill-sunset-500" />
      <rect x="68" y="128" width="64" height="14" className="fill-amber-500" />
    </svg>
  );
}

function GiftCardArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3" fill="none">
      <ellipse cx="100" cy="176" rx="42" ry="7" className="fill-ink-900/10" />
      <rect x="46" y="80" width="108" height="72" rx="10" className="fill-amber-500" />
      <rect
        x="46"
        y="80"
        width="108"
        height="72"
        rx="10"
        stroke="currentColor"
        strokeOpacity=".2"
        strokeWidth="3"
      />
      <rect x="46" y="104" width="108" height="10" className="fill-amber-700" opacity=".5" />
      <circle cx="70" cy="130" r="10" className="fill-sand-50" opacity=".9" />
      <path
        d="M124 106 L128 116 L139 117 L131 124 L133 135 L124 129 L115 135 L117 124 L109 117 L120 116 Z"
        className="fill-sunset-500"
      />
    </svg>
  );
}

function BestSellerArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3" fill="none">
      <path d="M40 88 L100 62 L160 88 L160 158 L100 184 L40 158 Z" className="fill-clay-500" />
      <path d="M40 88 L100 114 L100 184 L40 158 Z" className="fill-amber-600" />
      <path d="M160 88 L100 114 L100 184 L160 158 Z" className="fill-amber-500" />
      <path d="M100 62 L100 184" stroke="currentColor" strokeOpacity=".25" strokeWidth="8" />
      <path d="M40 88 L160 88" stroke="currentColor" strokeOpacity=".25" strokeWidth="8" />
      <path
        d="M100 20 L108 40 L130 42 L113 56 L118 78 L100 66 L82 78 L87 56 L70 42 L92 40 Z"
        className="fill-sunset-500"
      />
    </svg>
  );
}

const ART: Record<string, () => ReactElement> = {
  "for-him": ForHimArt,
  "for-her": ForHerArt,
  "curated-packages": CuratedPackageArt,
  kids: KidsArt,
  "gift-cards": GiftCardArt,
  "best-sellers": BestSellerArt,
};

export function ProductArt({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Art = ART[category] ?? BestSellerArt;
  const tone = TONES[category] ?? "from-amber-400/20 via-sand-100 to-sand-200";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-ink-900 border border-sand-200",
        tone,
        className
      )}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-clay-500/20 blur-2xl" />
      <Art />
    </div>
  );
}
