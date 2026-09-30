'use client';

import { Edit, Trash2, CheckCircle, XCircle, Package } from 'lucide-react';
import Image from 'next/image';

interface VariantTableProps {
  variants: any[];
  onEdit: (variant: any) => void;
  onDelete: (variant: any) => void;
}

export default function VariantTable({ variants, onEdit, onDelete }: VariantTableProps) {
  if (variants.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-xs">
        <p className="text-gray-500 font-medium">No variants found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-16">Image</th>
              <th className="py-3 px-4">Variant SKU</th>
              <th className="py-3 px-4">Parent Product</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Attributes (Metadata)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {variants.map((variant) => {
              const metadataObj = variant.metadata || {};
              const metadataEntries = Object.entries(metadataObj);
              const displayPrice = variant.price ?? variant.productBasePrice;

              return (
                <tr key={variant.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Variant Image Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                      {variant.imageUrl ? (
                        <img 
                          src={variant.imageUrl} 
                          alt={variant.sku} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#121214]">{variant.sku}</td>
                  <td className="py-3 px-4 text-gray-600">{variant.productName || 'Unknown Product'}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">
                    {displayPrice ? (
                      <div className="flex items-center gap-1.5">
                        <span>${Number(displayPrice).toFixed(2)}</span>
                        {!variant.price && (
                          <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded" title="Inherited from parent product">
                            Inherited
                          </span>
                        )}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      variant.stock > 10 ? 'bg-emerald-50 text-emerald-700' : variant.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {variant.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    {metadataEntries.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {metadataEntries.map(([key, value]) => (
                          <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200">
                            <span className="font-semibold text-gray-900 mr-1">{key}:</span> {String(value)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No attributes</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {variant.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button 
                      onClick={() => onEdit(variant)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Variant"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(variant)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}