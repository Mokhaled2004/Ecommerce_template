'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartLine = { productId: string; variantId?: string; variantLabel?: string; name: string; sku: string; price: number; imageUrl: string | null; quantity: number };
type CartContextValue = { items: CartLine[]; addItem: (item: Omit<CartLine, 'quantity'>) => void; changeQuantity: (productId: string, quantity: number) => void; removeItem: (productId: string) => void; subtotal: number };
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'storefront-cart-v1';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const stored = window.localStorage.getItem(storageKey); if (stored) setItems(JSON.parse(stored) as CartLine[]); } catch { window.localStorage.removeItem(storageKey); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, ready]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem: (item) => setItems((current) => { const found = current.find((entry) => entry.productId === item.productId && entry.variantId === item.variantId); return found ? current.map((entry) => entry.productId === item.productId && entry.variantId === item.variantId ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }]; }),
    changeQuantity: (lineKey, quantity) => setItems((current) => quantity < 1 ? current.filter((entry) => `${entry.productId}:${entry.variantId ?? ''}` !== lineKey) : current.map((entry) => `${entry.productId}:${entry.variantId ?? ''}` === lineKey ? { ...entry, quantity: Math.min(99, quantity) } : entry)),
    removeItem: (lineKey) => setItems((current) => current.filter((entry) => `${entry.productId}:${entry.variantId ?? ''}` !== lineKey)),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function CartContents() {
  const { items, changeQuantity, removeItem, subtotal } = useCart();
  if (!items.length) return <div className="flex flex-1 flex-col items-center justify-center text-center"><p className="font-semibold text-white">Your cart is empty</p><p className="mt-2 text-sm text-white/45">Add a style from the shop and it will show up here.</p></div>;
  return <><div className="flex-1 space-y-4 overflow-y-auto py-5">{items.map((item) => { const lineKey = `${item.productId}:${item.variantId ?? ''}`; return <article key={lineKey} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">{item.imageUrl ? <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-white/10"><Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover"/></div> : <div className="h-20 w-16 shrink-0 rounded-lg bg-white/10"/>}<div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-white">{item.name}</h3>{item.variantLabel && <p className="mt-1 text-[10px] text-white/55">{item.variantLabel}</p>}<p className="mt-1 text-xs text-white/40">${item.price.toFixed(2)} each</p><div className="mt-2 flex items-center justify-between"><div className="flex items-center rounded-lg border border-white/10"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(lineKey, item.quantity - 1)} className="px-2 py-1 text-white/70">−</button><span className="min-w-6 text-center text-xs text-white">{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(lineKey, item.quantity + 1)} className="px-2 py-1 text-white/70">+</button></div><button type="button" aria-label={`Remove ${item.name} from cart`} title="Remove from cart" onClick={() => removeItem(lineKey)} className="rounded-lg p-2 text-white/45 transition hover:bg-rose-500/10 hover:text-rose-300"><Trash2 className="h-4 w-4"/></button></div></div></article>; })}</div><div className="border-t border-white/10 pt-5"><div className="flex justify-between text-sm"><span className="text-white/55">Subtotal</span><span className="font-bold text-white">${subtotal.toFixed(2)}</span></div><p className="mt-2 text-[10px] text-white/40">Shipping and any applicable offer will be calculated at checkout.</p></div></>;
}
