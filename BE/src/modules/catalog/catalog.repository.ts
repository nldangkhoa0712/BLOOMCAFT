import { and, asc, count, desc, eq, exists, ilike, isNull, or, type SQL } from 'drizzle-orm';
import { db } from '../../configs/db';
import {
    categoriesInCatalog,
    productCategoriesInCatalog,
    productImagesInCatalog,
    productsInCatalog,
} from '../../db/drizzle/schema';
import type { ProductListQuery } from './catalog.schema';

const publicProductConditions = [
    eq(productsInCatalog.status, 'ACTIVE'),
    isNull(productsInCatalog.deletedAt),
];

export async function findActiveCategories() {
    return db
        .select({
            id: categoriesInCatalog.id,
            name: categoriesInCatalog.name,
            slug: categoriesInCatalog.slug,
            description: categoriesInCatalog.description,
            parentId: categoriesInCatalog.parentId,
        })
        .from(categoriesInCatalog)
        .where(eq(categoriesInCatalog.isActive, true))
        .orderBy(asc(categoriesInCatalog.name));
}

export async function findProducts(query: ProductListQuery) {
    const conditions: SQL[] = [...publicProductConditions];

    if (query.search) {
        const searchPattern = `%${query.search}%`;
        const searchCondition = or(
            ilike(productsInCatalog.name, searchPattern),
            ilike(productsInCatalog.description, searchPattern),
        );
        if (searchCondition) conditions.push(searchCondition);
    }

    if (query.category) {
        conditions.push(
            exists(
                db
                    .select({ value: productCategoriesInCatalog.productId })
                    .from(productCategoriesInCatalog)
                    .innerJoin(
                        categoriesInCatalog,
                        eq(productCategoriesInCatalog.categoryId, categoriesInCatalog.id),
                    )
                    .where(
                        and(
                            eq(productCategoriesInCatalog.productId, productsInCatalog.id),
                            eq(categoriesInCatalog.slug, query.category),
                            eq(categoriesInCatalog.isActive, true),
                        ),
                    ),
            ),
        );
    }

    const where = and(...conditions);
    const orderBy =
        query.sort === 'price_asc'
            ? asc(productsInCatalog.sellingPrice)
            : query.sort === 'price_desc'
              ? desc(productsInCatalog.sellingPrice)
              : desc(productsInCatalog.createdAt);

    const [[totalRow], rows] = await Promise.all([
        db.select({ total: count() }).from(productsInCatalog).where(where),
        db
            .select({
                id: productsInCatalog.id,
                name: productsInCatalog.name,
                slug: productsInCatalog.slug,
                description: productsInCatalog.description,
                price: productsInCatalog.sellingPrice,
                primaryImageUrl: productImagesInCatalog.secureUrl,
                primaryImageAlt: productImagesInCatalog.altText,
            })
            .from(productsInCatalog)
            .leftJoin(
                productImagesInCatalog,
                and(
                    eq(productImagesInCatalog.productId, productsInCatalog.id),
                    eq(productImagesInCatalog.isPrimary, true),
                ),
            )
            .where(where)
            .orderBy(orderBy, asc(productsInCatalog.id))
            .limit(query.limit)
            .offset((query.page - 1) * query.limit),
    ]);

    return {
        total: totalRow?.total ?? 0,
        products: rows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
            price: row.price,
            primaryImage: row.primaryImageUrl
                ? { secureUrl: row.primaryImageUrl, altText: row.primaryImageAlt }
                : null,
        })),
    };
}

export async function findProductBySlug(slug: string) {
    const [product] = await db
        .select({
            id: productsInCatalog.id,
            name: productsInCatalog.name,
            slug: productsInCatalog.slug,
            description: productsInCatalog.description,
            price: productsInCatalog.sellingPrice,
        })
        .from(productsInCatalog)
        .where(and(...publicProductConditions, eq(productsInCatalog.slug, slug)))
        .limit(1);

    if (!product) return null;

    const [images, categories] = await Promise.all([
        db
            .select({
                id: productImagesInCatalog.id,
                secureUrl: productImagesInCatalog.secureUrl,
                altText: productImagesInCatalog.altText,
                sortOrder: productImagesInCatalog.sortOrder,
                isPrimary: productImagesInCatalog.isPrimary,
            })
            .from(productImagesInCatalog)
            .where(eq(productImagesInCatalog.productId, product.id))
            .orderBy(desc(productImagesInCatalog.isPrimary), asc(productImagesInCatalog.sortOrder)),
        db
            .select({
                id: categoriesInCatalog.id,
                name: categoriesInCatalog.name,
                slug: categoriesInCatalog.slug,
            })
            .from(productCategoriesInCatalog)
            .innerJoin(categoriesInCatalog, eq(productCategoriesInCatalog.categoryId, categoriesInCatalog.id))
            .where(
                and(
                    eq(productCategoriesInCatalog.productId, product.id),
                    eq(categoriesInCatalog.isActive, true),
                ),
            )
            .orderBy(asc(categoriesInCatalog.name)),
    ]);

    return { ...product, images, categories };
}
