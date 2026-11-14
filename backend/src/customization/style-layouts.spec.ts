import { expect, it, vi } from 'vitest';
import { StyleLayouts } from './style-layouts.js';
import type { PrismaClient } from '../generated/prisma/client.js';

it('persists independently positioned panels and keeps hidden and deleted layouts off the storefront', async () => {
  const style = { id: 'style-id', slug: 'canvas-octagon', defaultShapeId: 'custom-octagon' };
  const rows = new Map<string, { contentBytes: Uint8Array; ownerId: string }>();
  const asset = {
    findMany: vi.fn(async () => [...rows.values()]),
    upsert: vi.fn(async ({ where, create }: { where: { storageKey: string }; create: { contentBytes: Uint8Array; ownerId: string } }) => rows.set(where.storageKey, create)),
    deleteMany: vi.fn(async ({ where }: { where: { storageKey: string } }) => ({ count: Number(rows.delete(where.storageKey)) })),
  };
  const outline = 'M0.3 0H0.7L1 0.3V0.7L0.7 1H0.3L0 0.7V0.3Z';
  const services = {
    asset, customizerProductType: { findMany: async () => [style], findUnique: async () => style },
    auditLog: { create: vi.fn() },
    customShape: { findUnique: async () => ({ clipPathType: 'SVG_PATH', clipPathValue: outline, origin: 'ADMIN_UPLOADED', status: 'APPROVED' }) },
  };
  const prisma = { ...services, $transaction: async (run: (tx: unknown) => Promise<unknown>) => run(services) };
  const layouts = new StyleLayouts(prisma as unknown as PrismaClient);
  const panels = Array.from({ length: 24 }, (_, i) => ({ id: 'panel-' + i, x: i * 11 - 22, y: i % 2 * 7, width: 9, height: 10, rotation: i * 5 }));
  const draft = { name: 'Octagon wall', price: 1600, panels, visible: true };
  const first = await layouts.save(style.id, 'layout-a', draft, 'admin');
  expect(first).toMatchObject({ style: style.slug, shapeId: 'custom-octagon', outline, panels });
  await layouts.save(style.id, 'layout-b', { ...draft, name: 'Second design' }, 'admin');
  expect(await layouts.list('CANVAS')).toHaveLength(2);
  await layouts.save(style.id, 'layout-a', { ...draft, visible: false }, 'admin');
  expect(await layouts.list('CANVAS')).toMatchObject([{ id: 'layout-b' }]);
  expect(await layouts.list('CANVAS', style.id)).toHaveLength(2);
  await expect(layouts.save(style.id, 'layout-b', { ...draft, panels: [panels[0], panels[0]] }, 'admin')).rejects.toThrow();
  await layouts.remove(style.id, 'layout-b', 'admin');
  expect(await layouts.list('CANVAS')).toEqual([]);
  expect(await layouts.list('CANVAS', style.id)).toMatchObject([{ id: 'layout-a', visible: false }]);
});
