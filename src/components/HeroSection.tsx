"use client";

import { Gift, Package, Truck, Award, Heart, User, ArrowRight, Mail, Smile } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="w-full bg-[#FFF9F9] font-sans antialiased text-[#2A2A2A] relative overflow-hidden">
      {/* Main Hero Area */}
      <section className="relative min-h-[620px] flex items-center">
        
        {/* Absolute Background Image (Right side visual composition) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-gift-box.jpg" 
            alt="Gift Box Setup" 
            className="w-full h-full object-cover object-right"
          />
          {/* Radial & Horizontal Light Fade Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF3F3] via-[#FAF3F3]/85 to-transparent w-full md:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3F3]/50 via-transparent to-[#FAF3F3]/30" />
        </div>

        {/* Content Layer */}
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider text-gray-600 uppercase">
              <span>WELCOME TO EA_DUBEA&apos;S GIFTHUB</span>
              <Heart size={14} className="fill-[#C86267] text-[#C86267]" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2A2A2A] leading-[1.15] font-normal">
              Thoughtful Gifts, <br />
              Made <span className="text-[#C86267] italic font-serif">Beautiful.</span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-600 text-base md:text-lg max-w-md leading-relaxed">
              From heartfelt surprises to life&apos;s biggest moments, we help you gift love in the most beautiful way.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/shop" 
                className="bg-[#C86267] hover:bg-[#b05257] text-white text-xs md:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md shadow-sm transition-all text-center min-w-[160px]"
              >
                SHOP NOW
              </Link>
              <Link 
                href="#" 
                className="border border-[#D89B9E] text-[#C86267] hover:bg-[#FAF3F3] text-xs md:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-all text-center min-w-[160px] bg-white/50 backdrop-blur-sm"
              >
                BUILD YOUR BOX
              </Link>
            </div>


          </div>
        </div>
      </section>

      {/* Bottom Floating Quick Category Navigation Bar */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-6 pb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-pink-100/60 p-4 md:p-6 grid grid-cols-2 md:grid-cols-6 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
            <div className="p-2 bg-pink-50 rounded-lg text-[#C86267]">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">For Him</p>
              <Link href="/category/for-him" className="text-[11px] text-gray-500 hover:text-[#C86267] flex items-center gap-0.5">
                Shop Now <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
            <div className="p-2 bg-pink-50 rounded-lg text-[#C86267]">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">For Her</p>
              <Link href="/category/for-her" className="text-[11px] text-gray-500 hover:text-[#C86267] flex items-center gap-0.5">
                Shop Now <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
            <div className="p-2 bg-pink-50 rounded-lg text-[#C86267]">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Curated packages</p>
              <Link href="/category/curated-packages" className="text-[11px] text-gray-500 hover:text-[#C86267] flex items-center gap-0.5">
                Shop Now <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
            <div className="p-2 bg-pink-50 rounded-lg text-[#C86267]">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Best sellers</p>
              <Link href="/best-sellers" className="text-[11px] text-gray-500 hover:text-[#C86267] flex items-center gap-0.5">
                Shop Now <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
            <div className="p-2 bg-pink-50 rounded-lg text-[#C86267]">
              <Smile size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Kids</p>
              <Link href="/category/kids" className="text-[11px] text-gray-500 hover:text-[#C86267] flex items-center gap-0.5">
                Shop Now <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
            <div className="p-2 bg-pink-50 rounded-lg text-[#C86267]">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Message Card</p>
              <Link href="/shop" className="text-[11px] text-gray-500 hover:text-[#C86267] flex items-center gap-0.5">
                Shop Now <ArrowRight size={10} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
