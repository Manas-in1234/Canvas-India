-- CreateTable
CREATE TABLE "ndr_cases" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "status" "ShippingStatus" NOT NULL DEFAULT 'NDR',
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ndr_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rto_cases" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "received_at" TIMESTAMP(3),
    "inventory_updated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rto_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ndr_cases_shipment_id_idx" ON "ndr_cases"("shipment_id");

-- CreateIndex
CREATE INDEX "ndr_cases_status_idx" ON "ndr_cases"("status");

-- CreateIndex
CREATE INDEX "rto_cases_shipment_id_idx" ON "rto_cases"("shipment_id");

-- CreateIndex
CREATE INDEX "rto_cases_warehouse_id_idx" ON "rto_cases"("warehouse_id");

-- AddForeignKey
ALTER TABLE "ndr_cases" ADD CONSTRAINT "ndr_cases_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rto_cases" ADD CONSTRAINT "rto_cases_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rto_cases" ADD CONSTRAINT "rto_cases_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
