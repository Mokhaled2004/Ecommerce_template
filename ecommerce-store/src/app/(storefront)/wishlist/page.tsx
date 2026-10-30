'use client';

import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { useCart } from '@/components/cart/CartProvider';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      sku: `SKU-${item.productId}`,
      price: item.price,
      imageUrl: item.imageUrl,
    });

    // Show confirmation feedback
    setAddedToCart((prev) => new Set(prev).add(item.productId));
    setTimeout(() => {
      setAddedToCart((prev) => {
        const next = new Set(prev);
        next.delete(item.productId);
        return next;
      });
    }, 2000);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FDF6F8] to-[#F9F3F5] py-12 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8547A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8A0B0]/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#C8547A] hover:text-[#b04468] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-[#3B1A26] mb-2">My Wishlist</h1>
          <p className="text-[#888]">Your favorite items saved for later</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            {/* Skeleton for multiple items */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  {/* Skeleton Image */}
                  <div className="h-24 w-20 flex-shrink-0 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100" />
                  
                  {/* Skeleton Content */}
                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Title skeleton */}
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
                    
                    {/* Price skeleton */}
                    <div className="h-6 bg-gradient-to-r from-pink-100 to-pink-50 rounded w-1/4" />
                    
                    {/* Date skeleton */}
                    <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-1/3" />
                    
                    {/* Buttons skeleton */}
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 h-10 bg-gradient-to-r from-pink-100 to-pink-50 rounded-lg" />
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#C8547A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B1A26] mb-2">Your wishlist is empty</h2>
            <p className="text-[#888] mb-8 max-w-md mx-auto">
              Start adding your favorite products to your wishlist. Click the heart icon on any product to save it for later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                  >
                    {/* Product Image */}
                    {item.imageUrl ? (
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-20 flex-shrink-0 rounded-lg bg-gray-100" />
                    )}

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-[#1a1a1a] line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-[#C8547A]">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-[#888]">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            addedToCart.has(item.productId)
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-pink-50 text-[#C8547A] border border-[#C8547A] hover:bg-[#C8547A] hover:text-white'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          {addedToCart.has(item.productId) ? 'Added!' : 'Add to Bag'}
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-[#3B1A26] mb-4">Wishlist Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Items in wishlist</span>
                    <span className="font-semibold text-[#1a1a1a]">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Total value</span>
                    <span className="font-bold text-[#C8547A]">
                      ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    items.forEach((item) => handleAddToCart(item));
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white rounded-xl font-semibold transition-all shadow-md shadow-[#C8547A]/30 mb-3"
                >
                  Add All to Bag
                </button>

                <Link
                  href="/"
                  className="block w-full px-4 py-3 border border-gray-200 text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-[#888] text-center">
                    💡 Your wishlist is saved locally. Items will remain here even if you close your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
