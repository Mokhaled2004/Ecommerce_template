import { and, asc, desc, eq, gt, isNotNull, isNull, lte, or } from 'drizzle-orm';
import { db } from '@/db';
import { categories, offerCategories, offerProducts, offerVariants, offers, productVariants, products } from '@/db/schema';
import OffersShowcase from '@/components/landing/OffersShowcase';
import ShopCatalog from '@/components/shop/ShopCatalog';

export const dynamic = 'force-dynamic';

// Hardcoded categories - no database needed
const HARDCODED_CATEGORIES: Record<string, string> = {
  skincare: 'Skincare',
  gifts: 'Gifts',
  makeup: 'Makeup',
};

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const categoryName = HARDCODED_CATEGORIES[slug];

  if (!categoryName) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-[#FDF6F8] to-[#F9F3F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-[#3B1A26]">Category Not Found</h1>
          <p className="text-[#888] mt-2">The category you're looking for doesn't exist.</p>
          <p className="text-[#888] text-xs mt-4">Available: skincare, gifts, makeup</p>
        </div>
      </main>
    );
  }

  const now = new Date();

  const liveOffer = and(
    eq(offers.isActive, true),
    or(isNull(offers.startAt), lte(offers.startAt, now)),
    or(isNull(offers.endAt), gt(offers.endAt, now))
  );

  const [allProducts, filterCategories, variants, timedOffers, directOfferProducts, categoryOfferProducts, variantOfferProducts] = await Promise.all([
    // Get all products (no category filter needed - we'll filter by name after fetching)
    db
      .select({
        id: products.id,
        sku: products.sku,
        slug: products.slug,
        name: products.name,
        description: products.description,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        stock: products.stock,
        weight: products.weight,
        dimensions: products.dimensions,
        imageUrl: products.imageUrl,
        galleryUrls: products.galleryUrls,
        categoryId: products.categoryId,
        rating: products.rating,
        ratingCount: products.ratingCount,
        isFeatured: products.isFeatured,
        metadata: products.metadata,
        createdAt: products.createdAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(isNull(products.deletedAt), eq(products.isActive, true)))
      .orderBy(desc(products.isFeatured), desc(products.createdAt)),

    // Get all categories for filter
    db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .where(and(eq(categories.isActive, true), isNull(categories.deletedAt)))
      .orderBy(asc(categories.displayOrder), asc(categories.name)),

    // Get variants
    db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        price: productVariants.price,
        stock: productVariants.stock,
        imageUrl: productVariants.imageUrl,
        metadata: productVariants.metadata,
        isActive: productVariants.isActive,
      })
      .from(productVariants)
      .where(eq(productVariants.isActive, true)),

    // Get timed offers
    db
      .select({
        id: offers.id,
        name: offers.name,
        description: offers.description,
        type: offers.type,
        value: offers.value,
        couponCode: offers.couponCode,
        startAt: offers.startAt,
        endAt: offers.endAt,
        metadata: offers.metadata,
      })
      .from(offers)
      .where(
        and(
          eq(offers.isActive, true),
          isNotNull(offers.endAt),
          or(isNull(offers.startAt), lte(offers.startAt, now)),
          gt(offers.endAt, now)
        )
      )
      .orderBy(asc(offers.endAt))
      .limit(10),

    // Get direct offer products
    db
      .select({ productId: offerProducts.productId })
      .from(offerProducts)
      .innerJoin(offers, eq(offerProducts.offerId, offers.id))
      .where(liveOffer),

    // Get category offer products
    db
      .select({ productId: products.id })
      .from(offerCategories)
      .innerJoin(offers, eq(offerCategories.offerId, offers.id))
      .innerJoin(products, eq(offerCategories.categoryId, products.categoryId))
      .where(and(liveOffer, eq(products.isActive, true), isNull(products.deletedAt))),

    // Get variant offer products
    db
      .select({ productId: productVariants.productId })
      .from(offerVariants)
      .innerJoin(offers, eq(offerVariants.offerId, offers.id))
      .innerJoin(productVariants, eq(offerVariants.variantId, productVariants.id))
      .where(and(liveOffer, eq(productVariants.isActive, true))),
  ]);

  // Filter products by category name (case-insensitive match)
  const catalog = allProducts.filter(
    (p) => p.categoryName?.toLowerCase() === categoryName.toLowerCase()
  );

  const productsForShop = catalog.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    variants: variants.filter((variant) => variant.productId === product.id),
  }));

  const offeredProductIds = [
    ...new Set(
      [...directOfferProducts, ...categoryOfferProducts, ...variantOfferProducts].map(
        (entry) => entry.productId
      )
    ),
  ];

  const offersForDisplay = timedOffers.map((offer) => ({
    ...offer,
    endAt: offer.endAt!.toISOString(),
  }));

  return (
    <main className="bg-gradient-to-b from-white via-[#FDF6F8] to-[#F9F3F5] pb-16">
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-7 sm:px-10">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#C8547A]">
          Category
        </div>
        <h1 className="text-4xl font-black text-[#3B1A26] sm:text-5xl">{categoryName}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#888]">Explore our complete {categoryName.toLowerCase()} collection and find exactly what you need.</p>
      </div>

      <div className="bg-[#3B1A26] py-1">
        <OffersShowcase offers={offersForDisplay} />
      </div>

      <ShopCatalog
        products={productsForShop}
        categories={filterCategories}
        initialCategory={slug}
        initialSale={false}
        offeredProductIds={offeredProductIds}
      />
    </main>
  );
}
