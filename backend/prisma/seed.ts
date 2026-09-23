import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import 'dotenv/config';

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

  // Baseline product type + option groups so the catalog isn't empty on first boot.
  await prisma.productType.upsert({
    where: { name: 'Canvas' },
    update: {},
    create: { name: 'Canvas' },
  });

  const sizeGroup = await prisma.optionGroup.upsert({
    where: { name: 'SIZE' },
    update: {},
    create: { name: 'SIZE' },
  });

  const sizeValues: [string, string][] = [
    ['8x8', '0'],
    ['10x10', '50'],
    ['12x12', '100'],
    ['16x20', '250'],
    ['20x30', '500'],
  ];

  for (const [value, priceAdjustment] of sizeValues) {
    await prisma.optionValue.upsert({
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
  }

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

