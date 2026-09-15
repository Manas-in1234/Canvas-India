import { SlaService } from './sla.service.js';
import type { PrismaService } from '../../database/prisma.service.js';

describe('SlaService', () => {
  it('adds the rule duration in minutes to the base date', () => {
    const prisma = {} as PrismaService;
    const service = new SlaService(prisma);

    const from = new Date('2026-01-01T10:00:00.000Z');
    const due = service.addMinutes(from, 90);

    expect(due.toISOString()).toBe('2026-01-01T11:30:00.000Z');
  });

  it('prefers a product-type-specific rule over the global fallback rule', async () => {
    const specificRule = { productTypeId: 'canvas', stage: 'PRINTING', durationMinutes: 120, isActive: true };
    const globalRule = { productTypeId: null, stage: 'PRINTING', durationMinutes: 30, isActive: true };

    const findFirst = vi
      .fn()
      .mockResolvedValueOnce(specificRule) // first call: specific lookup finds a match
      .mockResolvedValueOnce(globalRule); // second call would be the fallback, unused here

    const prisma = { productionSlaRule: { findFirst } } as unknown as PrismaService;
    const service = new SlaService(prisma);

    const from = new Date('2026-01-01T00:00:00.000Z');
    const due = await service.resolveDueDate('canvas', 'PRINTING', from);

    expect(due?.toISOString()).toBe('2026-01-01T02:00:00.000Z'); // +120 minutes
    expect(findFirst).toHaveBeenCalledTimes(1); // never needed the fallback lookup
  });

  it('falls back to the global rule when no product-type-specific rule exists', async () => {
    const globalRule = { productTypeId: null, stage: 'QC', durationMinutes: 30, isActive: true };

    const findFirst = vi
      .fn()
      .mockResolvedValueOnce(null) // no specific rule
      .mockResolvedValueOnce(globalRule);

    const prisma = { productionSlaRule: { findFirst } } as unknown as PrismaService;
    const service = new SlaService(prisma);

    const from = new Date('2026-01-01T00:00:00.000Z');
    const due = await service.resolveDueDate('mug', 'QC', from);

    expect(due?.toISOString()).toBe('2026-01-01T00:30:00.000Z');
    expect(findFirst).toHaveBeenCalledTimes(2);
  });

  it('returns null when no rule matches at all', async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const prisma = { productionSlaRule: { findFirst } } as unknown as PrismaService;
    const service = new SlaService(prisma);

    const due = await service.resolveDueDate('mug', 'FRAMING', new Date());
    expect(due).toBeNull();
  });
});
