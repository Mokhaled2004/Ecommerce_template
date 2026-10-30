'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  addedAt: number;
};

type WishlistContextValue = {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const storageKey = 'storefront-wishlist-v1';

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setItems(JSON.parse(stored) as WishlistItem[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      addItem: (item) =>
        setItems((current) => {
          const exists = current.find((entry) => entry.productId === item.productId);
          if (exists) return current;
          return [...current, { ...item, addedAt: Date.now() }];
        }),
      removeItem: (productId) =>
        setItems((current) => current.filter((entry) => entry.productId !== productId)),
      isInWishlist: (productId) => items.some((entry) => entry.productId === productId),
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
