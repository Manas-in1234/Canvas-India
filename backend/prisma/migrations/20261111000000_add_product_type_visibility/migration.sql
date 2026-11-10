-- Lets the admin hide a whole category (product type) from the public website.
ALTER TABLE "product_types" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
