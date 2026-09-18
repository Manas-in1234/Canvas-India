-- AlterTable
ALTER TABLE "customers" ADD COLUMN "guest_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_guest_token_key" ON "customers"("guest_token");
