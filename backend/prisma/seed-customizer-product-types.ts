import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import {
  CANVAS_PRODUCT_TYPES,
  getCanvasProductCapabilities,
} from '../../src/data/canvasCustomizerData';
import { ACRYLIC_PRODUCT_TYPES } from '../../src/data/acrylicCustomizerData';

// One-off import of the storefront's hardcoded product-type cards into the
// customizer_product_types table. Safe to re-run: rows are matched on
// (material, slug) and an existing row is never overwritten, so admin edits
// made after the first run survive. Canvas capabilities are stored fully
// resolved (getCanvasProductCapabilities) instead of the thin override
// object on each entry, so the admin sees — and later the storefront can
// honor — the complete flag set instead of per-id string checks.

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  let created = 0;

  for (const [index, pt] of CANVAS_PRODUCT_TYPES.entries()) {
    const row = await prisma.customizerProductType.upsert({
      where: { material_slug: { material: 'CANVAS', slug: pt.id } },
      update: {},
      create: {
        material: 'CANVAS',
        slug: pt.id,
        name: pt.name,
        startingPrice: pt.startingPrice,
        image: pt.image || null,
        iconType: pt.iconType,
        panelsCount: pt.panelsCount,
        description: pt.description,
        defaultSizeOptionId: pt.defaultSizeOptionId,
        defaultShapeId: pt.defaultShape,
        defaultLayoutId: pt.defaultLayoutId,
        defaultHardwareId: pt.defaultHardwareId,
        defaultThicknessId: pt.defaultThicknessId,
        supportedShapeIds: pt.supportedShapeIds ?? undefined,
        supportedLayoutIds: pt.supportedLayoutIds ?? undefined,
        capabilities: getCanvasProductCapabilities(pt) as never,
        sortOrder: index,
      },
    });
    if (row.createdAt.getTime() > Date.now() - 5000) created++;
  }

  for (const [index, pt] of ACRYLIC_PRODUCT_TYPES.entries()) {
    const row = await prisma.customizerProductType.upsert({
      where: { material_slug: { material: 'ACRYLIC', slug: pt.id } },
      update: {},
      create: {
        material: 'ACRYLIC',
        slug: pt.id,
        name: pt.name,
        startingPrice: pt.startingPrice ?? pt.price,
        image: pt.image || null,
        iconType: pt.iconType,
        panelsCount: pt.panelsCount,
        description: pt.description,
        defaultSizeOptionId: pt.defaultSizeOptionId,
        defaultShapeId: pt.defaultShape,
        defaultLayoutId: pt.defaultLayoutId,
        defaultHardwareId: pt.defaultHardwareId,
        defaultThicknessId: pt.defaultThicknessId,
        supportedShapeIds: pt.supportedShapeIds ?? undefined,
        supportedHardwareIds: pt.supportedHardwareIds ?? undefined,
        supportedLayoutIds: pt.supportedLayoutIds ?? undefined,
        capabilities: (pt.capabilities ?? undefined) as never,
        sortOrder: index,
      },
    });
    if (row.createdAt.getTime() > Date.now() - 5000) created++;
  }

  // eslint-disable-next-line no-console
  console.log(
    `Customizer product types: ${CANVAS_PRODUCT_TYPES.length} canvas + ${ACRYLIC_PRODUCT_TYPES.length} acrylic processed, ${created} newly created.`,
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
