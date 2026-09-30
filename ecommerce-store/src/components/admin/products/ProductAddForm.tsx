'use client';

import { useState } from 'react';
import { Plus, Loader2, X, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ProductAddFormProps {
  categories?: any[];
  onProductAdded: (newProduct: any) => void;
}

export default function ProductAddForm({ categories = [], onProductAdded }: ProductAddFormProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [weight, setWeight] = useState('');
  
  // Dimensions
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [dimUnit, setDimUnit] = useState('cm');

  // SEO Fields
  const [seoMetaTitle, setSeoMetaTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Image handling & Previews
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Metadata
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');
  const [metadata, setMetadata] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...filesArray]);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeGalleryPreview = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMetadata = () => {
    if (!metaKey.trim()) return;
    setMetadata({ ...metadata, [metaKey.trim()]: metaValue });
    setMetaKey('');
    setMetaValue('');
  };

  const handleRemoveMetadata = (keyToRemove: string) => {
    const updated = { ...metadata };
    delete updated[keyToRemove];
    setMetadata(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('sku', sku); // If empty, backend auto-generates SKU
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('costPrice', costPrice);
      formData.append('compareAtPrice', compareAtPrice);
      formData.append('stock', stock);
      formData.append('weight', weight);
      
      formData.append('dimensions', JSON.stringify({
        length: length ? Number(length) : undefined,
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        unit: dimUnit,
      }));

      formData.append('seoMetaTitle', seoMetaTitle);
      formData.append('seoMetaDescription', seoMetaDescription);
      formData.append('categoryId', categoryId || '');
      formData.append('isActive', String(isActive));
      formData.append('isFeatured', String(isFeatured));
      formData.append('metadata', JSON.stringify(metadata));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      galleryFiles.forEach((file) => {
        formData.append('gallery', file);
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      onProductAdded(data.product);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-2xl mb-8 space-y-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#121214]">Add New Product (Full Schema)</h3>
      
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

      {/* Row 1: Name, SKU, Slug */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Smart Watch"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">SKU (Auto-generated if empty)</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Leave blank to auto-generate"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="smart-watch"
            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2: Pricing & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Price ($) *</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Compare Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Cost Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Dimensions & Weight */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Weight</label>
          <input
            type="number"
            step="0.001"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Length</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Unit</label>
          <select
            value={dimUnit}
            onChange={(e) => setDimUnit(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
            <option value="mm">mm</option>
          </select>
        </div>
      </div>

      {/* Row 4: Images (Main + Multi-image Gallery) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Main Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-2"
          />
          {imagePreview && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
              <img src={imagePreview} alt="Main preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Gallery Images (Multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-2"
          />
          {galleryPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {galleryPreviews.map((src, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryPreview(index)}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 5: SEO Fields & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">SEO Meta Title (Max 60 chars)</label>
            <input
              type="text"
              maxLength={60}
              value={seoMetaTitle}
              onChange={(e) => setSeoMetaTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">SEO Meta Description (Max 160 chars)</label>
            <textarea
              maxLength={160}
              rows={2}
              value={seoMetaDescription}
              onChange={(e) => setSeoMetaDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 text-[#E11D48] rounded" />
              <span className="text-sm font-semibold text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 text-[#E11D48] rounded" />
              <span className="text-sm font-semibold text-gray-700">Featured</span>
            </label>
          </div>
        </div>
      </div>

      {/* Row 6: Metadata Key-Value Builder */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <label className="block text-xs font-semibold text-gray-600 uppercase">Category Metadata / Attributes (RAM, Storage, Material)</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Key (e.g. ram)"
            value={metaKey}
            onChange={(e) => setMetaKey(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex-1"
          />
          <input
            type="text"
            placeholder="Value (e.g. 16GB)"
            value={metaValue}
            onChange={(e) => setMetaValue(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex-1"
          />
          <button type="button" onClick={handleAddMetadata} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold">
            Add Meta
          </button>
        </div>

        {Object.keys(metadata).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(metadata).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="font-bold text-gray-700">{k}:</span>
                <span className="text-gray-500">{String(v)}</span>
                <button type="button" onClick={() => handleRemoveMetadata(k)} className="text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-600/10 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{loading ? 'Creating...' : 'Add Product'}</span>
        </button>
      </div>
    </form>
  );
}