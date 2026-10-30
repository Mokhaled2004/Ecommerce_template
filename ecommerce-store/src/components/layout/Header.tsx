'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { CartContents, useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import SearchModal from "@/components/search/SearchModal";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import { Search, ShoppingBag, User, X, Menu, Heart, LogOut } from "lucide-react";

type MenuCategory = { id: string; name: string; slug: string };

interface HeaderProps {
  categories: MenuCategory[];
  user?: { name?: string; email?: string; [key: string]: unknown } | null;
}

export default function Header({ user, categories: dbCategories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is logged in on mount and when user prop changes
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect regardless of response, as cookie will be deleted
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if fetch fails
      window.location.href = '/auth/login';
    }
  };

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
    { name: "Women's Makeup", href: "/category/makeup" },
    { name: "Women Skincare", href: "/category/skincare" },
    { name: "Gifts & Sets", href: "/category/gifts" },
    { name: "Our Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

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

          {/* Left: Logo + Mobile hamburger */}
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
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
          </div>

          {/* Center: Navigation links — desktop only */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.slice(0, 4).map((link) => {
              // Check if this is a category link (has /category/ in href)
              const isCategory = link.href.includes('/category/');
              const categorySlug = isCategory ? link.href.split('/category/')[1] : null;
              
              if (isCategory && categorySlug) {
                return (
                  <div 
                    key={link.name}
                    onMouseEnter={() => {
                      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
                      setActiveMenu(categorySlug);
                    }}
                    onMouseLeave={() => {
                      menuTimeoutRef.current = setTimeout(() => {
                        setActiveMenu(null);
                      }, 300);
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors hover:text-[#C8547A] ${
                        pathname === link.href ? "text-[#C8547A]" : "text-[#1a1a1a]"
                      }`}
                    >
                      {link.name}
                    </Link>
                    <AnimatePresence>
                      {activeMenu === categorySlug && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => {
                            if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
                            setActiveMenu(categorySlug);
                          }}
                          onMouseLeave={() => {
                            menuTimeoutRef.current = setTimeout(() => {
                              setActiveMenu(null);
                            }, 300);
                          }}
                          className="absolute left-1/2 -translate-x-1/2 top-full bg-white shadow-xl border-t-4 border-[#C8547A] z-50 w-screen"
                        >
                          <MegaMenu trigger={categorySlug} isOpen={true} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#C8547A] ${
                    pathname === link.href ? "text-[#C8547A]" : "text-[#1a1a1a]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: More nav + action icons */}
          <div className="flex items-center gap-6">
            {/* Right nav — desktop */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.slice(4).map((link) => (
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
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block text-[#1a1a1a] hover:text-[#C8547A] transition-colors relative">
              <Heart
                className="w-5 h-5"
                fill={wishlistCount > 0 ? "#C8547A" : "none"}
                color={wishlistCount > 0 ? "#C8547A" : "currentColor"}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center rounded-full bg-[#C8547A] text-white text-[9px] font-bold px-1">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
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
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User menu"
                  className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors mt-0.5"
                >
                  <User className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-[#1a1a1a]">{user.name}</p>
                        <p className="text-xs text-[#888]">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-pink-50 hover:text-[#C8547A] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                        }}
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        navLinks={navLinks.slice(0, 4)}
        onSearch={() => setIsSearchOpen(true)}
      />

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
