import { pgTable, pgSchema, unique, check, uuid, varchar, numeric, boolean, timestamp, index, foreignKey, uniqueIndex, text, jsonb, integer, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const inventory = pgSchema("inventory");
export const catalog = pgSchema("catalog");
export const aiDesigner = pgSchema("ai_designer");
export const commerce = pgSchema("commerce");
export const identity = pgSchema("identity");
export const fulfillment = pgSchema("fulfillment");


export const bouquetRecipesInInventory = inventory.table("bouquet_recipes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	recipeCode: varchar("recipe_code", { length: 50 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	recipeSource: varchar("recipe_source", { length: 20 }).notNull(),
	materialCost: numeric("material_cost", { precision: 14, scale:  2 }).default('0').notNull(),
	laborCost: numeric("labor_cost", { precision: 14, scale:  2 }).default('0').notNull(),
	sellingPrice: numeric("selling_price", { precision: 14, scale:  2 }).default('0').notNull(),
	isFeasible: boolean("is_feasible").default(false).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("bouquet_recipes_recipe_code_key").on(table.recipeCode),
	check("bouquet_recipes_labor_cost_check", sql`labor_cost >= (0)::numeric`),
	check("bouquet_recipes_material_cost_check", sql`material_cost >= (0)::numeric`),
	check("bouquet_recipes_recipe_source_check", sql`(recipe_source)::text = ANY ((ARRAY['STANDARD'::character varying, 'AI_CUSTOM'::character varying])::text[])`),
	check("bouquet_recipes_selling_price_check", sql`selling_price >= (0)::numeric`),
]);

export const bouquetRecipeItemsInInventory = inventory.table("bouquet_recipe_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	recipeId: uuid("recipe_id").notNull(),
	ingredientId: uuid("ingredient_id").notNull(),
	quantity: numeric({ precision: 12, scale:  3 }).notNull(),
	unitCostSnapshot: numeric("unit_cost_snapshot", { precision: 14, scale:  2 }).notNull(),
	isSubstitution: boolean("is_substitution").default(false).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_recipe_items_ingredient").using("btree", table.ingredientId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ingredientId],
			foreignColumns: [ingredientsInInventory.id],
			name: "bouquet_recipe_items_ingredient_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.recipeId],
			foreignColumns: [bouquetRecipesInInventory.id],
			name: "bouquet_recipe_items_recipe_id_fkey"
		}).onDelete("restrict"),
	unique("bouquet_recipe_items_recipe_id_ingredient_id_key").on(table.ingredientId, table.recipeId),
	check("bouquet_recipe_items_quantity_check", sql`quantity > (0)::numeric`),
	check("bouquet_recipe_items_unit_cost_snapshot_check", sql`unit_cost_snapshot >= (0)::numeric`),
]);

export const productRecipesInCatalog = catalog.table("product_recipes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	recipeId: uuid("recipe_id").notNull(),
	isDefault: boolean("is_default").default(false).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_product_recipes_recipe").using("btree", table.recipeId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_product_default_recipe").using("btree", table.productId.asc().nullsLast().op("uuid_ops")).where(sql`is_default`),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "product_recipes_product_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.recipeId],
			foreignColumns: [bouquetRecipesInInventory.id],
			name: "product_recipes_recipe_id_fkey"
		}).onDelete("restrict"),
	unique("product_recipes_product_id_recipe_id_key").on(table.productId, table.recipeId),
]);

export const bouquetDesignsInAiDesigner = aiDesigner.table("bouquet_designs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	originalPrompt: text("original_prompt").notNull(),
	occasion: varchar({ length: 100 }),
	recipientType: varchar("recipient_type", { length: 100 }),
	budget: numeric({ precision: 14, scale:  2 }),
	preferredColors: jsonb("preferred_colors").default([]).notNull(),
	style: varchar({ length: 100 }),
	parsedRequirements: jsonb("parsed_requirements"),
	status: varchar({ length: 20 }).default('DRAFT').notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_bouquet_designs_user_created").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInIdentity.id],
			name: "bouquet_designs_user_id_fkey"
		}).onDelete("restrict"),
	check("bouquet_designs_budget_check", sql`budget > (0)::numeric`),
	check("bouquet_designs_status_check", sql`(status)::text = ANY ((ARRAY['DRAFT'::character varying, 'GENERATED'::character varying, 'CONFIRMED'::character varying])::text[])`),
	check("ck_preferred_colors_array", sql`jsonb_typeof(preferred_colors) = 'array'::text`),
]);

export const bouquetDesignVersionsInAiDesigner = aiDesigner.table("bouquet_design_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	designId: uuid("design_id").notNull(),
	versionNumber: integer("version_number").notNull(),
	recipeId: uuid("recipe_id"),
	estimatedPrice: numeric("estimated_price", { precision: 14, scale:  2 }).default('0').notNull(),
	explanation: text(),
	previewUrl: text("preview_url"),
	previewPublicId: varchar("preview_public_id", { length: 255 }),
	status: varchar({ length: 20 }).default('PROPOSED').notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_selected_version_per_design").using("btree", table.designId.asc().nullsLast().op("uuid_ops")).where(sql`((status)::text = 'SELECTED'::text)`),
	foreignKey({
			columns: [table.designId],
			foreignColumns: [bouquetDesignsInAiDesigner.id],
			name: "bouquet_design_versions_design_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.recipeId],
			foreignColumns: [bouquetRecipesInInventory.id],
			name: "bouquet_design_versions_recipe_id_fkey"
		}).onDelete("restrict"),
	unique("bouquet_design_versions_design_id_version_number_key").on(table.designId, table.versionNumber),
	unique("bouquet_design_versions_recipe_id_key").on(table.recipeId),
	check("bouquet_design_versions_estimated_price_check", sql`estimated_price >= (0)::numeric`),
	check("bouquet_design_versions_status_check", sql`(status)::text = ANY ((ARRAY['PROPOSED'::character varying, 'SELECTED'::character varying, 'REJECTED'::character varying])::text[])`),
	check("bouquet_design_versions_version_number_check", sql`version_number > 0`),
	check("ck_selected_version_has_recipe", sql`((status)::text <> 'SELECTED'::text) OR (recipe_id IS NOT NULL)`),
]);

export const aiGenerationLogsInAiDesigner = aiDesigner.table("ai_generation_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	designId: uuid("design_id").notNull(),
	versionId: uuid("version_id"),
	operation: varchar({ length: 20 }).notNull(),
	modelName: varchar("model_name", { length: 100 }),
	status: varchar({ length: 20 }).notNull(),
	durationMs: integer("duration_ms").default(0).notNull(),
	inputMetadata: jsonb("input_metadata"),
	outputMetadata: jsonb("output_metadata"),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_ai_logs_design_created").using("btree", table.designId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.designId],
			foreignColumns: [bouquetDesignsInAiDesigner.id],
			name: "ai_generation_logs_design_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.versionId],
			foreignColumns: [bouquetDesignVersionsInAiDesigner.id],
			name: "ai_generation_logs_version_id_fkey"
		}).onDelete("set null"),
	check("ai_generation_logs_duration_ms_check", sql`duration_ms >= 0`),
	check("ai_generation_logs_operation_check", sql`(operation)::text = ANY ((ARRAY['PARSE'::character varying, 'OPTIMIZE'::character varying, 'IMAGE'::character varying])::text[])`),
	check("ai_generation_logs_status_check", sql`(status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILED'::character varying])::text[])`),
]);

export const cartsInCommerce = commerce.table("carts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInIdentity.id],
			name: "carts_user_id_fkey"
		}).onDelete("cascade"),
	unique("carts_user_id_key").on(table.userId),
]);

export const cartItemsInCommerce = commerce.table("cart_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	cartId: uuid("cart_id").notNull(),
	productId: uuid("product_id").notNull(),
	quantity: integer().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_cart_items_product").using("btree", table.productId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cartsInCommerce.id],
			name: "cart_items_cart_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "cart_items_product_id_fkey"
		}).onDelete("restrict"),
	unique("cart_items_cart_id_product_id_key").on(table.cartId, table.productId),
	check("cart_items_quantity_check", sql`quantity > 0`),
]);

export const ordersInCommerce = commerce.table("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderNumber: varchar("order_number", { length: 40 }).notNull(),
	userId: uuid("user_id").notNull(),
	recipientName: varchar("recipient_name", { length: 150 }).notNull(),
	recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
	shippingAddress: jsonb("shipping_address").notNull(),
	deliveryDate: date("delivery_date").notNull(),
	deliveryNote: text("delivery_note"),
	subtotal: numeric({ precision: 14, scale:  2 }).default('0').notNull(),
	shippingFee: numeric("shipping_fee", { precision: 14, scale:  2 }).default('0').notNull(),
	discountAmount: numeric("discount_amount", { precision: 14, scale:  2 }).default('0').notNull(),
	totalAmount: numeric("total_amount", { precision: 14, scale:  2 }).default('0').notNull(),
	paymentMethod: varchar("payment_method", { length: 20 }).default('COD').notNull(),
	paymentStatus: varchar("payment_status", { length: 20 }).default('UNPAID').notNull(),
	status: varchar({ length: 20 }).default('PENDING').notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_orders_status_delivery").using("btree", table.status.asc().nullsLast().op("date_ops"), table.deliveryDate.asc().nullsLast().op("text_ops")),
	index("ix_orders_user_created").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInIdentity.id],
			name: "orders_user_id_fkey"
		}).onDelete("restrict"),
	unique("orders_order_number_key").on(table.orderNumber),
	check("ck_order_address_object", sql`jsonb_typeof(shipping_address) = 'object'::text`),
	check("ck_order_total_math", sql`(total_amount = ((subtotal + shipping_fee) - discount_amount)) AND (discount_amount <= (subtotal + shipping_fee))`),
	check("orders_discount_amount_check", sql`discount_amount >= (0)::numeric`),
	check("orders_payment_method_check", sql`(payment_method)::text = ANY ((ARRAY['COD'::character varying, 'VNPAY'::character varying, 'MOMO'::character varying])::text[])`),
	check("orders_payment_status_check", sql`(payment_status)::text = ANY ((ARRAY['UNPAID'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])`),
	check("orders_shipping_fee_check", sql`shipping_fee >= (0)::numeric`),
	check("orders_status_check", sql`(status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])`),
	check("orders_subtotal_check", sql`subtotal >= (0)::numeric`),
	check("orders_total_amount_check", sql`total_amount >= (0)::numeric`),
]);

export const usersInIdentity = identity.table("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: text("password_hash").notNull(),
	fullName: varchar("full_name", { length: 150 }).notNull(),
	phone: varchar({ length: 20 }),
	avatarUrl: text("avatar_url"),
	status: varchar({ length: 20 }).default('ACTIVE').notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { precision: 3, withTimezone: true, mode: 'string' }),
	lastLoginAt: timestamp("last_login_at", { precision: 3, withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_users_email_lower").using("btree", sql`lower((email)::text)`),
	check("ck_users_email_not_blank", sql`length(btrim((email)::text)) > 0`),
	check("users_status_check", sql`(status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'BLOCKED'::character varying])::text[])`),
]);

export const rolesInIdentity = identity.table("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar({ length: 30 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
}, (table) => [
	unique("roles_code_key").on(table.code),
	check("ck_roles_code", sql`length(btrim((code)::text)) > 0`),
]);

export const userAddressesInIdentity = identity.table("user_addresses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	recipientName: varchar("recipient_name", { length: 150 }).notNull(),
	recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
	province: varchar({ length: 150 }).notNull(),
	ward: varchar({ length: 150 }),
	addressLine: text("address_line").notNull(),
	label: varchar({ length: 50 }),
	isDefault: boolean("is_default").default(false).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_user_addresses_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_user_default_address").using("btree", table.userId.asc().nullsLast().op("uuid_ops")).where(sql`is_default`),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInIdentity.id],
			name: "user_addresses_user_id_fkey"
		}).onDelete("cascade"),
]);

export const refreshTokensInIdentity = identity.table("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { precision: 3, withTimezone: true, mode: 'string' }).notNull(),
	revokedAt: timestamp("revoked_at", { precision: 3, withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_refresh_tokens_user_expiry").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.expiresAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInIdentity.id],
			name: "refresh_tokens_user_id_fkey"
		}).onDelete("cascade"),
	unique("refresh_tokens_token_hash_key").on(table.tokenHash),
]);

export const categoriesInCatalog = catalog.table("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 180 }).notNull(),
	description: text(),
	parentId: uuid("parent_id"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_categories_parent").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "categories_parent_id_fkey"
		}).onDelete("set null"),
	unique("categories_slug_key").on(table.slug),
	check("ck_categories_parent", sql`(parent_id IS NULL) OR (parent_id <> id)`),
]);

export const productsInCatalog = catalog.table("products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sku: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	slug: varchar({ length: 220 }).notNull(),
	description: text(),
	sellingPrice: numeric("selling_price", { precision: 14, scale:  2 }).default('0').notNull(),
	productType: varchar("product_type", { length: 20 }).default('READY_MADE').notNull(),
	status: varchar({ length: 20 }).default('DRAFT').notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { precision: 3, withTimezone: true, mode: 'string' }),
}, (table) => [
	index("ix_products_selling_price").using("btree", table.sellingPrice.asc().nullsLast().op("numeric_ops")),
	index("ix_products_status_created").using("btree", table.status.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	unique("products_sku_key").on(table.sku),
	unique("products_slug_key").on(table.slug),
	check("products_product_type_check", sql`(product_type)::text = 'READY_MADE'::text`),
	check("products_selling_price_check", sql`selling_price >= (0)::numeric`),
	check("products_status_check", sql`(status)::text = ANY ((ARRAY['DRAFT'::character varying, 'ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])`),
]);

export const productImagesInCatalog = catalog.table("product_images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
	secureUrl: text("secure_url").notNull(),
	altText: varchar("alt_text", { length: 255 }),
	sortOrder: integer("sort_order").default(0).notNull(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_product_images_product_sort").using("btree", table.productId.asc().nullsLast().op("int4_ops"), table.sortOrder.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_product_primary_image").using("btree", table.productId.asc().nullsLast().op("uuid_ops")).where(sql`is_primary`),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "product_images_product_id_fkey"
		}).onDelete("cascade"),
	unique("product_images_cloudinary_public_id_key").on(table.cloudinaryPublicId),
	check("product_images_sort_order_check", sql`sort_order >= 0`),
]);

export const ingredientsInInventory = inventory.table("ingredients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	ingredientType: varchar("ingredient_type", { length: 20 }).notNull(),
	color: varchar({ length: 50 }),
	unit: varchar({ length: 30 }).notNull(),
	unitCost: numeric("unit_cost", { precision: 14, scale:  2 }).default('0').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("ingredients_code_key").on(table.code),
	check("ingredients_ingredient_type_check", sql`(ingredient_type)::text = ANY ((ARRAY['FLOWER'::character varying, 'WRAPPING'::character varying, 'ACCESSORY'::character varying])::text[])`),
	check("ingredients_unit_cost_check", sql`unit_cost >= (0)::numeric`),
]);

export const inventoryBalancesInInventory = inventory.table("inventory_balances", {
	ingredientId: uuid("ingredient_id").primaryKey().notNull(),
	onHandQty: numeric("on_hand_qty", { precision: 12, scale:  3 }).default('0').notNull(),
	reservedQty: numeric("reserved_qty", { precision: 12, scale:  3 }).default('0').notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ingredientId],
			foreignColumns: [ingredientsInInventory.id],
			name: "inventory_balances_ingredient_id_fkey"
		}).onDelete("restrict"),
	check("ck_ingredient_inventory", sql`(on_hand_qty >= (0)::numeric) AND (reserved_qty >= (0)::numeric) AND (reserved_qty <= on_hand_qty)`),
]);

export const finishedGoodsInventoryInInventory = inventory.table("finished_goods_inventory", {
	productId: uuid("product_id").primaryKey().notNull(),
	onHandQty: integer("on_hand_qty").default(0).notNull(),
	reservedQty: integer("reserved_qty").default(0).notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "finished_goods_inventory_product_id_fkey"
		}).onDelete("restrict"),
	check("ck_finished_goods_inventory", sql`(on_hand_qty >= 0) AND (reserved_qty >= 0) AND (reserved_qty <= on_hand_qty)`),
]);

export const orderItemsInCommerce = commerce.table("order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	itemType: varchar("item_type", { length: 20 }).notNull(),
	productId: uuid("product_id"),
	bouquetDesignVersionId: uuid("bouquet_design_version_id"),
	productNameSnapshot: varchar("product_name_snapshot", { length: 200 }).notNull(),
	recipeSnapshot: jsonb("recipe_snapshot").notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 14, scale:  2 }).notNull(),
	lineTotal: numeric("line_total", { precision: 14, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_order_items_design_version").using("btree", table.bouquetDesignVersionId.asc().nullsLast().op("uuid_ops")),
	index("ix_order_items_order").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	index("ix_order_items_product").using("btree", table.productId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.bouquetDesignVersionId],
			foreignColumns: [bouquetDesignVersionsInAiDesigner.id],
			name: "order_items_bouquet_design_version_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [ordersInCommerce.id],
			name: "order_items_order_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "order_items_product_id_fkey"
		}).onDelete("restrict"),
	check("ck_order_item_recipe_snapshot", sql`jsonb_typeof(recipe_snapshot) = 'object'::text`),
	check("ck_order_item_reference", sql`(((item_type)::text = 'STANDARD'::text) AND (product_id IS NOT NULL) AND (bouquet_design_version_id IS NULL)) OR (((item_type)::text = 'CUSTOM'::text) AND (product_id IS NULL) AND (bouquet_design_version_id IS NOT NULL))`),
	check("ck_order_item_total", sql`line_total = (unit_price * (quantity)::numeric)`),
	check("order_items_item_type_check", sql`(item_type)::text = ANY ((ARRAY['STANDARD'::character varying, 'CUSTOM'::character varying])::text[])`),
	check("order_items_line_total_check", sql`line_total >= (0)::numeric`),
	check("order_items_quantity_check", sql`quantity > 0`),
	check("order_items_unit_price_check", sql`unit_price >= (0)::numeric`),
]);

export const orderStatusHistoriesInCommerce = commerce.table("order_status_histories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	fromStatus: varchar("from_status", { length: 20 }),
	toStatus: varchar("to_status", { length: 20 }).notNull(),
	changedBy: uuid("changed_by"),
	reason: text(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_order_status_history_order_created").using("btree", table.orderId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.changedBy],
			foreignColumns: [usersInIdentity.id],
			name: "order_status_histories_changed_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [ordersInCommerce.id],
			name: "order_status_histories_order_id_fkey"
		}).onDelete("restrict"),
	check("order_status_histories_from_status_check", sql`(from_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])`),
	check("order_status_histories_to_status_check", sql`(to_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])`),
]);

export const inventoryTransactionsInInventory = inventory.table("inventory_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	ingredientId: uuid("ingredient_id"),
	productId: uuid("product_id"),
	transactionType: varchar("transaction_type", { length: 20 }).notNull(),
	quantityDelta: numeric("quantity_delta", { precision: 12, scale:  3 }).notNull(),
	referenceType: varchar("reference_type", { length: 50 }),
	referenceId: uuid("reference_id"),
	unitCostSnapshot: numeric("unit_cost_snapshot", { precision: 14, scale:  2 }),
	note: text(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_inventory_tx_ingredient_created").using("btree", table.ingredientId.asc().nullsLast().op("uuid_ops"), table.createdAt.desc().nullsFirst().op("uuid_ops")),
	index("ix_inventory_tx_product_created").using("btree", table.productId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("ix_inventory_tx_reference").using("btree", table.referenceType.asc().nullsLast().op("text_ops"), table.referenceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInIdentity.id],
			name: "inventory_transactions_created_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.ingredientId],
			foreignColumns: [ingredientsInInventory.id],
			name: "inventory_transactions_ingredient_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "inventory_transactions_product_id_fkey"
		}).onDelete("restrict"),
	check("ck_finished_goods_whole_qty", sql`(product_id IS NULL) OR (quantity_delta = trunc(quantity_delta))`),
	check("ck_inventory_transaction_target", sql`(ingredient_id IS NOT NULL) <> (product_id IS NOT NULL)`),
	check("inventory_transactions_quantity_delta_check", sql`quantity_delta <> (0)::numeric`),
	check("inventory_transactions_transaction_type_check", sql`(transaction_type)::text = ANY ((ARRAY['IN'::character varying, 'OUT'::character varying, 'ADJUSTMENT'::character varying, 'WASTE'::character varying, 'PRODUCTION'::character varying])::text[])`),
	check("inventory_transactions_unit_cost_snapshot_check", sql`unit_cost_snapshot >= (0)::numeric`),
]);

export const inventoryReservationsInInventory = inventory.table("inventory_reservations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	orderItemId: uuid("order_item_id").notNull(),
	ingredientId: uuid("ingredient_id"),
	productId: uuid("product_id"),
	quantity: numeric({ precision: 12, scale:  3 }).notNull(),
	status: varchar({ length: 20 }).default('ACTIVE').notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_reservations_ingredient_active").using("btree", table.ingredientId.asc().nullsLast().op("uuid_ops")).where(sql`((status)::text = 'ACTIVE'::text)`),
	index("ix_reservations_order").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	index("ix_reservations_order_item_status").using("btree", table.orderItemId.asc().nullsLast().op("text_ops"), table.status.asc().nullsLast().op("uuid_ops")),
	index("ix_reservations_product_active").using("btree", table.productId.asc().nullsLast().op("uuid_ops")).where(sql`((status)::text = 'ACTIVE'::text)`),
	foreignKey({
			columns: [table.ingredientId],
			foreignColumns: [ingredientsInInventory.id],
			name: "inventory_reservations_ingredient_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [ordersInCommerce.id],
			name: "inventory_reservations_order_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.orderItemId],
			foreignColumns: [orderItemsInCommerce.id],
			name: "inventory_reservations_order_item_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "inventory_reservations_product_id_fkey"
		}).onDelete("restrict"),
	check("ck_reservation_finished_goods_whole_qty", sql`(product_id IS NULL) OR (quantity = trunc(quantity))`),
	check("ck_reservation_target", sql`(ingredient_id IS NOT NULL) <> (product_id IS NOT NULL)`),
	check("inventory_reservations_quantity_check", sql`quantity > (0)::numeric`),
	check("inventory_reservations_status_check", sql`(status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'CONSUMED'::character varying, 'RELEASED'::character varying])::text[])`),
]);

export const flowerJourneysInFulfillment = fulfillment.table("flower_journeys", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	orderItemId: uuid("order_item_id").notNull(),
	unitNumber: integer("unit_number").notNull(),
	status: varchar({ length: 20 }).default('NOT_STARTED').notNull(),
	startedAt: timestamp("started_at", { precision: 3, withTimezone: true, mode: 'string' }),
	completedAt: timestamp("completed_at", { precision: 3, withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_journeys_order").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [ordersInCommerce.id],
			name: "flower_journeys_order_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.orderItemId],
			foreignColumns: [orderItemsInCommerce.id],
			name: "flower_journeys_order_item_id_fkey"
		}).onDelete("restrict"),
	unique("flower_journeys_order_item_id_unit_number_key").on(table.orderItemId, table.unitNumber),
	check("ck_journey_dates", sql`(completed_at IS NULL) OR (started_at IS NULL) OR (completed_at >= started_at)`),
	check("flower_journeys_status_check", sql`(status)::text = ANY ((ARRAY['NOT_STARTED'::character varying, 'IN_PROGRESS'::character varying, 'QC_PENDING'::character varying, 'READY'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])`),
	check("flower_journeys_unit_number_check", sql`unit_number > 0`),
]);

export const journeyStepsInFulfillment = fulfillment.table("journey_steps", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	journeyId: uuid("journey_id").notNull(),
	stepCode: varchar("step_code", { length: 20 }).notNull(),
	sequenceNo: integer("sequence_no").notNull(),
	status: varchar({ length: 20 }).default('PENDING').notNull(),
	startedAt: timestamp("started_at", { precision: 3, withTimezone: true, mode: 'string' }),
	completedAt: timestamp("completed_at", { precision: 3, withTimezone: true, mode: 'string' }),
	updatedBy: uuid("updated_by"),
	note: text(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.journeyId],
			foreignColumns: [flowerJourneysInFulfillment.id],
			name: "journey_steps_journey_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [usersInIdentity.id],
			name: "journey_steps_updated_by_fkey"
		}).onDelete("set null"),
	unique("journey_steps_journey_id_sequence_no_key").on(table.journeyId, table.sequenceNo),
	unique("journey_steps_journey_id_step_code_key").on(table.journeyId, table.stepCode),
	check("ck_journey_step_dates", sql`(completed_at IS NULL) OR (started_at IS NULL) OR (completed_at >= started_at)`),
	check("journey_steps_sequence_no_check", sql`sequence_no > 0`),
	check("journey_steps_status_check", sql`(status)::text = ANY ((ARRAY['PENDING'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'REWORK_REQUIRED'::character varying])::text[])`),
	check("journey_steps_step_code_check", sql`(step_code)::text = ANY ((ARRAY['PREPARING'::character varying, 'ARRANGING'::character varying, 'QC'::character varying, 'READY'::character varying, 'HANDOVER'::character varying])::text[])`),
]);

export const floristAssignmentsInFulfillment = fulfillment.table("florist_assignments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	journeyId: uuid("journey_id").notNull(),
	floristId: uuid("florist_id").notNull(),
	assignedBy: uuid("assigned_by").notNull(),
	assignedAt: timestamp("assigned_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unassignedAt: timestamp("unassigned_at", { precision: 3, withTimezone: true, mode: 'string' }),
	note: text(),
}, (table) => [
	index("ix_florist_assignments_florist_active").using("btree", table.floristId.asc().nullsLast().op("timestamptz_ops"), table.unassignedAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("uq_active_florist_assignment").using("btree", table.journeyId.asc().nullsLast().op("uuid_ops")).where(sql`(unassigned_at IS NULL)`),
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [usersInIdentity.id],
			name: "florist_assignments_assigned_by_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.floristId],
			foreignColumns: [usersInIdentity.id],
			name: "florist_assignments_florist_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.journeyId],
			foreignColumns: [flowerJourneysInFulfillment.id],
			name: "florist_assignments_journey_id_fkey"
		}).onDelete("restrict"),
	check("ck_assignment_dates", sql`(unassigned_at IS NULL) OR (unassigned_at >= assigned_at)`),
]);

export const journeyPhotosInFulfillment = fulfillment.table("journey_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	stepId: uuid("step_id").notNull(),
	cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
	secureUrl: text("secure_url").notNull(),
	caption: text(),
	isPublic: boolean("is_public").default(false).notNull(),
	uploadedBy: uuid("uploaded_by").notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_journey_photos_step").using("btree", table.stepId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.stepId],
			foreignColumns: [journeyStepsInFulfillment.id],
			name: "journey_photos_step_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [usersInIdentity.id],
			name: "journey_photos_uploaded_by_fkey"
		}).onDelete("restrict"),
	unique("journey_photos_cloudinary_public_id_key").on(table.cloudinaryPublicId),
]);

export const qualityChecksInFulfillment = fulfillment.table("quality_checks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	stepId: uuid("step_id").notNull(),
	reviewerId: uuid("reviewer_id").notNull(),
	result: varchar({ length: 20 }).notNull(),
	remarks: text(),
	attemptNumber: integer("attempt_number").notNull(),
	checkedAt: timestamp("checked_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_quality_checks_step_date").using("btree", table.stepId.asc().nullsLast().op("timestamptz_ops"), table.checkedAt.desc().nullsFirst().op("uuid_ops")),
	foreignKey({
			columns: [table.reviewerId],
			foreignColumns: [usersInIdentity.id],
			name: "quality_checks_reviewer_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.stepId],
			foreignColumns: [journeyStepsInFulfillment.id],
			name: "quality_checks_step_id_fkey"
		}).onDelete("restrict"),
	unique("quality_checks_step_id_attempt_number_key").on(table.attemptNumber, table.stepId),
	check("ck_qc_rejection_reason", sql`((result)::text <> 'REJECTED'::text) OR ((remarks IS NOT NULL) AND (length(btrim(remarks)) > 0))`),
	check("quality_checks_attempt_number_check", sql`attempt_number > 0`),
	check("quality_checks_result_check", sql`(result)::text = ANY ((ARRAY['APPROVED'::character varying, 'REJECTED'::character varying])::text[])`),
]);

export const productCategoriesInCatalog = catalog.table("product_categories", {
	productId: uuid("product_id").notNull(),
	categoryId: uuid("category_id").notNull(),
}, (table) => [
	index("ix_product_categories_category").using("btree", table.categoryId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categoriesInCatalog.id],
			name: "product_categories_category_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productsInCatalog.id],
			name: "product_categories_product_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.categoryId, table.productId], name: "product_categories_pkey"}),
]);

export const userRolesInIdentity = identity.table("user_roles", {
	userId: uuid("user_id").notNull(),
	roleId: uuid("role_id").notNull(),
	assignedAt: timestamp("assigned_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ix_user_roles_role").using("btree", table.roleId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [rolesInIdentity.id],
			name: "user_roles_role_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInIdentity.id],
			name: "user_roles_user_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.userId], name: "user_roles_pkey"}),
]);
