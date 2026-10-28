/*
  Warnings:

  - You are about to drop the column `svg_path_data` on the `custom_shapes` table. All the data in the column will be lost.
  - Added the required column `clip_path_value` to the `custom_shapes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShapeOrigin" AS ENUM ('BUILT_IN', 'ADMIN_UPLOADED');

-- CreateEnum
CREATE TYPE "ClipPathType" AS ENUM ('SVG_PATH', 'CSS_FUNCTION');

-- DropForeignKey
ALTER TABLE "custom_shapes" DROP CONSTRAINT "custom_shapes_source_asset_id_fkey";

-- AlterTable
ALTER TABLE "custom_shapes" DROP COLUMN "svg_path_data",
ADD COLUMN     "area_rate_per_sqin" DECIMAL(12,4),
ADD COLUMN     "aspect_ratio" DECIMAL(6,4) NOT NULL DEFAULT 1,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'special',
ADD COLUMN     "clip_path_type" "ClipPathType" NOT NULL DEFAULT 'SVG_PATH',
ADD COLUMN     "clip_path_value" TEXT NOT NULL,
ADD COLUMN     "flat_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "is_single_dimension" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "origin" "ShapeOrigin" NOT NULL DEFAULT 'ADMIN_UPLOADED',
ADD COLUMN     "price_mode" "OptionPriceMode" NOT NULL DEFAULT 'FLAT',
ADD COLUMN     "shape_type" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "source_asset_id" DROP NOT NULL,
ALTER COLUMN "created_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "custom_shapes" ADD CONSTRAINT "custom_shapes_source_asset_id_fkey" FOREIGN KEY ("source_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
