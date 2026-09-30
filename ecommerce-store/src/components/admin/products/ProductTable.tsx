'use client';

import { Trash2, Edit3 } from 'lucide-react';
import Image from 'next/image';

interface ProductTableProps {
  products?: any[];
  categories?: any[];
  onEditClick: (product: any) => void;
  onDeleteClick: (product: any) => void;
}

export default function ProductTable({ products = [], categories = [], onEditClick, onDeleteClick }: ProductTableProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">No products available. Create one above.</p>
      </div>
    );
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Product & SKU</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {prod.imageUrl ? (
                      <Image src={prod.imageUrl} alt={prod.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-[#121214]">{prod.name}</div>
                  <div className="text-xs font-mono text-gray-400">SKU: {prod.sku}</div>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {prod.categoryId ? categoryMap.get(prod.categoryId) || 'Uncategorized' : '—'}
                </td>
                <td className="py-4 px-6 font-semibold text-[#121214]">
                  ${Number(prod.price).toFixed(2)}
                </td>
                <td className="py-4 px-6 font-mono text-gray-600">
                  {prod.stock}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${prod.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {prod.isActive ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(prod);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors inline-flex items-center justify-center cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(prod);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center justify-center cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}