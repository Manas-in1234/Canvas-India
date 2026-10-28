-- CreateEnum
CREATE TYPE "MaterialScope" AS ENUM ('ACRYLIC', 'CANVAS', 'BOTH');

-- CreateEnum
CREATE TYPE "OptionPriceMode" AS ENUM ('FLAT', 'AREA_RATE');

-- CreateTable
CREATE TABLE "option_categories" (
    "id" TEXT NOT NULL,
    "baseKey" TEXT NOT NULL,
    "material_scope" "MaterialScope" NOT NULL DEFAULT 'BOTH',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "option_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_category_items" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "price_mode" "OptionPriceMode" NOT NULL DEFAULT 'FLAT',
    "flat_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "area_rate_per_sqin" DECIMAL(12,4),
    "extras" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "option_category_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "option_categories_baseKey_material_scope_key" ON "option_categories"("baseKey", "material_scope");

-- AddForeignKey
ALTER TABLE "option_category_items" ADD CONSTRAINT "option_category_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "option_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
