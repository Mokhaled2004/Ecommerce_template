import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import Header from '@/components/layout/Header';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { db } from '@/db';
import { categories } from '@/db/schema';
import CartProvider from '@/components/cart/CartProvider';
import { Suspense } from 'react';

async function StorefrontHeader() {
  const [cookieStore, menuCategories] = await Promise.all([
    cookies(),
    db.select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories).where(and(eq(categories.isActive, true), isNull(categories.deletedAt)))
      .orderBy(asc(categories.displayOrder), asc(categories.name)),
  ]);
  const token = cookieStore.get('auth_token')?.value;
  const user = token ? verifyToken(token) : null;
  return <Header user={user} categories={menuCategories} />;
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider><div className="min-h-screen bg-[#121214] text-[#FFFFFF] flex flex-col relative">
      <Suspense fallback={<header aria-hidden="true" className="absolute inset-x-0 top-0 z-50 h-24 bg-[#121214]"><div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12"><div className="h-7 w-7 animate-pulse rounded bg-white/10"/><div className="h-10 w-14 animate-pulse rounded bg-white/10"/><div className="h-7 w-16 animate-pulse rounded bg-white/10"/></div></header>}><StorefrontHeader /></Suspense>
      <div className="flex-grow">{children}</div>
    </div></CartProvider>
  );
}
