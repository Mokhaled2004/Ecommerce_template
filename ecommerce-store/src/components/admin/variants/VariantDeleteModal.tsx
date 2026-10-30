'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface VariantDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  variant: any | null;
}

export default function VariantDeleteModal({ isOpen, onClose, onSuccess, variant }: VariantDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !variant) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/variants/${variant.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete variant');

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#C8547A]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#121214]">Delete Variant</h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete SKU <span className="font-semibold text-gray-700">{variant.sku}</span>? This action cannot be undone.
          </p>
        </div>

        {error && <div className="p-3 bg-pink-50 text-[#C8547A] rounded-xl text-sm">{error}</div>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="px-5 py-2 bg-[#C8547A] text-white rounded-xl text-sm font-semibold hover:bg-[#E8A0B0] disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Variant'}
          </button>
        </div>
      </div>
    </div>
  );
}