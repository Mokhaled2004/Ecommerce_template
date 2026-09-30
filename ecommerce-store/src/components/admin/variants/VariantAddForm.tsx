'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';

interface VariantAddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  variantToEdit?: any | null;
}

interface AttributeRow {
  key: string;
  value: string;
}

export default function VariantAddForm({ isOpen, onClose, onSuccess, variantToEdit }: VariantAddFormProps) {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [isActive, setIsActive] = useState(true);
  
  // Key-value attributes state
  const [attributes, setAttributes] = useState<AttributeRow[]>([{ key: 'color', value: '' }, { key: 'size', value: '' }]);
  
  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProductsList(data);
      })
      .catch((err) => console.error('Failed to load products', err));
  }, []);

  useEffect(() => {
    if (variantToEdit) {
      setProductId(variantToEdit.productId || '');
      setSku(variantToEdit.sku || '');
      setPrice(variantToEdit.price ? variantToEdit.price.toString() : '');
      setStock(variantToEdit.stock !== undefined ? variantToEdit.stock.toString() : '0');
      setIsActive(variantToEdit.isActive ?? true);
      setImagePreview(variantToEdit.imageUrl || null);
      setImageFile(null);

      // Convert metadata object into key-value array
      if (variantToEdit.metadata && typeof variantToEdit.metadata === 'object') {
        const entries = Object.entries(variantToEdit.metadata).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setAttributes(entries.length > 0 ? entries : [{ key: '', value: '' }]);
      } else {
        setAttributes([{ key: '', value: '' }]);
      }
    } else {
      setProductId('');
      setSku('');
      setPrice('');
      setStock('0');
      setIsActive(true);
      setImagePreview(null);
      setImageFile(null);
      setAttributes([{ key: 'color', value: '' }, { key: 'size', value: '' }]);
    }
    setError('');
  }, [variantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert key-value array into regular metadata object
    const metadataObj: Record<string, string> = {};
    attributes.forEach((attr) => {
      if (attr.key.trim()) {
        metadataObj[attr.key.trim()] = attr.value;
      }
    });

    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('sku', sku);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('isActive', String(isActive));
      formData.append('metadata', JSON.stringify(metadataObj));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = variantToEdit ? `/api/variants/${variantToEdit.id}` : '/api/variants';
      const method = variantToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save variant');

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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#121214]">
            {variantToEdit ? 'Edit Product Variant' : 'Add New Variant'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Parent Product</label>
            <select
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E11D48]"
            >
              <option value="">Select a product...</option>
              {productsList.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Variant SKU</label>
            <input
              type="text"
              required
              placeholder="e.g. SHIRT-RED-M"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Leave blank for base price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E11D48]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E11D48]"
              />
            </div>
          </div>

          {/* Variant Image Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Variant Image (Optional)</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-[#E11D48] hover:file:bg-rose-100"
              />
            </div>
          </div>

          {/* Key-Value Attributes Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Attributes (Key-Value)</label>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="text-xs font-semibold text-[#E11D48] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Attribute
              </button>
            </div>
            <div className="space-y-2">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. color)"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E11D48]"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. red)"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E11D48]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(index)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-300 text-[#E11D48] focus:ring-[#E11D48]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active Variant</label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#E11D48] text-white rounded-xl text-sm font-semibold hover:bg-rose-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : variantToEdit ? 'Save Changes' : 'Create Variant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}