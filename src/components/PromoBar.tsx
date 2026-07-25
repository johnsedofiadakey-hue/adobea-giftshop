"use client";

import { Gift, PhoneCall, MapPin } from "lucide-react";

export function PromoBar() {
  return (
    <div className="bg-[#FAF3F3] border-b border-pink-100/50 py-2 px-4 text-xs md:text-sm text-[#5A4245]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <Gift size={16} className="text-[#C86267]" />
          <span>Thoughtful gifts for every occasion. Beautifully packaged. Delivered with love.</span>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <a href="#" className="flex items-center gap-1.5 hover:text-[#C86267] transition-colors">
            <PhoneCall size={14} /> WhatsApp Us
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-[#C86267] transition-colors">
            <MapPin size={14} /> Shop Location
          </a>
        </div>
      </div>
    </div>
  );
}
