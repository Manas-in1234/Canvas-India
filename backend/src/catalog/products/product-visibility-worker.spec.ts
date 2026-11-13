import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import worker from '../../worker.js';

const SECRET = 'test-secret';

function tokenFor(sub: string) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub })).toString('base64url');
  const signature = createHmac('sha256', SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

const LIVE = { id: 'p-live', name: 'Live', status: 'ACTIVE', productType: { id: 't1', name: 'Canvas', isActive: true } };
const DRAFT = { id: 'p-draft', name: 'Draft', status: 'DRAFT', productType: { id: 't1', name: 'Canvas', isActive: true } };
const IN_HIDDEN_TYPE = { id: 'p-hidden-type', name: 'Hidden type', status: 'ACTIVE', productType: { id: 't2', name: 'Cork', isActive: false } };
const PRODUCTS: Record<string, unknown> = { [LIVE.id]: LIVE, [DRAFT.id]: DRAFT, [IN_HIDDEN_TYPE.id]: IN_HIDDEN_TYPE };

let permissions: string[];
let prisma: any;
let services: any;

const call = (path: string, init: RequestInit & { admin?: boolean } = {}) => {
  const { admin, ...rest } = init;
  const headers = { 'Content-Type': 'application/json', ...(admin ? { Authorization: `Bearer ${tokenFor('editor')}` } : {}), ...(rest.headers as object) };
  return worker.fetch(new Request(`https://test.invalid/api/v1${path}`, { ...rest, headers }), {
    _prisma: prisma,
    _services: services,
    DATABASE_URL: '',
    JWT_ACCESS_SECRET: SECRET,
  } as never);
};

beforeEach(() => {
  permissions = ['products.view', 'products.edit'];
  prisma = {
    product: {
      findMany: vi.fn(async () => [LIVE]),
      groupBy: vi.fn(async () => [
        { productTypeId: 't1', status: 'ACTIVE', _count: { _all: 3 } },
        { productTypeId: 't1', status: 'DRAFT', _count: { _all: 2 } },
        { productTypeId: 't2', status: 'ACTIVE', _count: { _all: 4 } },
      ]),
    },
    productType: {
      findMany: vi.fn(async () => [{ id: 't1', name: 'Canvas', isActive: true }]),
      update: vi.fn(async ({ where, data }: any) => ({ id: where.id, name: 'Cork', ...data })),
    },
    adminUser: {
      findUnique: vi.fn(async () => ({
        id: 'editor',
        isActive: true,
        updatedAt: new Date(0),
        role: { name: 'Editor', permissions: permissions.map((key) => ({ permission: { key } })) },
      })),
    },
  };
  services = {
    audit: { record: vi.fn() },
    products: {
      findAll: vi.fn(async () => [LIVE, DRAFT, IN_HIDDEN_TYPE]),
      findOne: vi.fn(async (id: string) => PRODUCTS[id]),
    },
    productTypes: { findAll: vi.fn(async () => [{ id: 't1', name: 'Canvas', isActive: true }, { id: 't2', name: 'Cork', isActive: false }]) },
  };
});

describe('public website vs admin product list', () => {
  it('shows the public only ACTIVE products in visible categories', async () => {
    const response = await call('/products');
    expect(response.status).toBe(200);
    expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.product.findMany.mock.calls[0][0].where).toEqual({
      deletedAt: null,
      status: 'ACTIVE',
      productType: { isActive: true },
    });
    expect(services.products.findAll).not.toHaveBeenCalled();
  });

  it('gives a signed-in admin every product, hidden ones included', async () => {
    const response = await call('/products', { admin: true });
    expect(response.status).toBe(200);
    expect((await response.json()) as unknown[]).toHaveLength(3);
    expect(services.products.findAll).toHaveBeenCalled();
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it('serves the explicit admin list (?admin=1) only to a signed-in admin with products.view', async () => {
    expect((await call('/products?admin=1')).status).toBe(401);

    permissions = ['orders.view'];
    expect((await call('/products?admin=1', { admin: true })).status).toBe(403);

    permissions = ['products.view'];
    const response = await call('/products?admin=1', { admin: true });
    expect(response.status).toBe(200);
    expect(services.products.findAll).toHaveBeenCalledWith(true);
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it('treats an invalid token as a visitor, not an admin', async () => {
    const response = await call('/products', { headers: { Authorization: 'Bearer not.a.token' } });
    expect(response.status).toBe(200);
    expect(services.products.findAll).not.toHaveBeenCalled();
    expect(prisma.product.findMany).toHaveBeenCalled();
  });

  it('still hides draft products if the visibility column is not migrated yet', async () => {
    prisma.product.findMany
      .mockRejectedValueOnce(Object.assign(new Error('The column `product_types.is_active` does not exist in the current database.'), { code: 'P2022' }))
      .mockResolvedValueOnce([LIVE]);
    const response = await call('/products');
    expect(response.status).toBe(200);
    expect(prisma.product.findMany).toHaveBeenCalledTimes(2);
    expect(prisma.product.findMany.mock.calls[1][0].where).toEqual({ deletedAt: null, status: 'ACTIVE' });
  });
});

describe('single product page', () => {
  it('returns 404 to the public for a draft, and for a product in a hidden category', async () => {
    expect((await call(`/products/${DRAFT.id}`)).status).toBe(404);
    expect((await call(`/products/${IN_HIDDEN_TYPE.id}`)).status).toBe(404);
  });

  it('returns a live product to the public', async () => {
    expect((await call(`/products/${LIVE.id}`)).status).toBe(200);
  });

  it('lets an admin open a draft', async () => {
    expect((await call(`/products/${DRAFT.id}`, { admin: true })).status).toBe(200);
  });
});

describe('categories (product types)', () => {
  it('lists only visible categories to the public', async () => {
    await call('/product-types');
    expect(prisma.productType.findMany.mock.calls[0][0].where).toEqual({ isActive: true });
  });

  it('gives an admin every category with live and total counts', async () => {
    const response = await call('/product-types', { admin: true });
    const rows = (await response.json()) as Array<{ id: string; isActive: boolean; productCount: number; liveCount: number }>;
    expect(rows.find((r) => r.id === 't1')).toMatchObject({ isActive: true, productCount: 5, liveCount: 3 });
    expect(rows.find((r) => r.id === 't2')).toMatchObject({ isActive: false, productCount: 4, liveCount: 4 });
  });

  it('lets an editor hide a category and records it', async () => {
    const response = await call('/product-types/t2', { method: 'PATCH', admin: true, body: JSON.stringify({ isActive: false }) });
    expect(response.status).toBe(200);
    expect(prisma.productType.update).toHaveBeenCalledWith({ where: { id: 't2' }, data: { isActive: false } });
    expect(services.audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'CATEGORY_HIDDEN_FROM_WEBSITE', entityId: 't2' }));
  });

  it('rejects anonymous callers, view-only admins and malformed bodies', async () => {
    const body = JSON.stringify({ isActive: false });
    expect((await call('/product-types/t2', { method: 'PATCH', body })).status).toBe(401);

    permissions = ['products.view'];
    expect((await call('/product-types/t2', { method: 'PATCH', admin: true, body })).status).toBe(403);

    permissions = ['products.view', 'products.edit'];
    for (const bad of [{}, { isActive: 'false' }, { isActive: null }]) {
      expect((await call('/product-types/t2', { method: 'PATCH', admin: true, body: JSON.stringify(bad) })).status).toBe(400);
    }
    expect(prisma.productType.update).not.toHaveBeenCalled();
  });
});

it('allows a creator to save storefront options as a draft and requires edit permission to publish', async () => {
  const create = vi.fn(async input => ({ id: 'new-product', ...input }));
  services.products.create = create;
  permissions = ['products.create'];
  const storefront = { images: ['/example.webp'], sizes: ['8x10'], specifications: [{ label: 'Origin', value: 'India' }] };
  const submit = (status: 'DRAFT' | 'ACTIVE') => call('/products', {
    admin: true, method: 'POST',
    body: JSON.stringify({ name: 'Example', slug: 'example', productTypeId: 't1', basePrice: '499', status, storefront }),
  });
  expect((await submit('DRAFT')).status).toBe(201);
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ status: 'DRAFT', storefront }));
  expect((await submit('ACTIVE')).status).toBe(403);
  expect(create).toHaveBeenCalledTimes(1);
  permissions.push('products.edit');
  expect((await submit('ACTIVE')).status).toBe(201);
  expect(create).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'ACTIVE', storefront }));
});
