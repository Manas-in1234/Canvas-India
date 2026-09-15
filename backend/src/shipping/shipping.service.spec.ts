import { describe, expect, it, vi } from 'vitest';
import { ShippingService } from './shipping.service.js';

describe('ShippingService', () => {
  it('creates a shipment and updates the order shipping status', async () => {
    const shipment = {
      id: 'shipment-1',
      orderId: 'order-1',
      warehouseId: 'warehouse-1',
      courierProvider: 'stub',
      awbNumber: 'AWB123',
      status: 'READY',
      items: [
        {
          id: 'shipment-item-1',
          orderItemId: 'order-item-1',
          quantity: 1,
        },
      ],
      trackingEvents: [
        {
          id: 'tracking-1',
          status: 'READY',
          description: 'Shipment created',
        },
      ],
    };

    const prisma = {
      order: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'order-1',
          items: [
            {
              id: 'order-item-1',
              quantity: 1,
            },
          ],
        }),
        update: vi.fn(),
      },
      warehouse: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'warehouse-1',
          isActive: true,
        }),
      },
      shipment: {
        create: vi.fn().mockResolvedValue(shipment),
      },
      $transaction: vi.fn(async (callback) => {
        const tx = {
          shipment: {
            create: vi.fn().mockResolvedValue(shipment),
          },
          order: {
            update: vi.fn().mockResolvedValue({
              id: 'order-1',
              shippingStatus: 'READY',
            }),
          },
        };

        return callback(tx);
      }),
    };

    const courierProvider = {
      createShipment: vi.fn().mockResolvedValue({
        providerShipmentId: 'provider-shipment-1',
        awbNumber: 'AWB123',
      }),
      getRates: vi.fn(),
      trackShipment: vi.fn(),
      cancelShipment: vi.fn(),
    };

    const service = new ShippingService(
      prisma as any,
      courierProvider as any,
    );

    const result = await service.create({
      orderId: 'order-1',
      warehouseId: 'warehouse-1',
      courierProvider: 'stub',
      items: [
        {
          orderItemId: 'order-item-1',
          quantity: 1,
        },
      ],
    });

    expect(courierProvider.createShipment).toHaveBeenCalledWith(
      'order-1',
      'warehouse-1',
      [
        {
          orderItemId: 'order-item-1',
          quantity: 1,
        },
      ],
    );

    expect(result).toEqual(shipment);
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
