"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck, RotateCcw, Leaf, Headphones } from "lucide-react";

const FEATURES = [
  { icon: Truck,        label: "Free Delivery",   sub: "On orders over $50" },
  { icon: RotateCcw,   label: "Easy Returns",     sub: "30-day return policy" },
  { icon: Leaf,        label: "100% Natural",      sub: "No harmful chemicals" },
  { icon: Headphones,  label: "24/7 Support",      sub: "Always here to help" },
];

const FOOTER_LINKS = {
  Products: ["Home Skincare", "Body Care", "Hair Care", "Makeup"],
  "Stay In Touch": [],
};

export default function StoreFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Brand features bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FDF6F8] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#C8547A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{label}</p>
                  <p className="text-xs text-[#888]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/icons/Beautya.svg"
                alt="Beautya"
                width={110}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[#888] leading-relaxed mb-5">
              Premium skincare and cosmetics crafted with love and nature.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#888] hover:border-[#C8547A] hover:text-[#C8547A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#888] hover:border-[#C8547A] hover:text-[#C8547A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#888] hover:border-[#C8547A] hover:text-[#C8547A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#888] hover:border-[#C8547A] hover:text-[#C8547A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* How Can We Help */}
          <div>
            <h4 className="text-sm font-bold text-[#1a1a1a] mb-4 uppercase tracking-wide">How Can We Help?</h4>
            <ul className="space-y-3">
              {["FAQ", "Shipping Info", "Returns & Exchanges", "Track Your Order", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#contact" className="text-sm text-[#888] hover:text-[#C8547A] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold text-[#1a1a1a] mb-4 uppercase tracking-wide">Products</h4>
            <ul className="space-y-3">
              {["Home Skincare", "Toners", "Moisturisers", "Serums", "Eye Creams", "SPF"].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-sm text-[#888] hover:text-[#C8547A] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-[#1a1a1a] mb-4 uppercase tracking-wide">Stay In Touch With Beautya</h4>
            <p className="text-sm text-[#888] mb-4 leading-relaxed">
              Subscribe for exclusive deals, skincare tips, and early access to new launches.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm text-[#1a1a1a] placeholder:text-[#aaa] focus:outline-none focus:border-[#C8547A] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#C8547A] text-white text-sm font-semibold hover:bg-[#b04468] transition-colors flex-shrink-0"
              >
                Join
              </button>
            </form>
            <p className="text-xs text-[#aaa] mt-3">No spam, unsubscribe at any time.</p>

            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-[#888] flex items-center gap-2">
                <Image src="/images/icons/call.svg" alt="" width={14} height={14} className="opacity-60" />
                +1 (555) 010-2020
              </p>
              <p className="text-xs text-[#888] flex items-center gap-2">
                <Image src="/images/icons/location_on.svg" alt="" width={14} height={14} className="opacity-60" />
                New York, USA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image src="/images/icons/copyright.svg" alt="" width={14} height={14} className="opacity-50" />
            <p className="text-xs text-[#888]">
              {new Date().getFullYear()} Beautya. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Image src="/images/icons/bunny vector.svg" alt="Cruelty free" width={28} height={28} className="opacity-70" />
            <span className="text-xs text-[#888]">Cruelty Free</span>
          </div>
          <p className="text-xs text-[#aaa]">Designed by Beautya Studio</p>
        </div>
      </div>
    </footer>
  );
}
