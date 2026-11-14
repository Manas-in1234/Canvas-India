// READ-ONLY audit of the LIVE database: are the "Paid" orders real?
// Prints counts and patterns only. No names, emails, phone numbers, addresses or connection strings.
//
// Run from the backend folder (after `npm run build` so dist/ exists):
//     node scripts/audit-live-payments.mjs
//
// It connects with APP_DATABASE_URL from backend/.neon-env: the limited canvas_worker_app role that the
// live Cloudflare worker itself uses. It only runs SELECTs.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const backend = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const require = createRequire(path.join(backend, 'package.json'));
require('dotenv').config({ path: path.join(backend, '.neon-env'), quiet: true });
const url = process.env.APP_DATABASE_URL;
if (!url) {
  console.error('APP_DATABASE_URL was not found in backend/.neon-env');
  process.exit(1);
}
const { PrismaClient } = await import(pathToFileURL(path.join(backend, 'dist/generated/prisma/client.js')).href);
const { PrismaPg } = require('@prisma/adapter-pg');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const tally = (rows, key) => rows.reduce((m, r) => ((m[key(r)] = (m[key(r)] || 0) + 1), m), {});
const day = (d) => d.toISOString().slice(0, 10);

const orders = await prisma.order.findMany({
  select: { id: true, orderNumber: true, orderStatus: true, paymentStatus: true, total: true, createdAt: true, customer: { select: { email: true } } },
});
const payments = await prisma.payment.findMany({
  select: { id: true, orderId: true, provider: true, status: true, amount: true, providerRef: true, createdAt: true },
});

console.log('ORDERS total:', orders.length);
console.log(' by paymentStatus:', JSON.stringify(tally(orders, (o) => o.paymentStatus)));
console.log(' by orderStatus  :', JSON.stringify(tally(orders, (o) => o.orderStatus)));
if (orders.length) console.log(' first -> last order:', day(new Date(Math.min(...orders.map((o) => +o.createdAt)))), '->', day(new Date(Math.max(...orders.map((o) => +o.createdAt)))));
console.log(' orders per day:', JSON.stringify(tally(orders, (o) => day(o.createdAt))));
console.log(' orderNumber shapes:', JSON.stringify(tally(orders, (o) => o.orderNumber.replace(/[0-9]/g, '9'))));

console.log('\nPAYMENTS total:', payments.length);
console.log(' by provider/status:', JSON.stringify(tally(payments, (p) => `${p.provider}/${p.status}`)));
// A genuine Razorpay payment id looks like pay_ + 14 letters/digits.
const refShape = (ref) => {
  if (!ref) return 'NONE';
  if (/^pay_[A-Za-z0-9]{14}$/.test(ref)) return 'real-looking pay_ id';
  if (/^pay_/.test(ref)) return `pay_ but odd length (${ref.length})`;
  return 'other: ' + ref.replace(/[A-Za-z0-9]/g, 'x').slice(0, 20);
};
const paid = payments.filter((p) => p.status === 'PAID');
console.log(' PAID payments by reference shape:', JSON.stringify(tally(paid, (p) => `${p.provider}: ${refShape(p.providerRef)}`)));
console.log(' PAID amounts (Rs):', JSON.stringify(paid.map((p) => Number(p.amount)).sort((a, b) => a - b)));
const ordPaid = orders.filter((o) => o.paymentStatus === 'PAID');
const withPaidRow = new Set(paid.map((p) => p.orderId));
console.log(' orders marked PAID with NO paid payment row:', ordPaid.filter((o) => !withPaidRow.has(o.id)).length, 'of', ordPaid.length);
console.log(' duplicate payment references among PAID:', Object.values(tally(paid.filter((p) => p.providerRef), (p) => p.providerRef)).filter((n) => n > 1).length);
console.log(' orders whose customer email looks like test/demo:', orders.filter((o) => /test|demo|example|dummy|asdf/i.test(o.customer?.email || '')).length, 'of', orders.length);

try {
  const rows = await prisma.$queryRawUnsafe('select migration_name, finished_at is not null as done from _prisma_migrations order by migration_name');
  const local = fs.readdirSync(path.join(backend, 'prisma/migrations')).filter((d) => /^\d{14}_/.test(d));
  const applied = new Set(rows.filter((r) => r.done).map((r) => r.migration_name));
  console.log('\nMIGRATIONS applied on this database:', applied.size, 'of', local.length, 'in the repo');
  console.log(' not applied:', JSON.stringify(local.filter((m) => !applied.has(m))));
} catch (e) {
  console.log('\nMIGRATIONS: could not be checked with this role (' + String(e.message).split('\n').pop().slice(0, 120) + ')');
}
await prisma.$disconnect();
