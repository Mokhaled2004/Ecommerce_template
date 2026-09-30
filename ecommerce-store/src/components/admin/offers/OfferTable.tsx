'use client';

import { Trash2, Edit3, CheckCircle, XCircle, Tag } from 'lucide-react';

interface OfferTableProps {
  offers: any[];
  onEditClick: (offer: any) => void;
  onDeleteClick: (offer: any) => void;
}

export default function OfferTable({ offers, onEditClick, onDeleteClick }: OfferTableProps) {
  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">No offers available. Create one above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Discount</th>
              <th className="py-4 px-6">Target</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Validity</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-[#121214]">{offer.title}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">{offer.description || '—'}</div>
                </td>
                <td className="py-4 px-6 font-semibold text-emerald-600">
                  {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `$${offer.discountValue}`}
                </td>
                <td className="py-4 px-6 text-gray-600 text-xs">
                  {offer.product ? (
                    <span className="font-medium text-gray-800">{offer.product.name}</span>
                  ) : (
                    <span className="text-gray-400 italic">Storewide</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${offer.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {offer.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6 text-xs text-gray-500">
                  {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : 'Now'} → {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'No limit'}
                </td>
                <td className="py-4 px-6 text-right space-x-1">
                  <button
                    onClick={() => onEditClick(offer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors inline-flex items-center justify-center"
                    title="Edit Offer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteClick(offer)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center justify-center"
                    title="Delete Offer"
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