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
  const payload = token ? verifyToken(token) : null;
  const user = payload ? { email: payload.email, name: payload.email.split('@')[0] } : null;
  return <Header user={user} categories={menuCategories} />;
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider><div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col relative">
      <Suspense fallback={<div aria-hidden="true" className="h-10 w-full bg-[#3B1A26]" />}><StorefrontHeader /></Suspense>
      <div className="flex-grow">{children}</div>
    </div></CartProvider>
  );
}
