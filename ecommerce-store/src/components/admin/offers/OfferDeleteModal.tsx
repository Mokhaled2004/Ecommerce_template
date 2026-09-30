'use client';

import { Loader2, AlertTriangle, X } from 'lucide-react';

interface OfferDeleteModalProps {
  isOpen: boolean;
  offer: any | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading: boolean;
}

export default function OfferDeleteModal({ isOpen, offer, onClose, onConfirm, loading }: OfferDeleteModalProps) {
  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#121214]">Delete Offer</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Are you sure you want to delete <span className="font-semibold text-gray-800">{offer.title}</span>? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(offer.id)}
            className="flex items-center gap-2 px-5 py-2 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Deleting...' : 'Delete Offer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}