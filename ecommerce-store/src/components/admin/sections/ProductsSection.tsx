'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Trash2 } from 'lucide-react';
import ProductAddForm from '../products/ProductAddForm';
import ProductTable from '../products/ProductTable';
import ProductDeleteModal from '../products/ProductDeleteModal';
import AdminLoader from '@/components/admin/AdminLoader';

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Toggle & Modal States
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Comprehensive Edit Form States
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editSlug, setEditSlug] = useState(''); // Locked slug to protect folder paths
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCostPrice, setEditCostPrice] = useState('');
  const [editCompareAtPrice, setEditCompareAtPrice] = useState('');
  const [editStock, setEditStock] = useState('0');
  const [editWeight, setEditWeight] = useState('');
  
  // Dimensions
  const [editLength, setEditLength] = useState('');
  const [editWidth, setEditWidth] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editDimUnit, setEditDimUnit] = useState('cm');

  // SEO Fields
  const [editSeoMetaTitle, setEditSeoMetaTitle] = useState('');
  const [editSeoMetaDescription, setEditSeoMetaDescription] = useState('');

  const [editCategoryId, setEditCategoryId] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  
  // Image handling & Previews (Main + Gallery)
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');

  const [editGalleryFiles, setEditGalleryFiles] = useState<File[]>([]);
  const [editGalleryPreviews, setEditGalleryPreviews] = useState<string[]>([]);
  const [editExistingGallery, setEditExistingGallery] = useState<string[]>([]);
  const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);

  // Metadata
  const [editMetaKey, setEditMetaKey] = useState('');
  const [editMetaValue, setEditMetaValue] = useState('');
  const [editMetadata, setEditMetadata] = useState<Record<string, string>>({});

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Fetch products and categories on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json())
    ])
      .then(([prodData, catData]) => {
        if (Array.isArray(prodData)) setProducts(prodData);
        if (Array.isArray(catData)) setCategories(catData);
      })
      .catch((err) => console.error('Failed to load products/categories', err))
      .finally(() => setLoading(false));
  }, []);

  const handleProductAdded = (newProd: any) => {
    setProducts((prev) => [newProd, ...prev]);
    setIsAddFormOpen(false);
  };

  const handleEditClick = (prod: any) => {
    setSelectedProduct(prod);
    console.log("Editing product object:", prod);

    setEditName(prod.name || '');
    setEditSku(prod.sku || '');
    setEditSlug(prod.slug || '');
    setEditDescription(prod.description || '');
    setEditPrice(String(prod.price ?? ''));
    setEditCostPrice(String(prod.costPrice ?? ''));
    setEditCompareAtPrice(String(prod.compareAtPrice ?? ''));
    setEditStock(String(prod.stock ?? '0'));
    setEditWeight(String(prod.weight ?? ''));
    
    setEditLength(String(prod.dimensions?.length ?? ''));
    setEditWidth(String(prod.dimensions?.width ?? ''));
    setEditHeight(String(prod.dimensions?.height ?? ''));
    setEditDimUnit(prod.dimensions?.unit || 'cm');

    setEditSeoMetaTitle(prod.seoMetaTitle || '');
    setEditSeoMetaDescription(prod.seoMetaDescription || '');

    setEditCategoryId(prod.categoryId || '');
    setEditIsActive(prod.isActive ?? true);
    setEditIsFeatured(prod.isFeatured ?? false);
    
    setEditImageUrl(prod.imageUrl || '');
    setEditImagePreview(prod.imageUrl || null);
    setEditImageFile(null);

    // Matches backend schema column `galleryUrls`
    const rawGallery = 
      prod.galleryUrls || 
      prod.gallery || 
      prod.images || 
      prod.galleryImages || 
      [];

    setEditExistingGallery(Array.isArray(rawGallery) ? rawGallery : []);
    setRemovedGalleryUrls([]);
    setEditGalleryFiles([]);
    setEditGalleryPreviews([]);

    setEditMetadata(prod.metadata || {});
    setEditError('');
    setEditModalOpen(true);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    if (file) {
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setEditGalleryFiles((prev) => [...prev, ...filesArray]);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setEditGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewGalleryPreview = (index: number) => {
    setEditGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setEditGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryItem = (index: number) => {
    const urlToRemove = editExistingGallery[index];
    setRemovedGalleryUrls((prev) => [...prev, urlToRemove]);
    setEditExistingGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMetadata = () => {
    if (!editMetaKey.trim()) return;
    setEditMetadata({ ...editMetadata, [editMetaKey.trim()]: editMetaValue });
    setEditMetaKey('');
    setEditMetaValue('');
  };

  const handleRemoveMetadata = (keyToRemove: string) => {
    const updated = { ...editMetadata };
    delete updated[keyToRemove];
    setEditMetadata(updated);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setEditLoading(true);
    setEditError('');

    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('sku', editSku);
      formData.append('slug', editSlug);
      formData.append('description', editDescription);
      formData.append('price', editPrice);
      formData.append('costPrice', editCostPrice);
      formData.append('compareAtPrice', editCompareAtPrice);
      formData.append('stock', editStock);
      formData.append('weight', editWeight);
      
      formData.append('dimensions', JSON.stringify({
        length: editLength ? Number(editLength) : undefined,
        width: editWidth ? Number(editWidth) : undefined,
        height: editHeight ? Number(editHeight) : undefined,
        unit: editDimUnit,
      }));

      formData.append('seoMetaTitle', editSeoMetaTitle);
      formData.append('seoMetaDescription', editSeoMetaDescription);
      formData.append('categoryId', editCategoryId || '');
      formData.append('isActive', String(editIsActive));
      formData.append('isFeatured', String(editIsFeatured));
      formData.append('metadata', JSON.stringify(editMetadata));
      formData.append('removedGalleryUrls', JSON.stringify(removedGalleryUrls));
      
      if (editImageFile) {
        formData.append('image', editImageFile);
      } else if (editImageUrl) {
        formData.append('imageUrl', editImageUrl);
      }

      editGalleryFiles.forEach((file) => {
        formData.append('gallery', file);
      });

      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: formData,
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? data.product || { ...p, name: editName, sku: editSku, price: Number(editPrice) } : p))
      );
      setEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#121214]">Products Management</h2>
          <p className="text-gray-500 text-sm">Manage inventory, store offerings, pricing, and specs.</p>
        </div>
        
        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="flex items-center justify-center p-3 sm:px-4 sm:py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-600/10 cursor-pointer"
        >
          {isAddFormOpen ? (
            <>
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline sm:ml-2">Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline sm:ml-2">Add Product</span>
            </>
          )}
        </button>
      </div>

      {isAddFormOpen && (
        <ProductAddForm 
          categories={categories} 
          onProductAdded={handleProductAdded} 
        />
      )}

      {loading ? (
        <AdminLoader text="Loading products..." />
      ) : (
        <ProductTable 
          products={products} 
          categories={categories}
          onEditClick={handleEditClick}
          onDeleteClick={(prod) => {
            setSelectedProduct(prod);
            setDeleteModalOpen(true);
          }} 
        />
      )}

      {/* Edit Full Schema Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-[#121214]">Edit Product</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{editError}</div>}

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Row 1: Name, SKU, Slug (Locked Slug) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">SKU</label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Slug (Locked)</label>
                  <input
                    type="text"
                    value={editSlug}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-mono text-gray-400 cursor-not-allowed"
                    title="Slug cannot be changed to protect existing storage paths"
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
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Compare Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editCompareAtPrice}
                    onChange={(e) => setEditCompareAtPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editCostPrice}
                    onChange={(e) => setEditCostPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
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
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Length</label>
                  <input
                    type="number"
                    value={editLength}
                    onChange={(e) => setEditLength(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Width</label>
                  <input
                    type="number"
                    value={editWidth}
                    onChange={(e) => setEditWidth(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Height</label>
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Unit</label>
                  <select
                    value={editDimUnit}
                    onChange={(e) => setEditDimUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                    <option value="mm">mm</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Images (Main + Gallery Management) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Main Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-2"
                  />
                  {editImagePreview && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                      <img src={editImagePreview} alt="Main preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-2"
                  />
                  
                  {/* Existing + New Gallery Previews */}
                  <div className="flex flex-wrap gap-2">
                    {editExistingGallery.map((url, index) => (
                      <div key={`existing-${index}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryItem(index)}
                          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {editGalleryPreviews.map((src, index) => (
                      <div key={`new-${index}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-rose-300 group">
                        <img src={src} alt="New gallery preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewGalleryPreview(index)}
                          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: SEO Fields & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      maxLength={60}
                      value={editSeoMetaTitle}
                      onChange={(e) => setEditSeoMetaTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">SEO Meta Description</label>
                    <textarea
                      maxLength={160}
                      rows={2}
                      value={editSeoMetaDescription}
                      onChange={(e) => setEditSeoMetaDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} className="w-4 h-4 text-[#E11D48] rounded" />
                      <span className="text-sm font-semibold text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editIsFeatured} onChange={(e) => setEditIsFeatured(e.target.checked)} className="w-4 h-4 text-[#E11D48] rounded" />
                      <span className="text-sm font-semibold text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 6: Metadata Attributes Builder */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <label className="block text-xs font-semibold text-gray-600 uppercase">Attributes / Metadata</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. ram)"
                    value={editMetaKey}
                    onChange={(e) => setEditMetaKey(e.target.value)}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 16GB)"
                    value={editMetaValue}
                    onChange={(e) => setEditMetaValue(e.target.value)}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex-1"
                  />
                  <button type="button" onClick={handleAddMetadata} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold cursor-pointer">
                    Add Meta
                  </button>
                </div>

                {Object.keys(editMetadata).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.entries(editMetadata).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-mono">
                        <span className="font-bold text-gray-700">{k}:</span>
                        <span className="text-gray-500">{String(v)}</span>
                        <button type="button" onClick={() => handleRemoveMetadata(k)} className="text-red-500 cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ProductDeleteModal
        isOpen={deleteModalOpen}
        product={selectedProduct}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}