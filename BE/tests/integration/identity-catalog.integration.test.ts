import { randomUUID } from 'node:crypto';
import { eq, inArray } from 'drizzle-orm';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const testDatabaseUrl = process.env.DATABASE_URL;
const runIntegration = testDatabaseUrl ? describe : describe.skip;

runIntegration('Identity và Catalog API với PostgreSQL thật', () => {
    let app: Awaited<typeof import('../../src/app')>['default'];
    let dbModule: Awaited<typeof import('../../src/configs/db')>;
    let schema: Awaited<typeof import('../../src/db/drizzle/schema')>;

    const marker = randomUUID();
    const testEmail = `test.${marker}@bloomcraft.local`;
    const categorySlug = `test-category-${marker}`;
    const productSlug = `test-product-${marker}`;

    beforeAll(async () => {
        process.env.DATABASE_URL = testDatabaseUrl!;
        const [appModule, loadedDbModule, loadedSchema] = await Promise.all([
            import('../../src/app'),
            import('../../src/configs/db'),
            import('../../src/db/drizzle/schema'),
        ]);
        app = appModule.default;
        dbModule = loadedDbModule;
        schema = loadedSchema;

        const roles = await dbModule.db
            .select({ code: schema.rolesInIdentity.code })
            .from(schema.rolesInIdentity)
            .where(inArray(schema.rolesInIdentity.code, ['CUSTOMER', 'ADMIN', 'FLORIST']));
        expect(new Set(roles.map((role) => role.code))).toEqual(new Set(['CUSTOMER', 'ADMIN', 'FLORIST']));

        const [category] = await dbModule.db
            .insert(schema.categoriesInCatalog)
            .values({
                name: `TEST Category ${marker}`,
                slug: categorySlug,
                description: `TEST integration category ${marker}`,
                isActive: true,
            })
            .returning({ id: schema.categoriesInCatalog.id });
        const [product] = await dbModule.db
            .insert(schema.productsInCatalog)
            .values({
                sku: `TEST-${marker}`,
                name: `TEST Product ${marker}`,
                slug: productSlug,
                description: `TEST integration product ${marker}`,
                sellingPrice: '350000.00',
                status: 'ACTIVE',
            })
            .returning({ id: schema.productsInCatalog.id });

        if (!category || !product) throw new Error('Không thể tạo dữ liệu TEST cho integration test');

        await dbModule.db.insert(schema.productCategoriesInCatalog).values({
            categoryId: category.id,
            productId: product.id,
        });
        await dbModule.db.insert(schema.productImagesInCatalog).values({
            productId: product.id,
            cloudinaryPublicId: `TEST/${marker}`,
            secureUrl: `https://example.com/test-${marker}.jpg`,
            altText: `TEST Product ${marker}`,
            isPrimary: true,
        });
    });

    afterAll(async () => {
        await dbModule?.pool.end();
    });

    it('đăng ký, đăng nhập, lấy profile, refresh rotation và logout', async () => {
        const password = 'Valid@Test123';
        const registration = await request(app).post('/api/v1/identity/register').send({
            email: testEmail.toUpperCase(),
            password,
            fullName: `TEST User ${marker}`,
        });
        expect(registration.status).toBe(201);
        expect(registration.body).toEqual({ success: true });

        const login = await request(app).post('/api/v1/identity/login').send({ email: testEmail, password });
        expect(login.status).toBe(200);
        expect(login.body.data.profile.roles).toContain('CUSTOMER');
        const accessToken = login.body.data.accessToken as string;
        const originalCookie = login.headers['set-cookie']?.[0] as string;
        expect(originalCookie).toContain('HttpOnly');

        const profile = await request(app)
            .get('/api/v1/identity/profile')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(profile.status).toBe(200);
        expect(profile.body.data.email).toBe(testEmail);

        const refreshed = await request(app).post('/api/v1/identity/refresh').set('Cookie', originalCookie);
        expect(refreshed.status).toBe(200);
        const rotatedCookie = refreshed.headers['set-cookie']?.[0] as string;

        const replay = await request(app).post('/api/v1/identity/refresh').set('Cookie', originalCookie);
        expect(replay.status).toBe(401);

        const logout = await request(app).post('/api/v1/identity/logout').set('Cookie', rotatedCookie);
        expect(logout.status).toBe(200);
    });

    it('lọc danh sách và lấy chi tiết sản phẩm public', async () => {
        const list = await request(app).get('/api/v1/catalog/products').query({
            search: marker,
            category: categorySlug,
            sort: 'price_asc',
        });
        expect(list.status).toBe(200);
        expect(list.body.data).toHaveLength(1);
        expect(list.body.data[0]).toMatchObject({ slug: productSlug, price: '350000.00' });
        expect(list.body.meta.totalItems).toBe(1);

        const detail = await request(app).get(`/api/v1/catalog/products/${productSlug}`);
        expect(detail.status).toBe(200);
        expect(detail.body.data.images).toHaveLength(1);
        expect(detail.body.data.categories[0].slug).toBe(categorySlug);

        const [storedProduct] = await dbModule.db
            .select({ name: schema.productsInCatalog.name })
            .from(schema.productsInCatalog)
            .where(eq(schema.productsInCatalog.slug, productSlug));
        expect(storedProduct?.name).toContain('TEST');
    });
});
