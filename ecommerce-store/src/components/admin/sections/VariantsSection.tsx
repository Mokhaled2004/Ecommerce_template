'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import VariantTable from '@/components/admin/variants/VariantTable';
import VariantAddForm from '@/components/admin/variants/VariantAddForm';
import VariantDeleteModal from '@/components/admin/variants/VariantDeleteModal';

export default function VairantsSection() {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState<any | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<any | null>(null);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/variants');
      const data = await res.json();
      if (Array.isArray(data)) {
        setVariants(data);
      }
    } catch (err) {
      console.error('Failed to fetch variants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const filteredVariants = variants.filter(v => 
    v.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.productName && v.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#121214]">Product Variants</h1>
          <p className="text-sm text-gray-500">Manage custom attributes, pricing, and stock for product options.</p>
        </div>
        <button
          onClick={() => { setVariantToEdit(null); setIsAddOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variant</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by SKU or Product Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E11D48]"
        />
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading variants...</div>
      ) : (
        <VariantTable 
          variants={filteredVariants} 
          onEdit={(variant) => { setVariantToEdit(variant); setIsAddOpen(true); }}
          onDelete={(variant) => setVariantToDelete(variant)}
        />
      )}

      {/* Modals */}
      <VariantAddForm 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchVariants}
        variantToEdit={variantToEdit}
      />

      <VariantDeleteModal 
        isOpen={!!variantToDelete}
        onClose={() => setVariantToDelete(null)}
        onSuccess={fetchVariants}
        variant={variantToDelete}
      />
    </div>
  );
}