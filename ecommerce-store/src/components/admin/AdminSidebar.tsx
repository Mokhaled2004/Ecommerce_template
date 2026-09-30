'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  Layers, 
  Gift, 
  Tag, 
  ShoppingCart, 
  LogOut,
  X 
} from 'lucide-react';
import Image from 'next/image';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: AdminSidebarProps) {
  // Automatically determine if variants or products is active to keep the submenu open
  const isProductsGroupActive = activeTab === 'products' || activeTab === 'variants';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-full lg:h-[calc(100vh-2rem)] 
        w-64 bg-white border-r lg:border border-gray-200 text-[#121214] 
        flex flex-col rounded-none lg:rounded-2xl shadow-lg lg:shadow-sm 
        transition-transform duration-300 ease-in-out lg:my-4 lg:ml-4
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header with Centered Store Logo and Close Button */}
        <div className="p-6 border-b border-gray-100 relative flex items-center justify-center shrink-0">
          <div className="relative w-32 h-8 flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Store Logo" 
              fill 
              sizes="128px"
              className="object-contain object-center" 
              priority
            />
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute right-4 lg:hidden text-gray-500 hover:text-[#121214]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links (Scrollbar hidden) */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-left ${
              activeTab === 'dashboard' ? 'bg-gray-100 text-[#121214] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#121214]'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 transition-colors ${activeTab === 'dashboard' ? 'text-[#E11D48]' : 'text-gray-500 group-hover:text-[#E11D48]'}`} />
            <span>Dashboard</span>
          </button>

          {/* Categories */}
          <button
            onClick={() => { setActiveTab('categories'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-left ${
              activeTab === 'categories' ? 'bg-gray-100 text-[#121214] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#121214]'
            }`}
          >
            <FolderTree className={`w-5 h-5 transition-colors ${activeTab === 'categories' ? 'text-[#E11D48]' : 'text-gray-500 group-hover:text-[#E11D48]'}`} />
            <span>Categories</span>
          </button>

          {/* Products Section with Nested Animated Variants Sub-menu */}
          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('products'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-left ${
                activeTab === 'products' ? 'bg-gray-100 text-[#121214] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#121214]'
              }`}
            >
              <Package className={`w-5 h-5 transition-colors ${activeTab === 'products' ? 'text-[#E11D48]' : 'text-gray-500 group-hover:text-[#E11D48]'}`} />
              <span>Products</span>
            </button>

            {/* Smooth Animated Collapsible Nested Container */}
            <div className={`grid transition-all duration-300 ease-in-out ${isProductsGroupActive ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
              <div className="overflow-hidden">
                <div className="relative pl-6 ml-6 border-l-2 border-gray-100 py-0.5">
                  <button
                    onClick={() => { setActiveTab('variants'); setIsOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group font-medium text-left text-xs ${
                      activeTab === 'variants' 
                        ? 'bg-rose-50 text-[#E11D48] font-semibold shadow-xs' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#121214]'
                    }`}
                  >
                    <Layers className={`w-4 h-4 transition-colors ${activeTab === 'variants' ? 'text-[#E11D48]' : 'text-gray-400 group-hover:text-[#E11D48]'}`} />
                    <span>Variants</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Packages */}
          <button
            onClick={() => { setActiveTab('packages'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-left ${
              activeTab === 'packages' ? 'bg-gray-100 text-[#121214] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#121214]'
            }`}
          >
            <Gift className={`w-5 h-5 transition-colors ${activeTab === 'packages' ? 'text-[#E11D48]' : 'text-gray-500 group-hover:text-[#E11D48]'}`} />
            <span>Packages</span>
          </button>

          {/* Offers */}
          <button
            onClick={() => { setActiveTab('offers'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-left ${
              activeTab === 'offers' ? 'bg-gray-100 text-[#121214] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#121214]'
            }`}
          >
            <Tag className={`w-5 h-5 transition-colors ${activeTab === 'offers' ? 'text-[#E11D48]' : 'text-gray-500 group-hover:text-[#E11D48]'}`} />
            <span>Offers</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => { setActiveTab('orders'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-medium text-left ${
              activeTab === 'orders' ? 'bg-gray-100 text-[#121214] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-[#121214]'
            }`}
          >
            <ShoppingCart className={`w-5 h-5 transition-colors ${activeTab === 'orders' ? 'text-[#E11D48]' : 'text-gray-500 group-hover:text-[#E11D48]'}`} />
            <span>Orders</span>
          </button>

        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <a
            href="/admin-login"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl transition-all text-sm font-semibold shadow-md shadow-rose-600/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </a>
        </div>
      </aside>
    </>
  );
}
