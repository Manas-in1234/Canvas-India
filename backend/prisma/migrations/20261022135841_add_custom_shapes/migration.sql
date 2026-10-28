/*
  Warnings:

  - You are about to drop the column `guest_token` on the `customers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomShapeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "customers_guest_token_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "guest_token";

-- CreateTable
CREATE TABLE "custom_shapes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source_asset_id" TEXT NOT NULL,
    "preview_asset_id" TEXT,
    "svg_path_data" TEXT NOT NULL,
    "status" "CustomShapeStatus" NOT NULL DEFAULT 'PENDING',
    "created_by" TEXT NOT NULL,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_shapes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "custom_shapes" ADD CONSTRAINT "custom_shapes_source_asset_id_fkey" FOREIGN KEY ("source_asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_shapes" ADD CONSTRAINT "custom_shapes_preview_asset_id_fkey" FOREIGN KEY ("preview_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
