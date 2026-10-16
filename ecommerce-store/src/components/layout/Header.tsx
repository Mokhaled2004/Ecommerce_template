"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { CartContents, useCart } from "@/components/cart/CartProvider";
import { Search, ShoppingBag, User, X, Menu, Heart } from "lucide-react";

type MenuCategory = { id: string; name: string; slug: string };

interface HeaderProps {
  categories: MenuCategory[];
  user?: { name?: string; email?: string; [key: string]: unknown } | null;
}

export default function Header({ user, categories: dbCategories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow after scrolling past 40px
      setScrolled(currentScrollY > 40);
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Homepage", href: "/" },
    { name: "New Collections", href: "/shop" },
    ...dbCategories.map((c) => ({ name: c.name, href: `/shop?category=${encodeURIComponent(c.slug)}` })),
    { name: "Offers", href: "/shop?sale=true" },
    { name: "Our Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#3B1A26] text-white text-center text-xs py-2 px-4 tracking-wide">
        Free shipping on orders over $50 — Use code <span className="font-bold text-[#E8A0B0]">BEAUTYA</span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md shadow-pink-100/60" : "bg-white"
        } ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Left nav — desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#C8547A] ${
                  pathname === link.href ? "text-[#C8547A]" : "text-[#1a1a1a]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/icons/Beautya.svg"
                alt="Beautya"
                width={120}
                height={36}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right nav — desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#C8547A] ${
                  pathname === link.href ? "text-[#C8547A]" : "text-[#1a1a1a]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right action icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button aria-label="Search" className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button aria-label="Wishlist" className="hidden sm:block text-[#1a1a1a] hover:text-[#C8547A] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
              className="relative text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center rounded-full bg-[#C8547A] text-white text-[9px] font-bold px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            {user ? (
              <Link href="/profile" aria-label="Profile" className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center gap-1 text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
                aria-label="Sign in"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm h-full bg-white p-8 flex flex-col z-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <Image src="/images/icons/Beautya.svg" alt="Beautya" width={100} height={30} className="h-7 w-auto" />
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="text-[#888] hover:text-[#C8547A] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-semibold text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              {!user && (
                <div className="mt-auto pt-8 border-t border-gray-100">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center py-3 rounded-full bg-[#C8547A] text-white font-semibold text-sm hover:bg-[#b04468] transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white flex flex-col z-10 shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#1a1a1a]">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} aria-label="Close cart" className="text-[#888] hover:text-[#C8547A] transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <CartContents />
              </div>
              <div className="px-6 py-5 border-t border-gray-100">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#C8547A] hover:bg-[#b04468] text-white font-bold py-3.5 rounded-full transition-colors text-sm tracking-wide"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
