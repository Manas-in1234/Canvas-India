-- Customizer product-type cards (Single Print, Wall Display, ...) — the
-- PRODUCTS tab content, previously hardcoded in the frontend data files.
CREATE TABLE "customizer_product_types" (
    "id" TEXT NOT NULL,
    "material" "MaterialScope" NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "starting_price" DECIMAL(12,2) NOT NULL,
    "image" TEXT,
    "icon_type" TEXT,
    "panels_count" INTEGER,
    "description" TEXT,
    "default_size_option_id" TEXT,
    "default_shape_id" TEXT,
    "default_layout_id" TEXT,
    "default_hardware_id" TEXT,
    "default_thickness_id" TEXT,
    "supported_shape_ids" JSONB,
    "supported_hardware_ids" JSONB,
    "supported_layout_ids" JSONB,
    "capabilities" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customizer_product_types_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customizer_product_types_material_slug_key" ON "customizer_product_types"("material", "slug");
