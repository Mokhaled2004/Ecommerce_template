'use client';

import { useState } from 'react';
import { Plus, Loader2, X, Image as ImageIcon } from 'lucide-react';

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

interface CategoryAddFormProps {
  categories?: Category[]; // Made optional with default parameter fallback
  onCategoryAdded: (newCategory: any) => void;
}

export default function CategoryAddForm({ categories = [], onCategoryAdded }: CategoryAddFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  
  // Image handling & Preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Metadata Key-Value pairs state
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
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
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('parentCategoryId', parentCategoryId || '');
      formData.append('displayOrder', displayOrder);
      formData.append('isActive', String(isActive));
      formData.append('metadata', JSON.stringify(metadata));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      onCategoryAdded(data.category);
      // Reset form
      setName('');
      setSlug('');
      setDescription('');
      setParentCategoryId('');
      setDisplayOrder('0');
      setIsActive(true);
      setImageFile(null);
      setImagePreview(null);
      setMetadata({});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-2xl mb-8 space-y-4 shadow-sm">
      <h3 className="text-lg font-bold text-[#121214]">Add New Category</h3>
      
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Electronics"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Slug (Auto-generated)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. electronics"
            required
            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 focus:outline-none focus:border-[#121214]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Parent Category</label>
          <select
            value={parentCategoryId}
            onChange={(e) => setParentCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          >
            <option value="">None (Top-Level Category)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer mb-2"
          />
          {/* Image Preview Box */}
          {imagePreview ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 mt-2">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs gap-1">
              <ImageIcon className="w-5 h-5" />
              <span>Preview</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional short description..."
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
          />
        </div>
      </div>

      {/* Metadata Key-Value Builder */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <label className="block text-xs font-semibold text-gray-600 uppercase">Metadata (Key-Value Pairs)</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Key (e.g. color)"
            value={metaKey}
            onChange={(e) => setMetaKey(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex-1 focus:outline-none focus:border-[#121214]"
          />
          <input
            type="text"
            placeholder="Value (e.g. #000000)"
            value={metaValue}
            onChange={(e) => setMetaValue(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex-1 focus:outline-none focus:border-[#121214]"
          />
          <button
            type="button"
            onClick={handleAddMetadata}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all flex items-center justify-center"
          >
            Add Meta
          </button>
        </div>

        {/* Display Added Metadata tags */}
        {Object.keys(metadata).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(metadata).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="font-bold text-gray-700">{k}:</span>
                <span className="text-gray-500">{String(v)}</span>
                <button type="button" onClick={() => handleRemoveMetadata(k)} className="text-red-500 hover:text-red-700">
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
          <span>{loading ? 'Creating...' : 'Add Category'}</span>
        </button>
      </div>
    </form>
  );
}