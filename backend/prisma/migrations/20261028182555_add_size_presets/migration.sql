-- CreateTable
CREATE TABLE "size_presets" (
    "id" TEXT NOT NULL,
    "product_type_id" TEXT NOT NULL,
    "shape_id" TEXT,
    "label" TEXT NOT NULL,
    "dimensions_summary" TEXT NOT NULL,
    "width_inches" DECIMAL(6,2) NOT NULL,
    "height_inches" DECIMAL(6,2) NOT NULL,
    "acrylic_price" DECIMAL(12,2) NOT NULL,
    "canvas_price" DECIMAL(12,2) NOT NULL,
    "category" TEXT,
    "panels_count" INTEGER,
    "panels" JSONB,
    "arrangement" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "size_presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "size_presets_product_type_id_shape_id_idx" ON "size_presets"("product_type_id", "shape_id");
