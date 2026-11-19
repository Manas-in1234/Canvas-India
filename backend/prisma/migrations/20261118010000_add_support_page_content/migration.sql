-- Per-field text overrides for the storefront's legal/support pages.

-- CreateTable
CREATE TABLE "support_page_content" (
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_page_content_pkey" PRIMARY KEY ("slug")
);
