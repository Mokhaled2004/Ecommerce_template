'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Image as ImageIcon } from 'lucide-react';
import CategoryAddForm from '../categories/CategoryAddForm';
import CategoryTable from '../categories/CategoryTable';
import CategoryDeleteModal from '../categories/CategoryDeleteModal';
import AdminLoader from '@/components/admin/AdminLoader';

export default function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Toggle & Modal States
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit Form States
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editParentId, setEditParentId] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
      })
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryAdded = (newCat: any) => {
    setCategories((prev) => [newCat, ...prev]);
    setIsAddFormOpen(false);
  };

  const handleEditClick = (cat: any) => {
    setSelectedCategory(cat);
    setEditName(cat.name || '');
    setEditSlug(cat.slug || '');
    setEditDescription(cat.description || '');
    setEditParentId(cat.parentCategoryId || '');
    setEditDisplayOrder(String(cat.displayOrder ?? 0));
    setEditIsActive(cat.isActive ?? true);
    setEditError('');
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setEditLoading(true);
    setEditError('');

    try {
      const res = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          slug: editSlug,
          description: editDescription,
          parentCategoryId: editParentId || null,
          displayOrder: Number(editDisplayOrder),
          isActive: editIsActive,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || 'Failed to update category');

      // Update local state with updated category
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCategory.id ? data.category || { ...c, name: editName, slug: editSlug, description: editDescription, parentCategoryId: editParentId, displayOrder: Number(editDisplayOrder), isActive: editIsActive } : c))
      );
      setEditModalOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setDeleteModalOpen(false);
      setSelectedCategory(null);
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
          <h2 className="text-2xl font-bold text-[#121214]">Categories Management</h2>
          <p className="text-gray-500 text-sm">Organize store categories and manage custom folder image uploads.</p>
        </div>
        
        {/* Toggle Button for Add Form (Icon only on mobile, text + icon on sm screens and up) */}
        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="flex items-center justify-center p-3 sm:px-4 sm:py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-600/10"
          title={isAddFormOpen ? 'Close Form' : 'Add Category'}
        >
          {isAddFormOpen ? (
            <>
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline sm:ml-2">Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline sm:ml-2">Add Category</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Add Form Component (Only displays when toggled open) */}
      {isAddFormOpen && (
        <CategoryAddForm 
          categories={categories} 
          onCategoryAdded={handleCategoryAdded} 
        />
      )}

      {/* 2. Table Component / Reusable Loader State */}
      {loading ? (
        <AdminLoader text="Loading categories..." />
      ) : (
        <CategoryTable 
          categories={categories} 
          onEditClick={handleEditClick}
          onDeleteClick={(cat) => {
            setSelectedCategory(cat);
            setDeleteModalOpen(true);
          }} 
        />
      )}

      {/* 3. Edit Modal Pop-up */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#121214]">Edit Category</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{editError}</div>}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Slug</label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Parent Category</label>
                  <select
                    value={editParentId}
                    onChange={(e) => setEditParentId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                  >
                    <option value="">None (Top-Level)</option>
                    {categories
                      .filter((c) => c.id !== selectedCategory?.id) // Prevent self-parenting
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editDisplayOrder}
                    onChange={(e) => setEditDisplayOrder(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#121214]"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#E11D48] rounded border-gray-300 focus:ring-[#E11D48]"
                  />
                  <span className="text-sm font-semibold text-gray-700">Is Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50"
                >
                  {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Modal Component */}
      <CategoryDeleteModal
        isOpen={deleteModalOpen}
        category={selectedCategory}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}