import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

// Creates the two Customize Page Options lists that used to be fixed in the
// storefront code: "Minor Photo Retouching" (OPTIONS tab) and "Optional Color
// Finishing" (HARDWARE & FINISH tab), seeded with exactly today's values so
// nothing changes for customers. Safe to re-run: the category is matched on
// (baseKey, materialScope) and items are only inserted when the category has
// none yet, so later admin edits are never overwritten or duplicated.

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  {
    baseKey: 'retouching',
    name: 'Minor Photo Retouching',
    description: 'Checkbox list in the OPTIONS tab. Ticked items are sent to the studio with the order.',
    sortOrder: 20,
    items: [
      { id: 'red-eye', label: 'Red Eye Removal' },
      { id: 'dust-scratch', label: 'Dust/Scratch Removal' },
      { id: 'enhance-color', label: 'Enhance Color' },
      { id: 'date-stamp', label: 'Date Stamp Removal' },
      { id: 'lighten-darken', label: 'Lighten/Darken Image' },
    ],
  },
  {
    baseKey: 'color_finishing',
    name: 'Optional Color Finishing',
    description:
      'The three filters are built into the photo editor: rename, reorder or hide them here. A new filter type needs a developer.',
    sortOrder: 21,
    items: [
      { id: 'original', label: 'Original' },
      { id: 'sepia', label: 'Sepia' },
      { id: 'grayscale', label: 'GrayScale' },
    ],
  },
];

async function main() {
  for (const cat of CATEGORIES) {
    const category = await prisma.optionCategory.upsert({
      where: { baseKey_materialScope: { baseKey: cat.baseKey, materialScope: 'BOTH' } },
      update: {},
      create: {
        baseKey: cat.baseKey,
        materialScope: 'BOTH',
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });

    const existing = await prisma.optionCategoryItem.count({ where: { categoryId: category.id } });
    if (existing > 0) {
      // eslint-disable-next-line no-console
      console.log(`${cat.baseKey}: already has ${existing} items, left untouched.`);
      continue;
    }

    await prisma.optionCategoryItem.createMany({
      data: cat.items.map((item, index) => ({
        categoryId: category.id,
        label: item.label,
        sortOrder: index,
        extras: { id: item.id },
      })),
    });
    // eslint-disable-next-line no-console
    console.log(`${cat.baseKey}: created with ${cat.items.length} items.`);
  }
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
