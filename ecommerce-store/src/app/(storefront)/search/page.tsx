'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

interface SearchResult {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  imageUrl: string | null;
  galleryUrls: string[] | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  rating: string;
  ratingCount: number;
  isFeatured: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addItem } = useCart();
  const { items: wishlistItems, toggleWishlist } = useWishlist();

  const isInWishlist = (productId: string) => wishlistItems.some((item) => item.id === productId);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setError('');
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.set('q', query);
        if (category) params.set('category', category);

        const response = await fetch(`/api/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setError('Failed to perform search. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, category]);

  const handleAddToBag = (product: SearchResult) => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl || '/images/shoe1.png',
      quantity: 1,
    });
  };

  const handleToggleWishlist = (product: SearchResult) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl || '/images/shoe1.png',
    });
  };

  return (
    <main className="bg-gradient-to-b from-white via-[#FDF6F8] to-[#F9F3F5] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[#1a1a1a] hover:text-[#C8547A] transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#3B1A26]">Search Results</h1>
              <p className="text-xs text-[#888]">
                {query && `Results for "${query}"`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty state */}
        {!loading && query.length < 2 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto text-[#C8547A]/20 mb-6" />
            <h2 className="text-2xl font-bold text-[#3B1A26] mb-2">Start Searching</h2>
            <p className="text-[#888] max-w-md mx-auto">
              Enter at least 2 characters to search our products
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto text-[#C8547A]/20 mb-6" />
            <h2 className="text-2xl font-bold text-[#3B1A26] mb-2">No Results Found</h2>
            <p className="text-[#888] max-w-md mx-auto">
              We couldn't find any products matching "{query}". Try different keywords or
              browse our collection.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-2 bg-[#C8547A] text-white font-semibold rounded-full hover:bg-[#b04468] transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        )}

        {/* Results grid */}
        {!loading && !error && results.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm text-[#888]">
                Found <span className="font-bold text-[#3B1A26]">{results.length}</span> product
                {results.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.imageUrl || '/images/shoe1.png'}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {product.compareAtPrice && (
                        <div className="absolute top-3 right-3 bg-[#C8547A] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Sale
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-semibold text-[#3B1A26] hover:text-[#C8547A] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {product.categoryName && (
                      <p className="text-xs text-[#888] mt-1">{product.categoryName}</p>
                    )}

                    {/* Rating */}
                    {product.ratingCount > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs font-bold text-[#C8547A]">
                          {parseFloat(product.rating).toFixed(1)}
                        </span>
                        <span className="text-xs text-[#888]">
                          ({product.ratingCount})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="font-bold text-[#C8547A] text-lg">
                        EGP {parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-[#888] line-through">
                          EGP {parseFloat(product.compareAtPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <p className="text-xs mt-2 font-medium">
                      {product.stock > 0 ? (
                        <span className="text-green-600">In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAddToBag(product)}
                        disabled={product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#C8547A] text-white font-semibold rounded-lg hover:bg-[#b04468] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(product)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors font-semibold text-sm ${
                          isInWishlist(product.id)
                            ? 'bg-pink-50 border-[#C8547A] text-[#C8547A]'
                            : 'bg-white border-gray-200 text-[#888] hover:border-[#C8547A] hover:text-[#C8547A]'
                        }`}
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                        />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
