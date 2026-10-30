'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ArrowLeft } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  onSearch: () => void;
}

export default function MobileMenu({ isOpen, onClose, navLinks, onSearch }: MobileMenuProps) {
  const [menuLevel, setMenuLevel] = useState<'main' | 'category' | 'subcategory'>('main');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setMenuLevel('category');
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    setSelectedSubcategory(subcategoryName);
    setMenuLevel('subcategory');
  };

  const handleBack = () => {
    if (menuLevel === 'subcategory') {
      setMenuLevel('category');
      setSelectedSubcategory(null);
    } else if (menuLevel === 'category') {
      setMenuLevel('main');
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  };

  const handleClose = () => {
    onClose();
    setMenuLevel('main');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const categoryContent: Record<string, { items: Array<{ name: string; subcategories?: string[] }> }> = {
    'Women Skincare': {
      items: [
        { name: 'Shop all skincare', subcategories: [] },
        {
          name: 'By Category',
          subcategories: [
            'Cleansers',
            'Exfoliators',
            'Toners',
            'Retinols',
            'Peels And Masques',
            'Moisturizer',
            'Night Cream',
            'Facial Oil',
            'Sunscreen',
            'Eye Care',
          ],
        },
        {
          name: 'By Skin Condition',
          subcategories: [
            'Brightening',
            'Hydration',
            'Acne',
            'Anti-Aging',
            'Redness',
            'Sensitive Skin',
            'Sun Protection',
          ],
        },
        {
          name: 'Collection',
          subcategories: [
            'Beautya Cleansing',
            'Beautya Prestige',
            'Beautya Light -In-White',
            'Capture Totale',
            'Capture Youth',
            'Capture Dreamskin',
            'One Essential',
            'Professional Solution',
            'Beautya Hydra Life',
          ],
        },
        { name: 'New', subcategories: [] },
        { name: 'Best sellers', subcategories: [] },
        { name: 'Travel size', subcategories: [] },
        { name: 'Professional treatments', subcategories: [] },
        { name: 'Daily defense', subcategories: [] },
        { name: 'Virtual Skincare Analysis', subcategories: [] },
      ],
    },
    "Women's Makeup": {
      items: [
        { name: 'Shop all makeup', subcategories: [] },
        {
          name: 'By Category',
          subcategories: [
            'Face',
            'Eyes',
            'Lips',
            'Brushes',
            'Palettes',
            'Setting Spray',
          ],
        },
        {
          name: 'By Skin Condition',
          subcategories: [
            'Oily',
            'Dry',
            'Combination',
            'Sensitive',
            'Acne-Prone',
            'Mature',
          ],
        },
        {
          name: 'Collections',
          subcategories: [
            'Summer Collection',
            'Winter Glow',
            'Nude Collection',
            'Bold Colors',
            'Minimalist',
            'Pro Series',
          ],
        },
        { name: 'Trending', subcategories: [] },
        { name: 'New arrivals', subcategories: [] },
        { name: 'Best sellers', subcategories: [] },
        { name: 'Professional picks', subcategories: [] },
      ],
    },
    'Gifts & Sets': {
      items: [
        { name: 'Shop all gifts', subcategories: [] },
        {
          name: 'By Price',
          subcategories: [
            'Under $50',
            '$50-$100',
            '$100-$200',
            '$200+',
          ],
        },
        {
          name: 'By Recipient',
          subcategories: [
            'For Her',
            'For Him',
            'For Teens',
            'For Parents',
          ],
        },
        {
          name: 'Gift Sets',
          subcategories: [
            'Luxury Gift Sets',
            'Travel Size Sets',
            'Discovery Kits',
            'Skincare Bundles',
          ],
        },
        { name: 'Luxury gifts', subcategories: [] },
        { name: 'Travel sets', subcategories: [] },
        { name: 'Discovery kits', subcategories: [] },
      ],
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-80 h-full bg-white flex flex-col z-10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <button
                onClick={handleClose}
                className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <Image src="/images/icons/Beautya.svg" alt="Beautya" width={100} height={30} className="h-7 w-auto" />
              <button
                onClick={() => {
                  onSearch();
                  handleClose();
                }}
                className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content with Slide Animation */}
            <div className="flex-1 overflow-hidden">
              <motion.div
                initial={false}
                animate={{
                  x: menuLevel === 'main' ? 0 : menuLevel === 'category' ? '-100%' : '-200%',
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="flex h-full w-full"
              >
                {/* Main Menu */}
                <div className="w-full flex-shrink-0 overflow-y-auto flex flex-col">
                  <nav className="flex flex-col p-4 flex-1">
                    {navLinks.map((link) => {
                      const isCategory = link.href.includes('/category/');
                      const categoryName = link.name;

                      if (isCategory) {
                        return (
                          <button
                            key={link.name}
                            onClick={() => handleCategoryClick(categoryName)}
                            className="flex items-center justify-between py-4 px-0 text-base font-semibold text-[#1a1a1a] hover:text-[#C8547A] border-b border-gray-100 transition-colors gap-2"
                          >
                            <span className="flex-1 text-left">{link.name}</span>
                            <span className="text-[#C8547A] flex-shrink-0">›</span>
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={handleClose}
                          className="py-4 px-0 text-base font-semibold text-[#1a1a1a] hover:text-[#C8547A] border-b border-gray-100 transition-colors"
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Blog and Contact Section */}
                  <div className="border-t border-gray-100 p-4 space-y-0">
                    <Link
                      href="#blog"
                      onClick={handleClose}
                      className="py-4 px-0 text-base font-semibold text-[#1a1a1a] hover:text-[#C8547A] border-b border-gray-100 transition-colors block"
                    >
                      Our Blog
                    </Link>
                    <Link
                      href="#contact"
                      onClick={handleClose}
                      className="py-4 px-0 text-base font-semibold text-[#1a1a1a] hover:text-[#C8547A] transition-colors block"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Category Submenu (Level 2) */}
                <div className="w-full flex-shrink-0 overflow-y-auto">
                  <div className="p-4">
                    {/* Back Button */}
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 py-4 px-0 text-base font-semibold text-[#1a1a1a] hover:text-[#C8547A] transition-colors mb-4 border-b border-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{selectedCategory}</span>
                    </button>

                    {/* Category Items */}
                    <div className="space-y-0 mt-4">
                      {selectedCategory && categoryContent[selectedCategory]?.items.map((item) => {
                        const hasSubcategories = item.subcategories && item.subcategories.length > 0;
                        let href = '#';
                        if (item.name.includes('Shop all')) {
                          const categorySlug = selectedCategory === 'Women Skincare' ? 'skincare' : 
                                             selectedCategory === "Women's Makeup" ? 'makeup' : 'gifts';
                          href = `/category/${categorySlug}`;
                        }
                        
                        if (hasSubcategories) {
                          return (
                            <button
                              key={item.name}
                              onClick={() => handleSubcategoryClick(item.name)}
                              className="flex items-center justify-between w-full py-4 px-0 text-base text-[#1a1a1a] hover:text-[#C8547A] border-b border-gray-100 transition-colors text-left gap-2"
                            >
                              <span className="flex-1">{item.name}</span>
                              <span className="text-[#C8547A] flex-shrink-0">›</span>
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.name}
                            href={href}
                            onClick={() => {
                              if (href !== '#') handleClose();
                            }}
                            className="flex items-center justify-between w-full py-4 px-0 text-base text-[#1a1a1a] hover:text-[#C8547A] border-b border-gray-100 transition-colors text-left gap-2"
                          >
                            <span className="flex-1">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Subcategory Submenu (Level 3) */}
                <div className="w-full flex-shrink-0 overflow-y-auto">
                  <div className="p-4">
                    {/* Back Button */}
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 py-4 px-0 text-base font-semibold text-[#1a1a1a] hover:text-[#C8547A] transition-colors mb-4 border-b border-gray-100"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{selectedSubcategory}</span>
                    </button>

                    {/* Subcategory Items */}
                    <div className="space-y-0 mt-4">
                      {selectedCategory && selectedSubcategory && 
                        categoryContent[selectedCategory]?.items
                          .find(item => item.name === selectedSubcategory)
                          ?.subcategories?.map((subitem) => (
                            <Link
                              key={subitem}
                              href={`#`}
                              className="flex items-center justify-between w-full py-4 px-0 text-base text-[#1a1a1a] hover:text-[#C8547A] border-b border-gray-100 transition-colors text-left gap-2"
                            >
                              <span className="flex-1">{subitem}</span>
                            </Link>
                          ))
                      }
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
