"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from 'next/navigation';
import { CartContents, useCart } from '@/components/cart/CartProvider';

type MenuCategory = { id: string; name: string; slug: string };

interface HeaderProps {
  categories: MenuCategory[];
  user?: {
    name?: string;
    email?: string;
    [key: string]: any;
  } | null;
}

export default function Header({ user, categories: dbCategories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const pathname = usePathname();
  const isShopPage = pathname === '/shop';

  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const categories = [
    { name: 'Home', href: '/' },
    { name: 'Shop all', href: '/shop' },
    ...dbCategories.map((category) => ({ name: category.name, href: `/shop?category=${encodeURIComponent(category.slug)}` })),
    { name: 'Sale', href: '/shop?sale=true' },
  ];

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-50 ${isShopPage ? 'bg-[#121214]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
          
          {/* Left: Burger Menu (Placed cleanly on the left edge) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors focus:outline-none p-2 -ml-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link href="/" className="relative w-16 h-12 block">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain invert brightness-200"
                priority
              />
            </Link>
          </div>

          {/* Right: Actions (Search, Cart, Profile Dropdown / Sign In) */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            {/* Search Icon */}
            <button 
              aria-label="Search" 
              className="text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E11D48] px-1 text-[9px] font-bold text-white">{cartCount > 99 ? '99+' : cartCount}</span>}
            </button>

            {/* Profile Dropdown or Sign In */}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <Link
                  href="/profile"
                  aria-label="Profile"
                  className="w-9 h-9 rounded-full bg-[#1E1E24] border border-[#27272a] hover:border-[#A1A1AA] flex items-center justify-center text-[#FFFFFF] transition-all"
                >
                  <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                {/* Rounded Hover Container: "Hi [Name]" & Logout */}
                <AnimatePresence>
                  {isProfileHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col space-y-3 z-50 backdrop-blur-md"
                    >
                      <div className="px-2 pt-1 border-b border-white/10 pb-2.5">
                        <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Welcome back</span>
                        <span className="text-sm font-bold text-white truncate block">
                          Hi, {user.name || user.email || "User"}
                        </span>
                      </div>
                      
                      <form action="/auth/logout" method="POST">
                        <button
                          type="submit"
                          className="w-full text-left px-2 py-1.5 text-xs font-semibold text-[#E11D48] hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Log Out</span>
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="font-monument bg-[#E11D48] hover:bg-[#be123c] text-[#FFFFFF] text-[10px] tracking-wider px-4 py-2.5 rounded-lg shadow-lg shadow-[#E11D48]/20 transition-all duration-200"
              >
                SIGN IN
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm h-full bg-[#121214] border-r border-white/10 p-8 flex flex-col z-10 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-10">
                <span className="font-monument text-lg font-bold text-white tracking-wider">MENU</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Menu"
                  className="text-[#A1A1AA] hover:text-white transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-monument font-extrabold text-lg uppercase tracking-widest text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding Cart Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#121214] border-l border-white/10 p-8 flex flex-col z-10 shadow-2xl"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <h2 className="font-monument text-lg font-bold text-white tracking-wider">YOUR CART</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close Cart"
                  className="text-[#A1A1AA] hover:text-white transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Body Content */}
              <div className="flex-1 py-6 overflow-y-auto">
                <CartContents />
              </div>

              {/* Cart Footer / Checkout */}
              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#F59E0B] hover:bg-amber-600 text-black font-bold py-3.5 rounded-full transition-all shadow-lg shadow-amber-500/20 text-sm tracking-wider"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
