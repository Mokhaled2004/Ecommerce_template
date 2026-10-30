'use client';

import { useEffect, useState } from 'react';

interface Offer {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  value: string | number | null;
  couponCode?: string | null;
  endAt?: string;
  metadata?: Record<string, unknown> | null;
}

interface OffersShowcaseProps {
  offers: Offer[];
}

export default function OffersShowcase({ offers }: OffersShowcaseProps) {
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  if (!offers.length) return null;

  const currentOffer = offers[activeOfferIndex];
  const isPercentage = currentOffer.type === 'percentage';
  const numValue = typeof currentOffer.value === 'string' ? parseFloat(currentOffer.value) : currentOffer.value;
  const displayValue = isPercentage ? `${numValue}%` : `$${(numValue || 0).toFixed(2)}`;

  return (
    <div className="px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm sm:text-base font-semibold">
            <span className="text-[#E8A0B0] font-bold">{displayValue} Off</span> — {currentOffer.name}
          </p>
          {currentOffer.description && (
            <p className="text-white/75 text-xs sm:text-sm mt-1">{currentOffer.description}</p>
          )}
        </div>
        {currentOffer.couponCode && (
          <div className="whitespace-nowrap px-3 py-1.5 bg-[#C8547A] rounded-lg text-white text-xs sm:text-sm font-bold">
            Code: {currentOffer.couponCode}
          </div>
        )}
      </div>

      {/* Carousel indicators */}
      {offers.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveOfferIndex(index)}
              className={`transition-all ${
                index === activeOfferIndex
                  ? 'w-3 h-3 bg-[#E8A0B0]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              } rounded-full`}
              aria-label={`Go to offer ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
