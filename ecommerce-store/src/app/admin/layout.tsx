'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// Import sections (matching your exact directory structure)
import CategoriesSection from '@/components/admin/sections/CategoriesSection';
import ProductsSection from '@/components/admin/sections/ProductsSection';
import VariantsSection from '@/components/admin/sections/VariantsSection';
import PackagesSection from '@/components/admin/sections/PackagesSection';
import OffersSection from '@/components/admin/sections/OffersSection';
import OrdersSection from '@/components/admin/sections/OrdersSection';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return children;
      case 'categories':
        return <CategoriesSection />;
      case 'products':
        return <ProductsSection />;
      case 'variants':
        return <VariantsSection />;
      case 'packages':
        return <PackagesSection />;
      case 'offers':
        return <OffersSection />;
      case 'orders':
        return <OrdersSection />;
      default:
        return children;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gray-100 text-[#121214]">
      {/* Sidebar is locked/fixed in place */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 p-2 sm:p-4 h-full overflow-hidden">
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Only this inner section will scroll when content overflows */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
