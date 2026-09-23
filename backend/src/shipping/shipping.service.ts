import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import type { CreateShipmentDto } from './dto/create-shipment.dto.js';
import type {
  CourierProviderAdapter,
  CreateShipmentResult,
} from './adapters/courier-provider.interface.js';

export const COURIER_PROVIDER = 'COURIER_PROVIDER';

@Injectable()
export class ShippingService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(COURIER_PROVIDER)
    private readonly courierProvider: CourierProviderAdapter,
  ) {}

  findAll() {
    return this.prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            shippingStatus: true,
          },
        },
        warehouse: true,
        items: true,
        trackingEvents: {
          orderBy: { occurredAt: 'asc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            shippingStatus: true,
          },
        },
        warehouse: true,
        items: {
          include: {
            orderItem: true,
          },
        },
        trackingEvents: {
          orderBy: { occurredAt: 'asc' },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }

    return shipment;
  }

  async create(dto: CreateShipmentDto): Promise<unknown> {
    if (dto.items.length === 0) {
      throw new BadRequestException(
        'At least one order item is required for a shipment',
      );
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${dto.orderId} not found`);
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse ${dto.warehouseId} not found`,
      );
    }

    if (!warehouse.isActive) {
      throw new BadRequestException(
        `Warehouse ${dto.warehouseId} is inactive`,
      );
    }

    const orderItemIds = new Set(order.items.map((item) => item.id));

    for (const item of dto.items) {
      if (!orderItemIds.has(item.orderItemId)) {
        throw new BadRequestException(
          `Order item ${item.orderItemId} does not belong to order ${dto.orderId}`,
        );
      }

      const orderItem = order.items.find(
        (candidate) => candidate.id === item.orderItemId,
      );

      if (orderItem && item.quantity > orderItem.quantity) {
        throw new BadRequestException(
          `Shipment quantity for order item ${item.orderItemId} exceeds ordered quantity`,
        );
      }
    }

    // The adapter is deliberately called before the database write.
    // A real courier provider must successfully create the shipment before
    // we persist the shipment and advance the order lifecycle.
    const providerResult: CreateShipmentResult =
      await this.courierProvider.createShipment(
        dto.orderId,
        dto.warehouseId,
        dto.items.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
        })),
      );

    return this.prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          orderId: dto.orderId,
          warehouseId: dto.warehouseId,
          courierProvider: dto.courierProvider,
          awbNumber: providerResult.awbNumber,
          status: 'READY',
          items: {
            create: dto.items.map((item) => ({
              orderItemId: item.orderItemId,
              quantity: item.quantity,
            })),
          },
          trackingEvents: {
            create: {
              status: 'READY',
              description: 'Shipment created',
            },
          },
        },
        include: {
          items: true,
          trackingEvents: true,
        },
      });

      await tx.order.update({
        where: { id: dto.orderId },
        data: {
          shippingStatus: 'READY',
          events: {
            create: {
              type: 'shipment.created',
              message: `Shipment ${shipment.id} created with ${dto.courierProvider}`,
              metadata: {
                shipmentId: shipment.id,
                courierProvider: dto.courierProvider,
                awbNumber: providerResult.awbNumber ?? null,
              },
            },
          },
        },
      });

      return shipment;
    });
  }

  async cancel(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }

    if (shipment.status === 'DELIVERED') {
      throw new BadRequestException(
        'A delivered shipment cannot be cancelled',
      );
    }

    if (shipment.status === 'RTO') {
      throw new BadRequestException(
        'An RTO shipment cannot be cancelled',
      );
    }

    if (!shipment.awbNumber) {
      throw new BadRequestException(
        'Shipment has no AWB number and cannot be cancelled with the courier',
      );
    }

    await this.courierProvider.cancelShipment(shipment.awbNumber);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id },
        data: {
          status: 'NOT_SHIPPED',
          trackingEvents: {
            create: {
              status: 'NOT_SHIPPED',
              description: 'Shipment cancelled',
            },
          },
        },
        include: {
          items: true,
          trackingEvents: {
            orderBy: { occurredAt: 'asc' },
          },
        },
      });

      await tx.order.update({
        where: { id: shipment.orderId },
        data: {
          shippingStatus: 'NOT_SHIPPED',
          events: {
            create: {
              type: 'shipment.cancelled',
              message: `Shipment ${id} cancelled`,
              metadata: {
                shipmentId: id,
                awbNumber: shipment.awbNumber,
              },
            },
          },
        },
      });

      return updated;
    });
  }
}
