// Safe to re-run any time: upserts every permission key below (creating any that are
// missing) and grants them all to the Super Admin role, without touching any admin
// user account. Does not use the default seed email, so it can't create a duplicate
// admin account the way running the full seed.ts could.
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const NEW_PERMISSIONS = [
  'reviews.view',
  'reviews.manage',
  'audit.view',
  'store_settings.view',
  'store_settings.manage',
  'broadcasts.view',
  'broadcasts.send',
  'cms.view',
  'cms.manage',
  'homepage_layout.view',
  'homepage_layout.manage',
  'inventory.view',
  'inventory.adjust',
];

async function main() {
  for (const key of NEW_PERMISSIONS) {
    await prisma.permission.upsert({ where: { key }, update: {}, create: { key } });
  }
  const superAdmin = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
  if (!superAdmin) {
    console.log('No "Super Admin" role found — permissions created, but not granted to any role.');
    return;
  }
  const allPermissions = await prisma.permission.findMany();
  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({ roleId: superAdmin.id, permissionId: p.id })),
    skipDuplicates: true,
  });
  console.log(`Granted ${allPermissions.length} permission(s) to Super Admin.`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
