'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Loader2, RefreshCw } from 'lucide-react';
import PackageTable from '@/components/admin/packages/PackageTable';
import PackageAddForm from '@/components/admin/packages/PackageAddForm';
import PackageDeleteModal from '@/components/admin/packages/PackageDeleteModal';
import AdminLoader from '@/components/admin/AdminLoader';

export default function PackagesSection() {
  const [packages, setPackages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [deletePackage, setDeletePackage] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pkgRes, prodRes, varRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/products'),
        fetch('/api/variants')
      ]);

      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        setPackages(pkgData);
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (varRes.ok) {
        const varData = await varRes.json();
        setVariants(varData);
      }
    } catch (err) {
      console.error('Failed to load packages section data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#121214]">Packages & Bundles</h2>
          <p className="text-gray-500 text-sm">Manage product bundles, offers, and package item contents.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setSelectedPackage(null);
              setIsAddOpen(!isAddOpen);
            }}
            className="flex items-center justify-center p-3 sm:px-4 sm:py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-rose-600/10"
            title={isAddOpen ? 'Close Form' : 'Create Package'}
          >
            {isAddOpen ? (
              <>
                <X className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline sm:ml-2">Close Form</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline sm:ml-2">Create Package</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading && packages.length === 0 ? (
        <AdminLoader text="Loading packages..." />
      ) : (
        <PackageTable
          packages={packages}
          onEdit={(pkg) => {
            setSelectedPackage(pkg);
            setIsAddOpen(true);
          }}
          onDelete={(pkg) => setDeletePackage(pkg)}
        />
      )}

      {isAddOpen && (
        <PackageAddForm
          isOpen={isAddOpen}
          onClose={() => {
            setIsAddOpen(false);
            setSelectedPackage(null);
          }}
          onSuccess={fetchData}
          packageData={selectedPackage}
          products={products}
          variants={variants}
        />
      )}

      <PackageDeleteModal
        isOpen={!!deletePackage}
        onClose={() => setDeletePackage(null)}
        onSuccess={fetchData}
        packageData={deletePackage}
      />
    </div>
  );
}