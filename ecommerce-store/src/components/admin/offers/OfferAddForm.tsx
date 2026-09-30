'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface OfferAddFormProps {
  products: any[];
  variants: any[];
  categories: any[];
  onOfferAdded: (newOffer: any) => void;
}

export default function OfferAddForm({ products, variants, categories, onOfferAdded }: OfferAddFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  
  // Scoping States
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  
  // New state for excluded products
  const [excludedProductIds, setExcludedProductIds] = useState<string[]>([]);

  // Buy X Get Y specific states
  const [buyProductId, setBuyProductId] = useState('');
  const [getProductId, setGetProductId] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredVariants = variants.filter(v => v.productId === productId || v.product_id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          description,
          type: discountType,
          value: discountType !== 'buy_x_get_y' && discountValue ? Number(discountValue) : null,
          categoryIds: discountType !== 'buy_x_get_y' ? selectedCategoryIds : [],
          productIds: discountType !== 'buy_x_get_y' && productId ? [productId] : [],
          variantIds: discountType !== 'buy_x_get_y' && variantId ? [variantId] : [],
          // Update metadata to include buy/get products AND excluded products
          metadata: {
            ...(discountType === 'buy_x_get_y' ? { buyProductId, getProductId } : {}),
            excludedProductIds: discountType !== 'buy_x_get_y' ? excludedProductIds : [],
          },
          startAt: startDate ? new Date(startDate).toISOString() : null,
          endAt: endDate ? new Date(endDate).toISOString() : null,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create offer');

      onOfferAdded(data.offer);
      setTitle('');
      setDescription('');
      setDiscountType('percentage');
      setDiscountValue('');
      setSelectedCategoryIds([]);
      setExcludedProductIds([]); // Reset exclusion
      setProductId('');
      setVariantId('');
      setBuyProductId('');
      setGetProductId('');
      setStartDate('');
      setEndDate('');
      setIsActive(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-2xl mb-8 space-y-4 shadow-sm">
      <h3 className="text-lg font-bold text-[#121214]">Create New Offer</h3>
      
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Offer Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer Mega Sale"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Type *</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed_amount">Fixed Amount ($)</option>
            <option value="buy_x_get_y">Buy X Get Y</option>
          </select>
        </div>

        {discountType !== 'buy_x_get_y' && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              {discountType === 'percentage' ? 'Percentage (%) *' : 'Fixed Amount ($) *'}
            </label>
            <input
              type="number"
              step="0.01"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percentage' ? 'e.g. 15' : 'e.g. 50'}
              required={discountType !== 'buy_x_get_y'}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
            />
          </div>
        )}
      </div>

      {/* Conditional Block: Displays X & Y pickers ONLY for Buy X Get Y */}
      {discountType === 'buy_x_get_y' ? (
        <div className="space-y-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
          <p className="text-sm font-bold text-rose-900">Configure Buy X Get Y</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-rose-800 uppercase mb-1">Buy Product (X) *</label>
              <select
                value={buyProductId}
                onChange={(e) => setBuyProductId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
              >
                <option value="">-- Select Trigger Product (X) --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-800 uppercase mb-1">Get Product (Y) *</label>
              <select
                value={getProductId}
                onChange={(e) => setGetProductId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
              >
                <option value="">-- Select Reward Product (Y) --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Categories</label>
            <select
              multiple
              value={selectedCategoryIds}
              onChange={(e) => setSelectedCategoryIds(Array.from(e.target.selectedOptions, opt => opt.value))}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm h-24"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <span className="text-[10px] text-gray-400 mt-1 block">Hold Ctrl/Cmd to select multiple.</span>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Exclude Products</label>
            <select
              multiple
              value={excludedProductIds}
              onChange={(e) => setExcludedProductIds(Array.from(e.target.selectedOptions, opt => opt.value))}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm h-24"
            >
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
            <span className="text-[10px] text-gray-400 mt-1 block">Hold Ctrl/Cmd to select multiple.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Product (Optional)</label>
            <select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setVariantId('');
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
            >
              <option value="">-- None / Category Wide --</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Target Variant (Optional)</label>
            <select
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              disabled={!productId || filteredVariants.length === 0}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214] disabled:opacity-50"
            >
              <option value="">-- Select Variant --</option>
              {filteredVariants.map((v) => (
                <option key={v.id} value={v.id}>SKU: {v.sku}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#E11D48] rounded border-gray-300 focus:ring-[#E11D48]"
            />
            <span className="text-sm font-semibold text-gray-700">Is Active</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Offer terms or description..."
          rows={2}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-600/10 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{loading ? 'Creating...' : 'Add Offer'}</span>
        </button>
      </div>
    </form>
  );
}