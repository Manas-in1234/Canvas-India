import { expect, it } from 'vitest';
import type { PrismaClient } from '../generated/prisma/client.js';
import { Reviews } from './reviews.js';

type OrderRow = { id: string; customerId: string; orderNumber: string; shippingStatus: string };
type ItemRow = { id: string; orderId: string; productNameSnapshot: string; variantSnapshot: { productSlug?: string; imageUrl?: string }; createdAt: Date };
type ReviewRow = {
  id: string; customerId: string; orderItemId: string; productSlug: string; rating: number; comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; rejectionReason: string | null; moderatedBy: string | null; moderatedAt: Date | null; createdAt: Date;
};

function makeFakePrisma() {
  const customers = new Map<string, { id: string; name: string; email: string }>([
    ['cust-1', { id: 'cust-1', name: 'Asha Rao', email: 'asha@example.com' }],
    ['cust-2', { id: 'cust-2', name: 'Vikram Singh', email: 'vikram@example.com' }],
  ]);
  const orders = new Map<string, OrderRow>([
    ['ord-1', { id: 'ord-1', customerId: 'cust-1', orderNumber: 'CI-1001', shippingStatus: 'DELIVERED' }],
    ['ord-2', { id: 'ord-2', customerId: 'cust-1', orderNumber: 'CI-1002', shippingStatus: 'IN_TRANSIT' }],
    ['ord-3', { id: 'ord-3', customerId: 'cust-2', orderNumber: 'CI-1003', shippingStatus: 'DELIVERED' }],
  ]);
  const items = new Map<string, ItemRow>([
    ['item-1', { id: 'item-1', orderId: 'ord-1', productNameSnapshot: 'Canvas Heart', variantSnapshot: { productSlug: 'canvas-heart', imageUrl: 'https://x/img.jpg' }, createdAt: new Date('2026-11-01') }],
    ['item-2', { id: 'item-2', orderId: 'ord-1', productNameSnapshot: 'Old Legacy Print', variantSnapshot: {}, createdAt: new Date('2026-11-01') }],
    ['item-3', { id: 'item-3', orderId: 'ord-2', productNameSnapshot: 'Not Yet Delivered', variantSnapshot: { productSlug: 'acrylic-square' }, createdAt: new Date('2026-11-02') }],
    ['item-4', { id: 'item-4', orderId: 'ord-3', productNameSnapshot: 'Someone Elses Item', variantSnapshot: { productSlug: 'canvas-heart' }, createdAt: new Date('2026-11-03') }],
  ]);
  const reviews = new Map<string, ReviewRow>();
  let nextId = 1;

  const prisma = {
    order: {
      findFirst: async ({ where }: any) => {
        const order = [...orders.values()].find(
          o => o.orderNumber === where.orderNumber && customers.get(o.customerId)?.email === where.customer.email,
        );
        return order ?? null;
      },
    },
    orderItem: {
      findMany: async ({ where }: any) => {
        return [...items.values()].filter(i => {
          if (where.orderId && i.orderId !== where.orderId) return false;
          if (where.review === null && reviews.has(reviewIdForItem(i.id))) return false;
          return true;
        });
      },
      findUnique: async ({ where }: any) => {
        const item = items.get(where.id);
        if (!item) return null;
        return { ...item, review: reviews.has(reviewIdForItem(item.id)) ? reviews.get(reviewIdForItem(item.id)) : null };
      },
    },
    review: {
      create: async ({ data }: any) => {
        const row: ReviewRow = {
          id: `rev-${nextId++}`, customerId: data.customerId, orderItemId: data.orderItemId, productSlug: data.productSlug,
          rating: data.rating, comment: data.comment, status: 'PENDING', rejectionReason: null, moderatedBy: null, moderatedAt: null, createdAt: new Date(),
        };
        reviews.set(row.id, row);
        return row;
      },
      findMany: async ({ where }: any) => {
        return [...reviews.values()]
          .filter(r => (where.productSlug ? r.productSlug === where.productSlug : true) && (where.status ? r.status === where.status : true))
          .map(r => ({ ...r, customer: customers.get(r.customerId)!, orderItem: items.get(r.orderItemId)! }));
      },
      findUnique: async ({ where }: any) => reviews.get(where.id) ?? null,
      update: async ({ where, data }: any) => {
        const row = reviews.get(where.id)!;
        Object.assign(row, data);
        return row;
      },
      delete: async ({ where }: any) => {
        const row = reviews.get(where.id);
        reviews.delete(where.id);
        return row;
      },
    },
  };

  function reviewIdForItem(orderItemId: string) {
    return [...reviews.values()].find(r => r.orderItemId === orderItemId)?.id ?? '__none__';
  }

  return { prisma, items, reviews, customers };
}

it('lists reviewable items only for a delivered order, excluding items with no slug or an existing review', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  const result = await reviews.listReviewable('CI-1001', 'asha@example.com');
  expect(result.delivered).toBe(true);
  expect(result.items).toHaveLength(1);
  expect(result.items[0]).toMatchObject({ orderItemId: 'item-1', productSlug: 'canvas-heart' });
});

it('reports not-delivered rather than items, for an order still in transit', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  const result = await reviews.listReviewable('CI-1002', 'asha@example.com');
  expect(result.delivered).toBe(false);
  expect(result.items).toHaveLength(0);
});

it('rejects an order number + email pair that do not match (case-insensitively on email)', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  await expect(reviews.listReviewable('CI-1001', 'wrong@example.com')).rejects.toThrow(/no order found/i);
  await expect(reviews.listReviewable('CI-9999', 'asha@example.com')).rejects.toThrow(/no order found/i);
  const result = await reviews.listReviewable('CI-1001', 'ASHA@EXAMPLE.COM');
  expect(result.delivered).toBe(true);
});

it('creates a review for a delivered, slugged, not-yet-reviewed item on the right order', async () => {
  const { prisma, reviews: store } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  const review = await reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, '  Lovely print!  ');
  expect(review).toMatchObject({ customerId: 'cust-1', orderItemId: 'item-1', productSlug: 'canvas-heart', rating: 5, comment: 'Lovely print!', status: 'PENDING' });
  expect(store.size).toBe(1);
});

it('rejects a review for an item on a different order, even if the item id is real', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  // item-4 is really on ord-3, not ord-1 — proves ownership is checked by orderId, not just that the item exists.
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-4', 5, 'Nice')).rejects.toThrow(/not on this order/i);
});

it('rejects a review before delivery, for an item with no tracked slug, and a duplicate review', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  await expect(reviews.create('CI-1002', 'asha@example.com', 'item-3', 5, 'Nice')).rejects.toThrow(/delivered/i);
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-2', 5, 'Nice')).rejects.toThrow(/before reviews were tracked/i);
  await reviews.create('CI-1001', 'asha@example.com', 'item-1', 4, 'First review');
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, 'Second attempt')).rejects.toThrow(/already reviewed/i);
});

it('rejects an invalid rating or an empty/too-long comment', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-1', 0, 'Nice')).rejects.toThrow(/rating/i);
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-1', 6, 'Nice')).rejects.toThrow(/rating/i);
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-1', 3.5, 'Nice')).rejects.toThrow(/rating/i);
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, '   ')).rejects.toThrow(/write a review/i);
  await expect(reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, 'x'.repeat(2001))).rejects.toThrow(/write a review/i);
});

it('shows only approved reviews publicly, with a rounded average and a privacy-safe name', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  await reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, 'Great');
  await reviews.create('CI-1003', 'vikram@example.com', 'item-4', 3, 'Okay');
  // Nothing approved yet.
  expect(await reviews.listApprovedForProduct('canvas-heart')).toMatchObject({ count: 0, average: 0, reviews: [] });

  const pending = (await reviews.listForModeration('PENDING'));
  await reviews.moderate(pending[0].id, 'APPROVED', 'admin-1');
  await reviews.moderate(pending[1].id, 'APPROVED', 'admin-1');

  const result = await reviews.listApprovedForProduct('canvas-heart');
  expect(result.count).toBe(2);
  expect(result.average).toBe(4);
  // Full surname never shown: proves the privacy-safe name formatting, not just that it ran.
  expect(result.reviews.some(r => r.customerName.includes('Rao') || r.customerName.includes('Singh'))).toBe(false);
  expect(result.reviews.map(r => r.customerName).sort()).toEqual(['Asha R.', 'Vikram S.']);
});

it('moderation: approving clears any earlier rejection reason, and rejecting records one', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  const created = await reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, 'Great');
  const rejected = await reviews.moderate(created.id, 'REJECTED', 'admin-1', ' Spam content ');
  expect(rejected).toMatchObject({ status: 'REJECTED', moderatedBy: 'admin-1', rejectionReason: 'Spam content' });
  const approved = await reviews.moderate(created.id, 'APPROVED', 'admin-1');
  expect(approved).toMatchObject({ status: 'APPROVED', rejectionReason: null });
});

it('moderation rejects an unknown review id, a bad status filter, and an over-long rejection reason', async () => {
  const { prisma } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  await expect(reviews.moderate('nope', 'APPROVED', 'admin-1')).rejects.toThrow(/not found/i);
  await expect(reviews.listForModeration('NOT_A_STATUS')).rejects.toThrow(/invalid status/i);
  const created = await reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, 'Great');
  await expect(reviews.moderate(created.id, 'REJECTED', 'admin-1', 'x'.repeat(501))).rejects.toThrow(/500 characters/i);
});

it('deletes a review, and refuses to delete one that does not exist', async () => {
  const { prisma, reviews: store } = makeFakePrisma();
  const reviews = new Reviews(prisma as unknown as PrismaClient);
  const created = await reviews.create('CI-1001', 'asha@example.com', 'item-1', 5, 'Great');
  await reviews.remove(created.id);
  expect(store.has(created.id)).toBe(false);
  await expect(reviews.remove(created.id)).rejects.toThrow(/not found/i);
});
