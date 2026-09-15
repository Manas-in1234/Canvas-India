import { describe, expect, it, vi } from 'vitest';
import { NdrRtoService } from './ndr-rto.service.js';

describe('NdrRtoService', () => {
  it('returns RTO inventory to the warehouse when an RTO shipment lands', async () => {
    const rtoCase = {
      id: 'rto-1',
      shipmentId: 'shipment-1',
      warehouseId: 'warehouse-1',
      receivedAt: null,
      inventoryUpdated: false,
      shipment: {
        id: 'shipment-1',
        orderId: 'order-1',
        items: [
          {
            id: 'shipment-item-1',
            orderItemId: 'order-item-1',
            quantity: 2,
            orderItem: {
              id: 'order-item-1',
              variantId: 'variant-1',
            },
          },
        ],
      },
      warehouse: {
        id: 'warehouse-1',
        name: 'Main Warehouse',
      },
    };

    const updatedRtoCase = {
      ...rtoCase,
      receivedAt: new Date(),
      inventoryUpdated: true,
    };

    const prisma = {
      rtoCase: {
        findUnique: vi.fn().mockResolvedValue(rtoCase),
        update: vi.fn().mockResolvedValue(updatedRtoCase),
      },
    };

    const inventoryService = {
      adjust: vi.fn().mockResolvedValue(undefined),
    };

    const service = new NdrRtoService(
      prisma as any,
      inventoryService as any,
    );

    const result = await service.landRto('rto-1');

    expect(inventoryService.adjust).toHaveBeenCalledWith(
      'variant-1',
      2,
      undefined,
      'RTO rto-1',
    );

    expect(prisma.rtoCase.update).toHaveBeenCalled();
    expect(result).toEqual(updatedRtoCase);
  });
});