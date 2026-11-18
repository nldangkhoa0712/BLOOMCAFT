import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/api-response';
import * as catalogService from './catalog.service';
import type { ProductListQuery } from './catalog.schema';

export async function listCategories(_request: Request, response: Response): Promise<Response> {
    return sendSuccess(response, await catalogService.listCategories());
}

export async function listProducts(request: Request, response: Response): Promise<Response> {
    const result = await catalogService.listProducts(request.query as unknown as ProductListQuery);
    return sendSuccess(response, result.products, { meta: result.meta });
}

export async function getProductBySlug(request: Request, response: Response): Promise<Response> {
    return sendSuccess(response, await catalogService.getProductBySlug(String(request.params.slug)));
}
