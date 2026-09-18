import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import 'dotenv/config';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './catalog-data.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Permission catalog — extended as later phases add modules.
const PERMISSIONS = [
  'users.view',
  'users.manage',
  'roles.view',
  'roles.manage',
  'customers.view',
  'customers.create',
  'customers.edit',
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  'orders.view',
  'orders.create',
  'orders.edit',
  'orders.cancel',
  'orders.refund',
  'inventory.view',
  'inventory.adjust',
  'warehouses.view',
  'warehouses.manage',
  'shipping.view',
  'shipping.create',
  'shipping.cancel',
  'ndr.view',
  'ndr.action',
  'returns.view',
  'returns.manage',
  'finance.view',

  // Customization Engine (Phase 2)
  'assets.upload',
  'designs.view',
  'designs.edit',
  'artwork.view',
  'artwork.approve',
  'artwork.reject',

  // Production Management (Phase 3)
  'production.view',
  'production.assign',
  'production.complete',
  'production.qc',
  'machines.view',
  'machines.manage',
  'bom.view',
  'bom.manage',
  'materials.view',
  'materials.adjust',

  // Growth (Phase 5)
  'discounts.view',
  'discounts.manage',
  'promotions.view',
  'promotions.manage',
  'campaigns.view',
  'campaigns.manage',
  'segments.view',
  'segments.manage',
  'abandoned_carts.view',
  'abandoned_carts.manage',
  'analytics.view',
];

async function main() {
  // Seed permissions.
  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }

  // Seed Super Admin role.
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Full system access',
      isSystem: true,
    },
  });

  // Grant every known permission to Super Admin.
  const allPermissions = await prisma.permission.findMany();

  await prisma.rolePermission.deleteMany({
    where: { roleId: superAdminRole.id },
  });

  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({
      roleId: superAdminRole.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  // Seed Super Admin user.
  const seedEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@canvaschamp.in';
  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const passwordHash = await argon2.hash(seedPassword);

  await prisma.adminUser.upsert({
    where: { email: seedEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: seedEmail,
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  // ── Baseline Catalog: ProductTypes, Categories, Options, Products & Variants ──
  const PRODUCT_TYPE_MAP: Record<string, string> = {
    canvas: 'Canvas',
    acrylic: 'Acrylic',
    posters: 'Posters',
    cork: 'Cork',
    'yoga-fitness': 'Fitness',
    'home-decor': 'Home Decor',
    'custom-prints': 'Custom Prints',
    'corporate-orders': 'Commercial',
    'bulk-order': 'Commercial',
    gifts: 'Gifts',
    'wall-art': 'Wall Art',
    'photo-frames': 'Photo Frames',
  };

  const productTypeNames = [
    'Canvas',
    'Acrylic',
    'Posters',
    'Cork',
    'Fitness',
    'Home Decor',
    'Custom Prints',
    'Commercial',
    'Gifts',
    'Wall Art',
    'Photo Frames',
  ];
  const productTypeMap = new Map<string, string>();

  for (const name of productTypeNames) {
    const pt = await prisma.productType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    productTypeMap.set(name, pt.id);
  }

  // Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of SEED_CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    categoryMap.set(cat.slug, c.id);
  }

  // Seed OptionGroups (SIZE and FINISH)
  const sizeGroup = await prisma.optionGroup.upsert({
    where: { name: 'SIZE' },
    update: {},
    create: { name: 'SIZE' },
  });

  const finishGroup = await prisma.optionGroup.upsert({
    where: { name: 'FINISH' },
    update: {},
    create: { name: 'FINISH' },
  });

  const sizeValues: [string, string][] = [
    ['8x8', '0'],
    ['10x10', '50'],
    ['12x12', '100'],
    ['16x20', '250'],
    ['20x30', '500'],
    ['8x10 inch', '0'],
    ['12x18 inch', '200'],
    ['16x24 inch', '450'],
    ['20x30 inch', '750'],
    ['24x36 inch', '1100'],
  ];

  const sizeOptionValueMap = new Map<string, string>();
  for (const [value, priceAdjustment] of sizeValues) {
    const ov = await prisma.optionValue.upsert({
      where: {
        optionGroupId_value: {
          optionGroupId: sizeGroup.id,
          value,
        },
      },
      update: {},
      create: {
        optionGroupId: sizeGroup.id,
        value,
        priceAdjustment,
      },
    });
    sizeOptionValueMap.set(value, ov.id);
  }

  const finishValues: [string, string][] = [
    ['Matte Gallery Wrap', '0'],
    ['Satin Lustre', '150'],
    ['Black Floating Frame', '400'],
    ['Standoff Mount', '250'],
    ['Beveled Acrylic', '200'],
    ['Frameless Glass', '0'],
    ['White Modern Float', '400'],
    ['Teak Floater Frame', '450'],
  ];

  for (const [value, priceAdjustment] of finishValues) {
    await prisma.optionValue.upsert({
      where: {
        optionGroupId_value: {
          optionGroupId: finishGroup.id,
          value,
        },
      },
      update: {},
      create: {
        optionGroupId: finishGroup.id,
        value,
        priceAdjustment,
      },
    });
  }

  // Seed Products, ProductCategories, ProductOptions, ProductVariants
  let seededProductCount = 0;
  let seededVariantCount = 0;

  for (const p of SEED_PRODUCTS) {
    const ptName = PRODUCT_TYPE_MAP[p.categorySlug] || 'Canvas';
    const productTypeId = productTypeMap.get(ptName) || productTypeMap.get('Canvas')!;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        basePrice: p.basePrice,
        costPrice: p.costPrice,
        status: 'ACTIVE',
        productTypeId,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        costPrice: p.costPrice,
        status: 'ACTIVE',
        productTypeId,
      },
    });
    seededProductCount++;

    // Link product to category
    const categoryId = categoryMap.get(p.categorySlug) || categoryMap.get('canvas');
    if (categoryId) {
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: product.id,
            categoryId,
          },
        },
        update: {},
        create: {
          productId: product.id,
          categoryId,
        },
      });
    }

    // Link product to SIZE and FINISH option groups
    await prisma.productOption.upsert({
      where: {
        productId_optionGroupId: {
          productId: product.id,
          optionGroupId: sizeGroup.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        optionGroupId: sizeGroup.id,
        isRequired: true,
        sortOrder: 0,
      },
    });

    await prisma.productOption.upsert({
      where: {
        productId_optionGroupId: {
          productId: product.id,
          optionGroupId: finishGroup.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        optionGroupId: finishGroup.id,
        isRequired: false,
        sortOrder: 1,
      },
    });

    // Seed baseline SKU-bearing variants for product sizes
    const productSizes = p.sizes.length > 0 ? p.sizes.slice(0, 4) : ['12x18 inch'];
    for (let i = 0; i < productSizes.length; i++) {
      const sizeVal = productSizes[i];
      const cleanSize = sizeVal.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const sku = `${p.slug}-${cleanSize}`;
      const priceOffset = i * 200;
      const variantPrice = p.basePrice + priceOffset;

      const variant = await prisma.productVariant.upsert({
        where: { sku },
        update: {
          price: variantPrice,
          isActive: true,
        },
        create: {
          productId: product.id,
          sku,
          price: variantPrice,
          isActive: true,
        },
      });
      seededVariantCount++;

      // Baseline stock so seeded variants are actually purchasable — without
      // this, checkout fails with "No inventory item for variant" since
      // OrdersService.createFromCart requires an InventoryItem to reserve against.
      await prisma.inventoryItem.upsert({
        where: { variantId: variant.id },
        update: {},
        create: {
          variantId: variant.id,
          available: 100,
          reserved: 0,
          damaged: 0,
          reorderLevel: 10,
        },
      });

      const optValId = sizeOptionValueMap.get(sizeVal);
      if (optValId) {
        await prisma.variantOption.upsert({
          where: {
            variantId_optionValueId: {
              variantId: variant.id,
              optionValueId: optValId,
            },
          },
          update: {},
          create: {
            variantId: variant.id,
            optionValueId: optValId,
          },
        });
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${categoryMap.size} categories, ${seededProductCount} products, and ${seededVariantCount} variants.`);

  // Seed warehouses for Phase 4.
  await prisma.warehouse.upsert({
    where: { code: 'BLR-01' },
    update: {},
    create: {
      name: 'Bengaluru Production Warehouse',
      code: 'BLR-01',
      addressLine1: 'Industrial Area, Peenya',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560058',
      country: 'IN',
    },
  });

  await prisma.warehouse.upsert({
    where: { code: 'DEL-01' },
    update: {},
    create: {
      name: 'Delhi Fulfilment Warehouse',
      code: 'DEL-01',
      addressLine1: 'Okhla Industrial Area',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110020',
      country: 'IN',
    },
  });

  // Phase 5: Growth — seed a demo segment, campaign, discount & promotion.
  const vipSegment = await prisma.customerSegment.upsert({
    where: { slug: 'vip-customers' },
    update: {},
    create: {
      name: 'VIP Customers',
      slug: 'vip-customers',
      description: 'Customers with lifetime spend ≥ ₹10,000 or ≥ 5 orders',
      type: 'DYNAMIC',
      criteria: {
        minSpend: 10000,
        minOrders: 5,
      },
      isActive: true,
    },
  });

  const launchCampaign = await prisma.campaign.upsert({
    where: { code: 'LAUNCH2025' },
    update: {},
    create: {
      name: 'Annual Launch 2025',
      code: 'LAUNCH2025',
      description: 'Year-round launch campaign bundling all promotional offers',
      type: 'SEASONAL',
      status: 'DRAFT',
      startsAt: new Date('2025-01-01T00:00:00Z'),
      endsAt: new Date('2025-12-31T23:59:59Z'),
      budget: 500000,
      targetSegmentId: vipSegment.id,
    },
  });

  await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off for new customers, max ₹500 discount',
      discountType: 'PERCENTAGE',
      value: 10,
      maxDiscountAmount: 500,
      minOrderSubtotal: 999,
      usageLimit: 1000,
      perCustomerLimit: 1,
      isActive: true,
      isExclusive: false,
      campaignId: launchCampaign.id,
    },
  });

  await prisma.promotion.upsert({
    where: { slug: 'flat100-on-2k' },
    update: {},
    create: {
      name: 'Flat ₹100 off on orders above ₹2,000',
      slug: 'flat100-on-2k',
      description: 'Automatic ₹100 discount applied to orders above ₹2,000',
      promotionType: 'AUTOMATIC_DISCOUNT',
      discountType: 'FIXED_AMOUNT',
      value: 100,
      minOrderSubtotal: 2000,
      priority: 10,
      isStackable: true,
      startsAt: new Date('2025-01-01T00:00:00Z'),
      endsAt: new Date('2025-12-31T23:59:59Z'),
      isActive: true,
      campaignId: launchCampaign.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log(
    `Seed complete. Super admin login: ${seedEmail} / ${seedPassword}`,
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

