-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "inventory";
--> statement-breakpoint
CREATE SCHEMA "catalog";
--> statement-breakpoint
CREATE SCHEMA "ai_designer";
--> statement-breakpoint
CREATE SCHEMA "commerce";
--> statement-breakpoint
CREATE SCHEMA "identity";
--> statement-breakpoint
CREATE SCHEMA "fulfillment";
--> statement-breakpoint
CREATE TABLE "inventory"."bouquet_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_code" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"recipe_source" varchar(20) NOT NULL,
	"material_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"labor_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"selling_price" numeric(14, 2) DEFAULT '0' NOT NULL,
	"is_feasible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bouquet_recipes_recipe_code_key" UNIQUE("recipe_code"),
	CONSTRAINT "bouquet_recipes_labor_cost_check" CHECK (labor_cost >= (0)::numeric),
	CONSTRAINT "bouquet_recipes_material_cost_check" CHECK (material_cost >= (0)::numeric),
	CONSTRAINT "bouquet_recipes_recipe_source_check" CHECK ((recipe_source)::text = ANY ((ARRAY['STANDARD'::character varying, 'AI_CUSTOM'::character varying])::text[])),
	CONSTRAINT "bouquet_recipes_selling_price_check" CHECK (selling_price >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "inventory"."bouquet_recipe_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"quantity" numeric(12, 3) NOT NULL,
	"unit_cost_snapshot" numeric(14, 2) NOT NULL,
	"is_substitution" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bouquet_recipe_items_recipe_id_ingredient_id_key" UNIQUE("ingredient_id","recipe_id"),
	CONSTRAINT "bouquet_recipe_items_quantity_check" CHECK (quantity > (0)::numeric),
	CONSTRAINT "bouquet_recipe_items_unit_cost_snapshot_check" CHECK (unit_cost_snapshot >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "catalog"."product_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_recipes_product_id_recipe_id_key" UNIQUE("product_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "ai_designer"."bouquet_designs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"original_prompt" text NOT NULL,
	"occasion" varchar(100),
	"recipient_type" varchar(100),
	"budget" numeric(14, 2),
	"preferred_colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"style" varchar(100),
	"parsed_requirements" jsonb,
	"status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bouquet_designs_budget_check" CHECK (budget > (0)::numeric),
	CONSTRAINT "bouquet_designs_status_check" CHECK ((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'GENERATED'::character varying, 'CONFIRMED'::character varying])::text[])),
	CONSTRAINT "ck_preferred_colors_array" CHECK (jsonb_typeof(preferred_colors) = 'array'::text)
);
--> statement-breakpoint
CREATE TABLE "ai_designer"."bouquet_design_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"design_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"recipe_id" uuid,
	"estimated_price" numeric(14, 2) DEFAULT '0' NOT NULL,
	"explanation" text,
	"preview_url" text,
	"preview_public_id" varchar(255),
	"status" varchar(20) DEFAULT 'PROPOSED' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bouquet_design_versions_design_id_version_number_key" UNIQUE("design_id","version_number"),
	CONSTRAINT "bouquet_design_versions_recipe_id_key" UNIQUE("recipe_id"),
	CONSTRAINT "bouquet_design_versions_estimated_price_check" CHECK (estimated_price >= (0)::numeric),
	CONSTRAINT "bouquet_design_versions_status_check" CHECK ((status)::text = ANY ((ARRAY['PROPOSED'::character varying, 'SELECTED'::character varying, 'REJECTED'::character varying])::text[])),
	CONSTRAINT "bouquet_design_versions_version_number_check" CHECK (version_number > 0),
	CONSTRAINT "ck_selected_version_has_recipe" CHECK (((status)::text <> 'SELECTED'::text) OR (recipe_id IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "ai_designer"."ai_generation_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"design_id" uuid NOT NULL,
	"version_id" uuid,
	"operation" varchar(20) NOT NULL,
	"model_name" varchar(100),
	"status" varchar(20) NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"input_metadata" jsonb,
	"output_metadata" jsonb,
	"error_message" text,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_generation_logs_duration_ms_check" CHECK (duration_ms >= 0),
	CONSTRAINT "ai_generation_logs_operation_check" CHECK ((operation)::text = ANY ((ARRAY['PARSE'::character varying, 'OPTIMIZE'::character varying, 'IMAGE'::character varying])::text[])),
	CONSTRAINT "ai_generation_logs_status_check" CHECK ((status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILED'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "commerce"."carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "carts_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_cart_id_product_id_key" UNIQUE("cart_id","product_id"),
	CONSTRAINT "cart_items_quantity_check" CHECK (quantity > 0)
);
--> statement-breakpoint
CREATE TABLE "commerce"."orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(40) NOT NULL,
	"user_id" uuid NOT NULL,
	"recipient_name" varchar(150) NOT NULL,
	"recipient_phone" varchar(20) NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"delivery_date" date NOT NULL,
	"delivery_note" text,
	"subtotal" numeric(14, 2) DEFAULT '0' NOT NULL,
	"shipping_fee" numeric(14, 2) DEFAULT '0' NOT NULL,
	"discount_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"payment_method" varchar(20) DEFAULT 'COD' NOT NULL,
	"payment_status" varchar(20) DEFAULT 'UNPAID' NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_key" UNIQUE("order_number"),
	CONSTRAINT "ck_order_address_object" CHECK (jsonb_typeof(shipping_address) = 'object'::text),
	CONSTRAINT "ck_order_total_math" CHECK ((total_amount = ((subtotal + shipping_fee) - discount_amount)) AND (discount_amount <= (subtotal + shipping_fee))),
	CONSTRAINT "orders_discount_amount_check" CHECK (discount_amount >= (0)::numeric),
	CONSTRAINT "orders_payment_method_check" CHECK ((payment_method)::text = ANY ((ARRAY['COD'::character varying, 'VNPAY'::character varying, 'MOMO'::character varying])::text[])),
	CONSTRAINT "orders_payment_status_check" CHECK ((payment_status)::text = ANY ((ARRAY['UNPAID'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])),
	CONSTRAINT "orders_shipping_fee_check" CHECK (shipping_fee >= (0)::numeric),
	CONSTRAINT "orders_status_check" CHECK ((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])),
	CONSTRAINT "orders_subtotal_check" CHECK (subtotal >= (0)::numeric),
	CONSTRAINT "orders_total_amount_check" CHECK (total_amount >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "identity"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"phone" varchar(20),
	"avatar_url" text,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"email_verified_at" timestamp(3) with time zone,
	"last_login_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_users_email_not_blank" CHECK (length(btrim((email)::text)) > 0),
	CONSTRAINT "users_status_check" CHECK ((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'BLOCKED'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "identity"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "roles_code_key" UNIQUE("code"),
	CONSTRAINT "ck_roles_code" CHECK (length(btrim((code)::text)) > 0)
);
--> statement-breakpoint
CREATE TABLE "identity"."user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recipient_name" varchar(150) NOT NULL,
	"recipient_phone" varchar(20) NOT NULL,
	"province" varchar(150) NOT NULL,
	"ward" varchar(150),
	"address_line" text NOT NULL,
	"label" varchar(50),
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity"."refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp(3) with time zone NOT NULL,
	"revoked_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "catalog"."categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_key" UNIQUE("slug"),
	CONSTRAINT "ck_categories_parent" CHECK ((parent_id IS NULL) OR (parent_id <> id))
);
--> statement-breakpoint
CREATE TABLE "catalog"."products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"description" text,
	"selling_price" numeric(14, 2) DEFAULT '0' NOT NULL,
	"product_type" varchar(20) DEFAULT 'READY_MADE' NOT NULL,
	"status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(3) with time zone,
	CONSTRAINT "products_sku_key" UNIQUE("sku"),
	CONSTRAINT "products_slug_key" UNIQUE("slug"),
	CONSTRAINT "products_product_type_check" CHECK ((product_type)::text = 'READY_MADE'::text),
	CONSTRAINT "products_selling_price_check" CHECK (selling_price >= (0)::numeric),
	CONSTRAINT "products_status_check" CHECK ((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'ACTIVE'::character varying, 'INACTIVE'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "catalog"."product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"secure_url" text NOT NULL,
	"alt_text" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_images_cloudinary_public_id_key" UNIQUE("cloudinary_public_id"),
	CONSTRAINT "product_images_sort_order_check" CHECK (sort_order >= 0)
);
--> statement-breakpoint
CREATE TABLE "inventory"."ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"ingredient_type" varchar(20) NOT NULL,
	"color" varchar(50),
	"unit" varchar(30) NOT NULL,
	"unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ingredients_code_key" UNIQUE("code"),
	CONSTRAINT "ingredients_ingredient_type_check" CHECK ((ingredient_type)::text = ANY ((ARRAY['FLOWER'::character varying, 'WRAPPING'::character varying, 'ACCESSORY'::character varying])::text[])),
	CONSTRAINT "ingredients_unit_cost_check" CHECK (unit_cost >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "inventory"."inventory_balances" (
	"ingredient_id" uuid PRIMARY KEY NOT NULL,
	"on_hand_qty" numeric(12, 3) DEFAULT '0' NOT NULL,
	"reserved_qty" numeric(12, 3) DEFAULT '0' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_ingredient_inventory" CHECK ((on_hand_qty >= (0)::numeric) AND (reserved_qty >= (0)::numeric) AND (reserved_qty <= on_hand_qty))
);
--> statement-breakpoint
CREATE TABLE "inventory"."finished_goods_inventory" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"on_hand_qty" integer DEFAULT 0 NOT NULL,
	"reserved_qty" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_finished_goods_inventory" CHECK ((on_hand_qty >= 0) AND (reserved_qty >= 0) AND (reserved_qty <= on_hand_qty))
);
--> statement-breakpoint
CREATE TABLE "commerce"."order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"item_type" varchar(20) NOT NULL,
	"product_id" uuid,
	"bouquet_design_version_id" uuid,
	"product_name_snapshot" varchar(200) NOT NULL,
	"recipe_snapshot" jsonb NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(14, 2) NOT NULL,
	"line_total" numeric(14, 2) NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_order_item_recipe_snapshot" CHECK (jsonb_typeof(recipe_snapshot) = 'object'::text),
	CONSTRAINT "ck_order_item_reference" CHECK ((((item_type)::text = 'STANDARD'::text) AND (product_id IS NOT NULL) AND (bouquet_design_version_id IS NULL)) OR (((item_type)::text = 'CUSTOM'::text) AND (product_id IS NULL) AND (bouquet_design_version_id IS NOT NULL))),
	CONSTRAINT "ck_order_item_total" CHECK (line_total = (unit_price * (quantity)::numeric)),
	CONSTRAINT "order_items_item_type_check" CHECK ((item_type)::text = ANY ((ARRAY['STANDARD'::character varying, 'CUSTOM'::character varying])::text[])),
	CONSTRAINT "order_items_line_total_check" CHECK (line_total >= (0)::numeric),
	CONSTRAINT "order_items_quantity_check" CHECK (quantity > 0),
	CONSTRAINT "order_items_unit_price_check" CHECK (unit_price >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "commerce"."order_status_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"from_status" varchar(20),
	"to_status" varchar(20) NOT NULL,
	"changed_by" uuid,
	"reason" text,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_status_histories_from_status_check" CHECK ((from_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])),
	CONSTRAINT "order_status_histories_to_status_check" CHECK ((to_status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "inventory"."inventory_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingredient_id" uuid,
	"product_id" uuid,
	"transaction_type" varchar(20) NOT NULL,
	"quantity_delta" numeric(12, 3) NOT NULL,
	"reference_type" varchar(50),
	"reference_id" uuid,
	"unit_cost_snapshot" numeric(14, 2),
	"note" text,
	"created_by" uuid,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_finished_goods_whole_qty" CHECK ((product_id IS NULL) OR (quantity_delta = trunc(quantity_delta))),
	CONSTRAINT "ck_inventory_transaction_target" CHECK ((ingredient_id IS NOT NULL) <> (product_id IS NOT NULL)),
	CONSTRAINT "inventory_transactions_quantity_delta_check" CHECK (quantity_delta <> (0)::numeric),
	CONSTRAINT "inventory_transactions_transaction_type_check" CHECK ((transaction_type)::text = ANY ((ARRAY['IN'::character varying, 'OUT'::character varying, 'ADJUSTMENT'::character varying, 'WASTE'::character varying, 'PRODUCTION'::character varying])::text[])),
	CONSTRAINT "inventory_transactions_unit_cost_snapshot_check" CHECK (unit_cost_snapshot >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "inventory"."inventory_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"ingredient_id" uuid,
	"product_id" uuid,
	"quantity" numeric(12, 3) NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_reservation_finished_goods_whole_qty" CHECK ((product_id IS NULL) OR (quantity = trunc(quantity))),
	CONSTRAINT "ck_reservation_target" CHECK ((ingredient_id IS NOT NULL) <> (product_id IS NOT NULL)),
	CONSTRAINT "inventory_reservations_quantity_check" CHECK (quantity > (0)::numeric),
	CONSTRAINT "inventory_reservations_status_check" CHECK ((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'CONSUMED'::character varying, 'RELEASED'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "fulfillment"."flower_journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"unit_number" integer NOT NULL,
	"status" varchar(20) DEFAULT 'NOT_STARTED' NOT NULL,
	"started_at" timestamp(3) with time zone,
	"completed_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "flower_journeys_order_item_id_unit_number_key" UNIQUE("order_item_id","unit_number"),
	CONSTRAINT "ck_journey_dates" CHECK ((completed_at IS NULL) OR (started_at IS NULL) OR (completed_at >= started_at)),
	CONSTRAINT "flower_journeys_status_check" CHECK ((status)::text = ANY ((ARRAY['NOT_STARTED'::character varying, 'IN_PROGRESS'::character varying, 'QC_PENDING'::character varying, 'READY'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])),
	CONSTRAINT "flower_journeys_unit_number_check" CHECK (unit_number > 0)
);
--> statement-breakpoint
CREATE TABLE "fulfillment"."journey_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"step_code" varchar(20) NOT NULL,
	"sequence_no" integer NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"started_at" timestamp(3) with time zone,
	"completed_at" timestamp(3) with time zone,
	"updated_by" uuid,
	"note" text,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "journey_steps_journey_id_sequence_no_key" UNIQUE("journey_id","sequence_no"),
	CONSTRAINT "journey_steps_journey_id_step_code_key" UNIQUE("journey_id","step_code"),
	CONSTRAINT "ck_journey_step_dates" CHECK ((completed_at IS NULL) OR (started_at IS NULL) OR (completed_at >= started_at)),
	CONSTRAINT "journey_steps_sequence_no_check" CHECK (sequence_no > 0),
	CONSTRAINT "journey_steps_status_check" CHECK ((status)::text = ANY ((ARRAY['PENDING'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'REWORK_REQUIRED'::character varying])::text[])),
	CONSTRAINT "journey_steps_step_code_check" CHECK ((step_code)::text = ANY ((ARRAY['PREPARING'::character varying, 'ARRANGING'::character varying, 'QC'::character varying, 'READY'::character varying, 'HANDOVER'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "fulfillment"."florist_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"florist_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"assigned_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"unassigned_at" timestamp(3) with time zone,
	"note" text,
	CONSTRAINT "ck_assignment_dates" CHECK ((unassigned_at IS NULL) OR (unassigned_at >= assigned_at))
);
--> statement-breakpoint
CREATE TABLE "fulfillment"."journey_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"step_id" uuid NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"secure_url" text NOT NULL,
	"caption" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "journey_photos_cloudinary_public_id_key" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "fulfillment"."quality_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"step_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"result" varchar(20) NOT NULL,
	"remarks" text,
	"attempt_number" integer NOT NULL,
	"checked_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quality_checks_step_id_attempt_number_key" UNIQUE("attempt_number","step_id"),
	CONSTRAINT "ck_qc_rejection_reason" CHECK (((result)::text <> 'REJECTED'::text) OR ((remarks IS NOT NULL) AND (length(btrim(remarks)) > 0))),
	CONSTRAINT "quality_checks_attempt_number_check" CHECK (attempt_number > 0),
	CONSTRAINT "quality_checks_result_check" CHECK ((result)::text = ANY ((ARRAY['APPROVED'::character varying, 'REJECTED'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "catalog"."product_categories" (
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "product_categories_pkey" PRIMARY KEY("category_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "identity"."user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_pkey" PRIMARY KEY("role_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "inventory"."bouquet_recipe_items" ADD CONSTRAINT "bouquet_recipe_items_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "inventory"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."bouquet_recipe_items" ADD CONSTRAINT "bouquet_recipe_items_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "inventory"."bouquet_recipes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."product_recipes" ADD CONSTRAINT "product_recipes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."product_recipes" ADD CONSTRAINT "product_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "inventory"."bouquet_recipes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_designer"."bouquet_designs" ADD CONSTRAINT "bouquet_designs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_designer"."bouquet_design_versions" ADD CONSTRAINT "bouquet_design_versions_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "ai_designer"."bouquet_designs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_designer"."bouquet_design_versions" ADD CONSTRAINT "bouquet_design_versions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "inventory"."bouquet_recipes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_designer"."ai_generation_logs" ADD CONSTRAINT "ai_generation_logs_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "ai_designer"."bouquet_designs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_designer"."ai_generation_logs" ADD CONSTRAINT "ai_generation_logs_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "ai_designer"."bouquet_design_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "commerce"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity"."user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "catalog"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_balances" ADD CONSTRAINT "inventory_balances_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "inventory"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."finished_goods_inventory" ADD CONSTRAINT "finished_goods_inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_items" ADD CONSTRAINT "order_items_bouquet_design_version_id_fkey" FOREIGN KEY ("bouquet_design_version_id") REFERENCES "ai_designer"."bouquet_design_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_status_histories" ADD CONSTRAINT "order_status_histories_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "identity"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_status_histories" ADD CONSTRAINT "order_status_histories_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "identity"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "inventory"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_reservations" ADD CONSTRAINT "inventory_reservations_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "inventory"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_reservations" ADD CONSTRAINT "inventory_reservations_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_reservations" ADD CONSTRAINT "inventory_reservations_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "commerce"."order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory"."inventory_reservations" ADD CONSTRAINT "inventory_reservations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."flower_journeys" ADD CONSTRAINT "flower_journeys_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."flower_journeys" ADD CONSTRAINT "flower_journeys_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "commerce"."order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."journey_steps" ADD CONSTRAINT "journey_steps_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "fulfillment"."flower_journeys"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."journey_steps" ADD CONSTRAINT "journey_steps_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "identity"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."florist_assignments" ADD CONSTRAINT "florist_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "identity"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."florist_assignments" ADD CONSTRAINT "florist_assignments_florist_id_fkey" FOREIGN KEY ("florist_id") REFERENCES "identity"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."florist_assignments" ADD CONSTRAINT "florist_assignments_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "fulfillment"."flower_journeys"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."journey_photos" ADD CONSTRAINT "journey_photos_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "fulfillment"."journey_steps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."journey_photos" ADD CONSTRAINT "journey_photos_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "identity"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."quality_checks" ADD CONSTRAINT "quality_checks_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "identity"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment"."quality_checks" ADD CONSTRAINT "quality_checks_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "fulfillment"."journey_steps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "catalog"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog"."product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "catalog"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "identity"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_recipe_items_ingredient" ON "inventory"."bouquet_recipe_items" USING btree ("ingredient_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_product_recipes_recipe" ON "catalog"."product_recipes" USING btree ("recipe_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_product_default_recipe" ON "catalog"."product_recipes" USING btree ("product_id" uuid_ops) WHERE is_default;--> statement-breakpoint
CREATE INDEX "ix_bouquet_designs_user_created" ON "ai_designer"."bouquet_designs" USING btree ("user_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_selected_version_per_design" ON "ai_designer"."bouquet_design_versions" USING btree ("design_id" uuid_ops) WHERE ((status)::text = 'SELECTED'::text);--> statement-breakpoint
CREATE INDEX "ix_ai_logs_design_created" ON "ai_designer"."ai_generation_logs" USING btree ("design_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_cart_items_product" ON "commerce"."cart_items" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_orders_status_delivery" ON "commerce"."orders" USING btree ("status" date_ops,"delivery_date" text_ops);--> statement-breakpoint
CREATE INDEX "ix_orders_user_created" ON "commerce"."orders" USING btree ("user_id" uuid_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_email_lower" ON "identity"."users" USING btree (lower((email)::text) text_ops);--> statement-breakpoint
CREATE INDEX "ix_user_addresses_user" ON "identity"."user_addresses" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_default_address" ON "identity"."user_addresses" USING btree ("user_id" uuid_ops) WHERE is_default;--> statement-breakpoint
CREATE INDEX "ix_refresh_tokens_user_expiry" ON "identity"."refresh_tokens" USING btree ("user_id" timestamptz_ops,"expires_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_categories_parent" ON "catalog"."categories" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_products_selling_price" ON "catalog"."products" USING btree ("selling_price" numeric_ops);--> statement-breakpoint
CREATE INDEX "ix_products_status_created" ON "catalog"."products" USING btree ("status" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_product_images_product_sort" ON "catalog"."product_images" USING btree ("product_id" int4_ops,"sort_order" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_product_primary_image" ON "catalog"."product_images" USING btree ("product_id" uuid_ops) WHERE is_primary;--> statement-breakpoint
CREATE INDEX "ix_order_items_design_version" ON "commerce"."order_items" USING btree ("bouquet_design_version_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_order_items_order" ON "commerce"."order_items" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_order_items_product" ON "commerce"."order_items" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_order_status_history_order_created" ON "commerce"."order_status_histories" USING btree ("order_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_inventory_tx_ingredient_created" ON "inventory"."inventory_transactions" USING btree ("ingredient_id" uuid_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_inventory_tx_product_created" ON "inventory"."inventory_transactions" USING btree ("product_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_inventory_tx_reference" ON "inventory"."inventory_transactions" USING btree ("reference_type" text_ops,"reference_id" text_ops);--> statement-breakpoint
CREATE INDEX "ix_reservations_ingredient_active" ON "inventory"."inventory_reservations" USING btree ("ingredient_id" uuid_ops) WHERE ((status)::text = 'ACTIVE'::text);--> statement-breakpoint
CREATE INDEX "ix_reservations_order" ON "inventory"."inventory_reservations" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_reservations_order_item_status" ON "inventory"."inventory_reservations" USING btree ("order_item_id" text_ops,"status" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_reservations_product_active" ON "inventory"."inventory_reservations" USING btree ("product_id" uuid_ops) WHERE ((status)::text = 'ACTIVE'::text);--> statement-breakpoint
CREATE INDEX "ix_journeys_order" ON "fulfillment"."flower_journeys" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_florist_assignments_florist_active" ON "fulfillment"."florist_assignments" USING btree ("florist_id" timestamptz_ops,"unassigned_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_active_florist_assignment" ON "fulfillment"."florist_assignments" USING btree ("journey_id" uuid_ops) WHERE (unassigned_at IS NULL);--> statement-breakpoint
CREATE INDEX "ix_journey_photos_step" ON "fulfillment"."journey_photos" USING btree ("step_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ix_quality_checks_step_date" ON "fulfillment"."quality_checks" USING btree ("step_id" timestamptz_ops,"checked_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_product_categories_category" ON "catalog"."product_categories" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "ix_user_roles_role" ON "identity"."user_roles" USING btree ("role_id" uuid_ops);
*/