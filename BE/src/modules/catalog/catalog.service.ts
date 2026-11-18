import { ApiError } from '../../utils/api-error';
import type { PaginationMeta } from '../../utils/api-response';
import * as repository from './catalog.repository';
import type { ProductListQuery } from './catalog.schema';

export function listCategories() {
    return repository.findActiveCategories();
}

export async function listProducts(query: ProductListQuery) {
    const result = await repository.findProducts(query);
    const totalPages = result.total === 0 ? 0 : Math.ceil(result.total / query.limit);
    const meta: PaginationMeta = {
        page: query.page,
        limit: query.limit,
        totalItems: result.total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1 && totalPages > 0,
    };

    return { products: result.products, meta };
}

export async function getProductBySlug(slug: string) {
    const product = await repository.findProductBySlug(slug);
    if (!product) throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Không tìm thấy sản phẩm');
    return product;
}
