-- CreateTable
CREATE TABLE "pricing_settings" (
    "key" TEXT NOT NULL,
    "value" DECIMAL(12,4) NOT NULL,
    "description" TEXT,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_settings_pkey" PRIMARY KEY ("key")
);
