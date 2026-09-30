'use client';

import { Trash2, Edit3 } from 'lucide-react';
import Image from 'next/image';

// Defined directly in the file so you don't need an external types import
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentCategoryId?: string | null;
  displayOrder: number;
  isActive: boolean;
  metadata: Record<string, unknown>;
}

interface CategoryTableProps {
  categories?: Category[]; // Made optional with default parameter fallback
  onEditClick: (category: Category) => void;
  onDeleteClick: (category: Category) => void;
}

export default function CategoryTable({ categories = [], onEditClick, onDeleteClick }: CategoryTableProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">No categories available. Create one above.</p>
      </div>
    );
  }

  // Create a quick lookup for parent names
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Name & Slug</th>
              <th className="py-4 px-6">Parent Category</th>
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    {cat.imageUrl ? (
                      <Image 
                        src={cat.imageUrl} 
                        alt={cat.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-[#121214]">{cat.name}</div>
                  <div className="text-xs font-mono text-gray-400">/{cat.slug}</div>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {cat.parentCategoryId ? categoryMap.get(cat.parentCategoryId) || 'Sub-category' : <span className="text-gray-400">Top-Level</span>}
                </td>
                <td className="py-4 px-6 font-mono text-gray-600">
                  {cat.displayOrder}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                  {cat.description || '—'}
                </td>
                <td className="py-4 px-6 text-right space-x-1">
                  <button
                    onClick={() => onEditClick(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors inline-flex items-center justify-center"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteClick(cat)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center justify-center"
                    title="Delete Category"
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