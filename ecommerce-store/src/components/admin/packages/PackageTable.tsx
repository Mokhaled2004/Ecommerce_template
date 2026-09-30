'use client';

import { Edit3, Trash2, CheckCircle, XCircle, Package as PackageIcon, Star } from 'lucide-react';

interface PackageTableProps {
  packages: any[];
  onEdit: (pkg: any) => void;
  onDelete: (pkg: any) => void;
}

export default function PackageTable({ packages, onEdit, onDelete }: PackageTableProps) {
  if (packages.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
        <p className="text-gray-500 font-medium">No packages found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6 w-16">Image</th>
              <th className="py-4 px-6">Package Name</th>
              <th className="py-4 px-6">Pricing</th>
              <th className="py-4 px-6">Included Items</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {packages.map((pkg) => {
              const items = pkg.items || [];

              return (
                <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Package Thumbnail */}
                  <td className="py-4 px-6">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      {pkg.imageUrl ? (
                        <img 
                          src={pkg.imageUrl} 
                          alt={pkg.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PackageIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>

                  {/* Name & Slug */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[#121214] flex items-center gap-1.5">
                      {pkg.name}
                      {pkg.isFeatured && (
                        <span className="text-amber-500" title="Featured Package">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-gray-400">/{pkg.slug}</div>
                  </td>

                  {/* Pricing */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-emerald-600">
                      ${Number(pkg.offeredPrice).toFixed(2)}
                    </div>
                    {pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.offeredPrice) && (
                      <div className="text-xs text-gray-400 line-through">
                        ${Number(pkg.originalPrice).toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Included Items summary */}
                  <td className="py-4 px-6 max-w-xs">
                    {items.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {items.link ?? items.map((item: any) => (
                          <span key={item.id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                            <span className="font-bold text-gray-900 mr-1">{item.quantity}x</span> 
                            {item.productName || 'Product'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No items attached</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${pkg.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      {pkg.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right space-x-1">
                    <button 
                      onClick={() => onEdit(pkg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors inline-flex items-center justify-center"
                      title="Edit Package"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(pkg)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center justify-center"
                      title="Delete Package"
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