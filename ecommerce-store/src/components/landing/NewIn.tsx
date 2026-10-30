"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { NEWIN_IMAGES } from "./home-config";

const NEWIN_PRODUCTS = [
  { id: "n1", name: "La Mousse OFFDa Foaming Cleanser", price: "24.99", compareAtPrice: null, image: NEWIN_IMAGES[0] },
  { id: "n3", name: "Hydrating Rose Serum",               price: "28.99", compareAtPrice: null, image: NEWIN_IMAGES[2] },
  { id: "n4", name: "Vitamin C Eye Concentrate",          price: "39.99", compareAtPrice: "49.99", image: NEWIN_IMAGES[3] },
  { id: "n5", name: "Gentle Exfoliating Toner",           price: "22.99", compareAtPrice: null, image: NEWIN_IMAGES[4] },
  { id: "n6", name: "Nourishing Night Balm",              price: "31.99", compareAtPrice: "38.99", image: NEWIN_IMAGES[5] },
  { id: "n7", name: "Peptide Firming Moisturiser",        price: "45.99", compareAtPrice: null, image: NEWIN_IMAGES[6] },
];

export default function NewIn() {
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
      sku: `SKU-${product.id}`,
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
    <section className="pt-4 pb-8 sm:pt-6 sm:pb-12 bg-[#FDF6F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">New In</h2>
            <p className="text-sm text-[#888] mt-1">Fresh arrivals just for you</p>
          </div>
        </div>

        {/* Grid layout: Large card + Product scroller */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Large featured card - outside scroller, enlarged */}
          <article className="group w-full">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F9F3F5]">
              <Image
                src="/images/products/newin/8415c485446784ad0ad86e97f1ac24ab18d0c5ac.jpg"
                alt="New In Featured Product"
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-6 right-6">
                <p className="text-white font-bold text-xl">Beautya La Mousse</p>
                <p className="text-white/90 text-base mt-1.5">OFFDa Foaming Cleanser</p>
                <Link
                  href="/shop"
                  className="inline-block mt-5 px-7 py-3 rounded-full bg-white text-[#C8547A] text-sm font-semibold hover:bg-[#C8547A] hover:text-white transition-colors shadow-lg"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </article>

          {/* Product scroller */}
          <div className="relative overflow-hidden">
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
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Product cards */}
              {NEWIN_PRODUCTS.map((product) => {
                const discounted = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
                return (
                  <article key={product.id} className="group flex-shrink-0 w-48 sm:w-56 snap-start">
                    <Link href="/shop" className="block">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-3">
                        {discounted && (
                          <span className="absolute top-3 left-3 z-10 bg-[#C8547A] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
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
                          sizes="(max-width: 640px) 48vw, 224px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
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
                      <div className="flex items-center gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < 4 ? "fill-[#C8547A] text-[#C8547A]" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-[#1a1a1a] line-clamp-1">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-[#C8547A]">${product.price}</span>
                        {discounted && (
                          <span className="text-xs text-[#888] line-through">${product.compareAtPrice}</span>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
