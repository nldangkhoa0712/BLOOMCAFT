import { z } from 'zod';

export const productListQuerySchema = z
    .object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(20),
        search: z.string().trim().min(1).max(200).optional(),
        category: z.string().trim().min(1).max(180).optional(),
        sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'),
    })
    .strict();

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const productSlugParamsSchema = z.object({
    slug: z.string().trim().min(1).max(220),
});
