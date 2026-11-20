-- COD cash collection and remittance tracking. Delhivery's B2C Express API has no
-- endpoint or webhook for this (verified against their public docs), so these are
-- recorded by an admin from Delhivery's finance portal/remittance report, never
-- inferred from a shipment reaching DELIVERED.

-- CreateEnum
CREATE TYPE "CodCollectionStatus" AS ENUM ('PENDING', 'COLLECTED');

-- CreateEnum
CREATE TYPE "CodRemittanceStatus" AS ENUM ('PENDING', 'INITIATED', 'CREDITED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cod_collection_status" "CodCollectionStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cod_collected_amount" DECIMAL(12,2);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cod_collected_at" TIMESTAMP(3);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cod_collected_by" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "cod_collection_note" TEXT;

-- CreateIndex
CREATE INDEX "payments_provider_cod_collection_status_idx" ON "payments"("provider", "cod_collection_status");

-- CreateTable
CREATE TABLE "cod_remittances" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "remittance_date" TIMESTAMP(3) NOT NULL,
    "status" "CodRemittanceStatus" NOT NULL DEFAULT 'PENDING',
    "bank_reference" TEXT,
    "bank_credited_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cod_remittances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cod_remittances_status_idx" ON "cod_remittances"("status");

-- CreateIndex
CREATE INDEX "cod_remittances_remittance_date_idx" ON "cod_remittances"("remittance_date");

-- CreateTable
CREATE TABLE "cod_remittance_items" (
    "id" TEXT NOT NULL,
    "remittance_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cod_remittance_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cod_remittance_items_remittance_id_payment_id_key" ON "cod_remittance_items"("remittance_id", "payment_id");

-- CreateIndex
CREATE INDEX "cod_remittance_items_payment_id_idx" ON "cod_remittance_items"("payment_id");

-- AddForeignKey
ALTER TABLE "cod_remittance_items" ADD CONSTRAINT "cod_remittance_items_remittance_id_fkey" FOREIGN KEY ("remittance_id") REFERENCES "cod_remittances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cod_remittance_items" ADD CONSTRAINT "cod_remittance_items_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
