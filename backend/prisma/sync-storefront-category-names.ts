// One-off cleanup: Product.storefront.category is a display-name snapshot
// taken when a product was created or last saved - it goes stale the moment
// an admin renames the ProductType it belongs to (see src/api/productsApi.ts
// on the frontend, which now reads the live name instead of this snapshot,
// so this script is not required for correctness - only for not leaving
// stale text sitting in the database). Updates only the storefront.category
// (and .categorySlug, when the product has none set) field via the same
// merge-not-replace approach products.service.ts uses, so nothing else in
// each product's storefront blob is touched. Safe to re-run any time.
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    select: { id: true, storefront: true, productType: { select: { name: true } } },
  });

  let updated = 0;
  for (const product of products) {
    if (!product.storefront) continue;
    const storefront = product.storefront as Record<string, unknown>;
    const liveName = product.productType?.name;
    if (!liveName || storefront.category === liveName) continue;

    await prisma.product.update({
      where: { id: product.id },
      data: { storefront: { ...storefront, category: liveName } },
    });
    updated++;
  }

  console.log(`Checked ${products.length} product(s), updated ${updated} stale storefront.category value(s).`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
