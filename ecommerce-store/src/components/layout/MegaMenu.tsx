'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

interface MegaMenuProps {
  trigger: string;
  isOpen: boolean;
}

const MEGA_MENU_DATA: Record<string, {
  categories: { title: string; items: string[] }[];
  featured?: { image: string; title: string; description: string };
}> = {
  makeup: {
    categories: [
      {
        title: 'By Category',
        items: ['Face', 'Eyes', 'Lips', 'Brushes', 'Palettes', 'Setting Spray'],
      },
      {
        title: 'By Skin Condition',
        items: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Acne-Prone', 'Mature'],
      },
      {
        title: 'Collections',
        items: ['Summer Collection', 'Winter Glow', 'Nude Collection', 'Bold Colors', 'Minimalist', 'Pro Series'],
      },
    ],
    featured: {
      image: '/images/products/makeup-featured.jpg',
      title: 'Flawless Base Collection',
      description: 'Professional-grade foundation and concealer',
    },
  },
  skincare: {
    categories: [
      {
        title: 'By Category',
        items: ['Cleansers', 'Exfoliators', 'Toners', 'Retinols', 'Peels And Masques', 'Moisturizer', 'Night Cream', 'Facial Oil', 'Sunscreen', 'Eye Care'],
      },
      {
        title: 'By Skin Condition',
        items: ['Brightening', 'Hydration', 'Acne', 'Anti-Aging', 'Redness', 'Sensitive Skin', 'Sun Protection'],
      },
      {
        title: 'Collection',
        items: ['Beautya Cleansing', 'Beautya Prestige', 'Beautya Light -In-White', 'Capture Totale', 'Capture Youth', 'Capture Dreamskin', 'One Essential', 'Professional Solution', 'Beautya Hydra Life'],
      },
    ],
    featured: {
      image: '/images/categories/684e015da1d20402a0942815003231d187debdbe.png',
      title: 'Women Skincare',
      description: 'Discover our premium skincare collection for all skin types',
    },
  },
  gifts: {
    categories: [
      {
        title: 'By Price',
        items: ['Under $50', '$50-$100', '$100-$200', '$200+'],
      },
      {
        title: 'By Recipient',
        items: ['For Her', 'For Him', 'Unisex', 'Teens', 'Self-Care'],
      },
      {
        title: 'Gift Sets',
        items: ['Skincare Sets', 'Makeup Sets', 'Travel Sets', 'Luxury Sets', 'Discovery Kits', 'Limited Edition'],
      },
    ],
    featured: {
      image: '/images/products/gifts-featured.jpg',
      title: 'Luxury Gift Collection',
      description: 'Curated gift sets for every occasion',
    },
  },
};

export default function MegaMenu({ trigger, isOpen }: MegaMenuProps) {
  const menuData = MEGA_MENU_DATA[trigger];

  if (!menuData || !isOpen) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Categories */}
              {menuData.categories.map((category, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-[#3B1A26] text-sm mb-4 uppercase tracking-wide">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          className="text-sm text-[#888] hover:text-[#C8547A] transition-colors"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Featured Product */}
              {menuData.featured && (
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-br from-[#FDF6F8] to-[#F9F3F5] rounded-lg overflow-hidden h-full flex flex-col">
                    <div className="flex-1 bg-gray-200 relative overflow-hidden">
                      <img
                        src={menuData.featured.image}
                        alt={menuData.featured.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-[#3B1A26] text-xs mb-2 line-clamp-2">
                        {menuData.featured.title}
                      </h4>
                      <p className="text-[9px] text-[#888] line-clamp-2">
                        {menuData.featured.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
    );
}
