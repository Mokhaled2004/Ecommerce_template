'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';

interface PackageAddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packageData?: any | null;
  products: any[];
  variants: any[];
}

export default function PackageAddForm({
  isOpen,
  onClose,
  onSuccess,
  packageData,
  products,
  variants,
}: PackageAddFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [items, setItems] = useState<Array<{ productId: string; variantId?: string | null; quantity: number }>>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (packageData) {
      setName(packageData.name || '');
      setSlug(packageData.slug || '');
      setDescription(packageData.description || '');
      setOfferedPrice(packageData.offeredPrice || '');
      setOriginalPrice(packageData.originalPrice || '');
      setIsActive(packageData.isActive ?? true);
      setIsFeatured(packageData.isFeatured ?? false);
      setImagePreview(packageData.imageUrl || null);
      setImageFile(null);
      setItems(
        packageData.items?.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
        })) || []
      );
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setOfferedPrice('');
      setOriginalPrice('');
      setIsActive(true);
      setIsFeatured(false);
      setImagePreview(null);
      setImageFile(null);
      setItems([]);
    }
    setError('');
  }, [packageData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addItem = () => {
    if (products.length === 0) return;
    setItems([...items, { productId: products[0].id, variantId: null, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemProduct = (index: number, productId: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], productId, variantId: null };
    setItems(newItems);
  };

  const updateItemVariant = (index: number, variantId: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], variantId: variantId === '' ? null : variantId };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('offeredPrice', offeredPrice);
      if (originalPrice) formData.append('originalPrice', originalPrice);
      formData.append('isActive', String(isActive));
      formData.append('isFeatured', String(isFeatured));
      formData.append('items', JSON.stringify(items));
      if (imageFile) formData.append('image', imageFile);

      const url = packageData ? `/api/packages/${packageData.id}` : '/api/packages';
      const method = packageData ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save package');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#121214]">
            {packageData ? 'Edit Package Bundle' : 'Create Package Bundle'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Package Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!packageData) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                  }
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 focus:outline-none focus:border-[#121214]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Offered Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
              />
            </div>
          </div>

          {/* Package Image Upload Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Package Image</label>
            <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-gray-50">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-xs" />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl border border-gray-200">
                  <Upload className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Included Products & Product Variants */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-gray-600 uppercase">Included Items (Products & Variants)</h4>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#E11D48] bg-rose-50 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-3">No items added to this package yet.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const productVariants = variants.filter(
                    (v) => v.productId === item.productId || v.product_id === item.productId
                  );

                  return (
                    <div key={index} className="p-3 bg-white border border-gray-200 rounded-xl space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <select
                          value={item.productId}
                          onChange={(e) => updateItemProduct(index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                        >
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>{prod.name} ({prod.sku})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => setItems(items.map((it, i) => i === index ? { ...it, quantity: parseInt(e.target.value) || 1 } : it))}
                          className="w-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                          placeholder="Qty"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {productVariants.length > 0 ? (
                        <div>
                          <select
                            value={item.variantId || ''}
                            onChange={(e) => updateItemVariant(index, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-[#121214]"
                          >
                            <option value="">-- Base Product (No specific variant) --</option>
                            {productVariants.map((v) => (
                              <option key={v.id} value={v.id}>
                                Variant SKU: {v.sku} {v.metadata ? `(${JSON.stringify(v.metadata)})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-600 italic">
                          * Note: No variants found for this product id ({item.productId}).
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-600/10 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Saving...' : packageData ? 'Update Package' : 'Create Package'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}