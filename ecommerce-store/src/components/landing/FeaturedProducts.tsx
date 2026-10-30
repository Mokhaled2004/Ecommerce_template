"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

type Product = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
};

// Hardcoded bestseller products
const BESTSELLERS = [
  {
    id: "best-1",
    name: "Beautya Capture Total Dreamlskin Care & Perfect",
    sku: "BEAU-001",
    price: "70.00",
    compareAtPrice: null,
    image: "/images/products/bestsellers/12fd4930b4f7d02ac821c3a4f1b1a2e37d3af909.jpg",
  },
  {
    id: "best-2",
    name: "Beautya Capture Total Dreamlskin Care & Perfect",
    sku: "BEAU-002",
    price: "76.00",
    compareAtPrice: null,
    image: "/images/products/bestsellers/91b41092bd2d886b9e22c8c57d933f47d4b96cc1.jpg",
  },
  {
    id: "best-3",
    name: "Beautya Capture Total Dreamlskin Care & Perfect",
    sku: "BEAU-003",
    price: "70.00",
    compareAtPrice: null,
    image: "/images/products/bestsellers/9355b81c9f4bab35343f34edcddec04723e84ca1.jpg",
  },
  {
    id: "best-4",
    name: "Beautya Capture Total Dreamlskin Care & Perfect",
    sku: "BEAU-004",
    price: "76.00",
    compareAtPrice: null,
    image: "/images/products/bestsellers/94e49b3d0f5ee35304f91dee9cdead4a05923124.jpg",
  },
];

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToBag = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: parseFloat(product.price),
      imageUrl: product.image,
    });

    // Show confirmation feedback
    setAddedItems((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  const handleToggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        imageUrl: product.image,
      });
    }
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  // Check scroll position and overflow
  const checkScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Show left arrow if scrolled right from start
    setShowLeftArrow(scrollLeft > 10);
    
    // Show right arrow if not at the end
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // Initial check
    checkScroll();

    // Listen to scroll events
    element.addEventListener('scroll', checkScroll);
    
    // Listen to resize events
    window.addEventListener('resize', checkScroll);
    
    return () => {
      element.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Our Best Sellers</h2>
            <p className="text-sm text-[#888] mt-1">The products our customers love most</p>
          </div>
        </div>

        {/* Product scroll with overlay arrows */}
        <div className="relative">
          {/* Left arrow - only show if can scroll left */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-[#1a1a1a] hover:border-[#C8547A] hover:text-[#C8547A] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right arrow - only show if can scroll right */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-[#1a1a1a] hover:border-[#C8547A] hover:text-[#C8547A] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
          {BESTSELLERS.map((product) => (
            <article
              key={product.id}
              className="group flex-shrink-0 w-64 sm:w-72 snap-start"
            >
              <Link href="/shop" className="block">
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F9F3F5] mb-3">
                  <button
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#C8547A]"
                  >
                    <Heart
                      className="w-4 h-4 transition-colors"
                      fill={isInWishlist(product.id) ? "#C8547A" : "none"}
                      color={isInWishlist(product.id) ? "#C8547A" : "currentColor"}
                    />
                  </button>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 56vw, 256px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Add to cart overlay */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToBag(product);
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all ${
                        addedItems.has(product.id)
                          ? "bg-green-500 text-white"
                          : "bg-[#C8547A] text-white hover:bg-[#b04468]"
                      }`}
                    >
                      {addedItems.has(product.id) ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Bag
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Product info */}
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < 4 ? "fill-[#C8547A] text-[#C8547A]" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                    <span className="text-[10px] text-[#888] ml-1">(48)</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-[#C8547A]">
                      ${product.price}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-[#888] line-through">
                        ${product.compareAtPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
          </div>
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#C8547A] text-[#C8547A] font-semibold text-sm hover:bg-[#C8547A] hover:text-white transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
