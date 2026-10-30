import { NextRequest, NextResponse } from 'next/server';
import { and, eq, ilike, isNull, or } from 'drizzle-orm';
import { db } from '@/db';
import { categories, products } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();
    const category = searchParams.get('category')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Build search conditions
    const searchTerm = `%${query}%`;
    const searchConditions = or(
      ilike(products.name, searchTerm),
      ilike(products.description, searchTerm),
      ilike(products.sku, searchTerm)
    );

    // Build category filter if provided
    let whereCondition = and(
      isNull(products.deletedAt),
      eq(products.isActive, true),
      searchConditions
    );

    if (category && category !== 'all') {
      whereCondition = and(
        whereCondition,
        eq(categories.slug, category)
      );
    }

    // Execute search query
    const results = await db
      .select({
        id: products.id,
        sku: products.sku,
        slug: products.slug,
        name: products.name,
        description: products.description,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        stock: products.stock,
        imageUrl: products.imageUrl,
        galleryUrls: products.galleryUrls,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        rating: products.rating,
        ratingCount: products.ratingCount,
        isFeatured: products.isFeatured,
        metadata: products.metadata,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereCondition)
      .limit(50);

    return NextResponse.json({
      query,
      category,
      results: results.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      count: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
