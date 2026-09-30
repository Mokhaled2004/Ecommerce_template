import { and, asc, desc, eq, isNotNull, isNull, or, lte, gt } from 'drizzle-orm';
import { db } from '@/db';
import { offers, products } from '@/db/schema';
import Hero from '@/components/landing/Hero';
import PromoSlider from '@/components/landing/PromoSlider';
import OffersShowcase from '@/components/landing/OffersShowcase';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import StoreFooter from '@/components/landing/StoreFooter';
import { HOME_PRODUCT_LIMIT } from '@/components/landing/home-config';

export const dynamic = 'force-dynamic';

export default async function StorefrontHomePage() {
  const now = new Date();
  const [featuredProducts, timedOffers] = await Promise.all([
    db.select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      imageUrl: products.imageUrl,
      isFeatured: products.isFeatured,
    }).from(products)
      .where(and(isNull(products.deletedAt), eq(products.isActive, true)))
      .orderBy(desc(products.isFeatured), desc(products.createdAt))
      .limit(HOME_PRODUCT_LIMIT),
    db.select({
      id: offers.id,
      name: offers.name,
      description: offers.description,
      type: offers.type,
      value: offers.value,
      couponCode: offers.couponCode,
      startAt: offers.startAt,
      endAt: offers.endAt,
      metadata: offers.metadata,
    }).from(offers)
      .where(and(eq(offers.isActive, true), isNotNull(offers.endAt), or(isNull(offers.startAt), lte(offers.startAt, now)), gt(offers.endAt, now)))
      .orderBy(asc(offers.endAt))
      .limit(6),
  ]);

  const offersForDisplay = timedOffers.map((offer) => ({ ...offer, endAt: offer.endAt!.toISOString() }));

  return (
    <>
      <Hero />
      <main>
        <PromoSlider />
        <OffersShowcase offers={offersForDisplay} />
        <FeaturedProducts products={featuredProducts} />
        <AboutSection />
        <ContactSection />
      </main>
      <StoreFooter />
    </>
  );
}
