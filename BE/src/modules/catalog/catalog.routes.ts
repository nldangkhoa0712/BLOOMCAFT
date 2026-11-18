import { Router } from 'express';
import { validateParams, validateQuery } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/async-handler';
import * as controller from './catalog.controller';
import { productListQuerySchema, productSlugParamsSchema } from './catalog.schema';

export const catalogRoutes: Router = Router();

catalogRoutes.get('/categories', asyncHandler(controller.listCategories));
catalogRoutes.get('/products', validateQuery(productListQuerySchema), asyncHandler(controller.listProducts));
catalogRoutes.get('/products/:slug', validateParams(productSlugParamsSchema), asyncHandler(controller.getProductBySlug));
