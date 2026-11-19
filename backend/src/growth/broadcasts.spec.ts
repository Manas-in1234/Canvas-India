import { afterEach, describe, expect, it, vi } from 'vitest';
import { Broadcasts } from './broadcasts.js';

afterEach(() => vi.unstubAllGlobals());

function fakePrisma(customers: Array<{ email: string | null; segmentId?: string }>) {
  const broadcasts = new Map<string, any>();
  let nextId = 1;
  return {
    customerSegment: { findUnique: async ({ where }: any) => (where.id === 'seg-1' ? { id: 'seg-1' } : null) },
    customer: {
      count: async ({ where }: any) => customers.filter(c =>
        c.email && (!where.segmentMemberships || c.segmentId === where.segmentMemberships.some.segmentId)).length,
      findMany: async ({ where }: any) => customers
        .filter(c => c.email && (!where.segmentMemberships || c.segmentId === where.segmentMemberships.some.segmentId))
        .map(c => ({ email: c.email })),
    },
    broadcast: {
      create: async ({ data }: any) => { const row = { id: `b${nextId++}`, status: 'DRAFT', ...data }; broadcasts.set(row.id, row); return row; },
      findUnique: async ({ where }: any) => broadcasts.get(where.id) ?? null,
      update: async ({ where, data }: any) => { const row = { ...broadcasts.get(where.id), ...data }; broadcasts.set(where.id, row); return row; },
      delete: async ({ where }: any) => { broadcasts.delete(where.id); },
      findMany: async () => [...broadcasts.values()],
    },
  };
}

describe('create', () => {
  it('rejects a blank subject or body, counts recipients for all customers with an email', async () => {
    const prisma = fakePrisma([{ email: 'a@test.com' }, { email: 'b@test.com' }, { email: null }]);
    const broadcasts = new Broadcasts(prisma as any, 'key', 'from@test.com');
    await expect(broadcasts.create('', 'body', null, 'admin-1')).rejects.toThrow();
    await expect(broadcasts.create('subject', '', null, 'admin-1')).rejects.toThrow();
    const created = await broadcasts.create('Sale', '<p>Hello</p>', null, 'admin-1');
    expect(created.recipientCount).toBe(2);
  });

  it('rejects an unknown target segment', async () => {
    const prisma = fakePrisma([]);
    const broadcasts = new Broadcasts(prisma as any, 'key', 'from@test.com');
    await expect(broadcasts.create('Sale', 'body', 'not-a-segment', 'admin-1')).rejects.toThrow();
  });
});

describe('send', () => {
  it('refuses to send when email is not configured', async () => {
    const prisma = fakePrisma([{ email: 'a@test.com' }]);
    const broadcasts = new Broadcasts(prisma as any, undefined, undefined);
    const created = await broadcasts.create('Sale', 'body', null, 'admin-1');
    await expect(broadcasts.send(created.id)).rejects.toThrow(/not configured/);
  });

  it('sends to every recipient and marks the broadcast SENT', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
    const prisma = fakePrisma([{ email: 'a@test.com' }, { email: 'b@test.com' }]);
    const broadcasts = new Broadcasts(prisma as any, 'key', 'from@test.com');
    const created = await broadcasts.create('Sale', 'body', null, 'admin-1');
    const result = await broadcasts.send(created.id);
    expect(result.status).toBe('SENT');
    expect(result.sentCount).toBe(2);
    expect(result.failedCount).toBe(0);
  });

  it('records failures without throwing when the email provider errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })));
    const prisma = fakePrisma([{ email: 'a@test.com' }]);
    const broadcasts = new Broadcasts(prisma as any, 'key', 'from@test.com');
    const created = await broadcasts.create('Sale', 'body', null, 'admin-1');
    const result = await broadcasts.send(created.id);
    expect(result.status).toBe('FAILED');
    expect(result.failedCount).toBe(1);
  });

  it('refuses to re-send an already-sent broadcast', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
    const prisma = fakePrisma([{ email: 'a@test.com' }]);
    const broadcasts = new Broadcasts(prisma as any, 'key', 'from@test.com');
    const created = await broadcasts.create('Sale', 'body', null, 'admin-1');
    await broadcasts.send(created.id);
    await expect(broadcasts.send(created.id)).rejects.toThrow(/already been sent/);
  });
});

describe('remove', () => {
  it('refuses to delete a sent broadcast, allows deleting a draft', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
    const prisma = fakePrisma([{ email: 'a@test.com' }]);
    const broadcasts = new Broadcasts(prisma as any, 'key', 'from@test.com');
    const draft = await broadcasts.create('Draft', 'body', null, 'admin-1');
    await expect(broadcasts.remove(draft.id)).resolves.toEqual({ deleted: true });

    const sent = await broadcasts.create('Sale', 'body', null, 'admin-1');
    await broadcasts.send(sent.id);
    await expect(broadcasts.remove(sent.id)).rejects.toThrow(/cannot be deleted/);
  });
});
