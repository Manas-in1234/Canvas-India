import { BadRequestException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AbandonedCartsService } from './abandoned-carts.service.js';

const makePrisma = () => ({
  cart: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  abandonedCartRecovery: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(async (fn: any) => {
    const txClient = makePrisma();
    return fn(txClient);
  }),
});

const makeDiscountsService = () => ({
  findByCode: vi.fn(),
});

const baseRecovery = {
  id: 'rec-1',
  cartId: 'cart-1',
  customerId: 'cust-1',
  recoveryToken: 'tok-abc123',
  status: 'DETECTED',
  reminderCount: 0,
  lastNotificationSentAt: null,
  recoveredAt: null,
  offeredDiscountId: null,
  offeredDiscount: null,
  metadata: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  cart: {
    id: 'cart-1',
    items: [],
    status: 'ABANDONED',
  },
  customer: {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: null,
  },
};

describe('AbandonedCartsService', () => {
  let service: AbandonedCartsService;
  let prisma: ReturnType<typeof makePrisma>;
  let discountsService: ReturnType<typeof makeDiscountsService>;

  beforeEach(() => {
    prisma = makePrisma();
    discountsService = makeDiscountsService();
    service = new AbandonedCartsService(prisma as any, discountsService as any);
  });

  describe('sendRecoveryNotification', () => {
    it('throws BadRequestException when cart is already RECOVERED', async () => {
      prisma.abandonedCartRecovery.findUnique.mockResolvedValue({
        ...baseRecovery,
        status: 'RECOVERED',
      });
      await expect(service.sendRecoveryNotification('rec-1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when cart is CANCELLED', async () => {
      prisma.abandonedCartRecovery.findUnique.mockResolvedValue({
        ...baseRecovery,
        status: 'CANCELLED',
      });
      await expect(service.sendRecoveryNotification('rec-1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when within cooldown window', async () => {
      const recent = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      prisma.abandonedCartRecovery.findUnique.mockResolvedValue({
        ...baseRecovery,
        lastNotificationSentAt: recent,
      });
      await expect(service.sendRecoveryNotification('rec-1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when max reminders reached', async () => {
      prisma.abandonedCartRecovery.findUnique.mockResolvedValue({
        ...baseRecovery,
        reminderCount: 3,
        lastNotificationSentAt: null,
      });
      await expect(service.sendRecoveryNotification('rec-1')).rejects.toThrow(BadRequestException);
    });

    it('sends notification and increments reminderCount', async () => {
      prisma.abandonedCartRecovery.findUnique.mockResolvedValue(baseRecovery);
      prisma.abandonedCartRecovery.update.mockResolvedValue({
        ...baseRecovery,
        status: 'NOTIFICATION_SENT',
        reminderCount: 1,
      });

      const result = await service.sendRecoveryNotification('rec-1');
      expect(result.recoveryUrl).toContain('tok-abc123');
      expect(prisma.abandonedCartRecovery.update).toHaveBeenCalledOnce();
    });
  });

  describe('detectAbandonedCarts', () => {
    it('returns empty result when no candidates found', async () => {
      prisma.cart.findMany.mockResolvedValue([]);
      const result = await service.detectAbandonedCarts({ inactivityHours: 1 });
      expect(result.detectedCount).toBe(0);
      expect(result.recoveries).toHaveLength(0);
    });
  });

  describe('markConverted', () => {
    it('updates recovery to RECOVERED status', async () => {
      const client = {
        abandonedCartRecovery: {
          findUnique: vi.fn().mockResolvedValue({ ...baseRecovery, status: 'NOTIFICATION_SENT' }),
          update: vi.fn().mockResolvedValue({ ...baseRecovery, status: 'RECOVERED' }),
        },
      };
      await service.markConverted('cart-1', client as any);
      expect(client.abandonedCartRecovery.update).toHaveBeenCalledOnce();
    });

    it('does nothing if recovery is already RECOVERED', async () => {
      const client = {
        abandonedCartRecovery: {
          findUnique: vi.fn().mockResolvedValue({ ...baseRecovery, status: 'RECOVERED' }),
          update: vi.fn(),
        },
      };
      await service.markConverted('cart-1', client as any);
      expect(client.abandonedCartRecovery.update).not.toHaveBeenCalled();
    });

    it('does nothing if no recovery record exists', async () => {
      const client = {
        abandonedCartRecovery: {
          findUnique: vi.fn().mockResolvedValue(null),
          update: vi.fn(),
        },
      };
      await service.markConverted('cart-1', client as any);
      expect(client.abandonedCartRecovery.update).not.toHaveBeenCalled();
    });
  });
});
