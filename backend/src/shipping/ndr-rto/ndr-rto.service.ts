import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { InventoryService } from '../../inventory/inventory.service.js';
import type { CreateNdrCaseDto } from './dto/create-ndr-case.dto.js';
import type { CreateRtoCaseDto } from './dto/create-rto-case.dto.js';
import type { ChangeNdrAddressDto } from './dto/change-ndr-address.dto.js';

@Injectable()
export class NdrRtoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createNdrCase(dto: CreateNdrCaseDto) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: dto.shipmentId },
      include: { items: true },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment ${dto.shipmentId} not found`);
    }

    if (shipment.status === 'DELIVERED' || shipment.status === 'RTO') {
      throw new BadRequestException(
        `Cannot create an NDR case for shipment in status ${shipment.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const ndrCase = await tx.ndrCase.create({
        data: {
          shipmentId: dto.shipmentId,
          reason: dto.reason,
          attemptNumber: dto.attemptNumber,
          status: 'NDR',
        },
      });

      await tx.shipment.update({
        where: { id: dto.shipmentId },
        data: {
          status: 'NDR',
          trackingEvents: {
            create: {
              status: 'NDR',
              description: `NDR raised: ${dto.reason}`,
            },
          },
        },
      });

      await tx.order.update({
        where: { id: shipment.orderId },
        data: {
          shippingStatus: 'NDR',
          events: {
            create: {
              type: 'shipping.ndr_created',
              message: `NDR raised for shipment ${dto.shipmentId}`,
              metadata: {
                ndrCaseId: ndrCase.id,
                shipmentId: dto.shipmentId,
                reason: dto.reason,
                attemptNumber: dto.attemptNumber,
              },
            },
          },
        },
      });

      return ndrCase;
    });
  }

  findNdrCases() {
    return this.prisma.ndrCase.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        shipment: {
          include: {
            order: true,
            items: true,
          },
        },
      },
    });
  }

  async findNdrCase(id: string) {
    const ndrCase = await this.prisma.ndrCase.findUnique({
      where: { id },
      include: {
        shipment: {
          include: {
            order: true,
            items: true,
          },
        },
      },
    });

    if (!ndrCase) {
      throw new NotFoundException(`NDR case ${id} not found`);
    }

    return ndrCase;
  }

  async callCustomer(id: string) {
    return this.resolveNdrAction(
      id,
      'customer_called',
      'Customer contacted regarding NDR',
    );
  }

  async requestReattempt(id: string) {
    return this.resolveNdrAction(
      id,
      'reattempt_requested',
      'Delivery reattempt requested',
    );
  }

  async changeAddress(id: string, dto: ChangeNdrAddressDto) {
    if (!dto.address.trim()) {
      throw new BadRequestException('Address cannot be empty');
    }

    return this.resolveNdrAction(
      id,
      'address_changed',
      `Delivery address changed to: ${dto.address}`,
    );
  }

  async cancel(id: string) {
    const ndrCase = await this.getOpenNdrCase(id);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.ndrCase.update({
        where: { id },
        data: {
          resolution: 'cancelled',
        },
      });

      await tx.shipment.update({
        where: { id: ndrCase.shipmentId },
        data: {
          status: 'NOT_SHIPPED',
          trackingEvents: {
            create: {
              status: 'NOT_SHIPPED',
              description: 'Shipment cancelled from NDR',
            },
          },
        },
      });

      await tx.order.update({
        where: { id: ndrCase.shipment.orderId },
        data: {
          shippingStatus: 'NOT_SHIPPED',
          orderStatus: 'CANCELLED',
          events: {
            create: {
              type: 'shipping.ndr_cancelled',
              message: `Shipment ${ndrCase.shipmentId} cancelled from NDR`,
              metadata: {
                ndrCaseId: id,
                shipmentId: ndrCase.shipmentId,
              },
            },
          },
        },
      });

      return updated;
    });
  }

  async returnToOrigin(id: string) {
    const ndrCase = await this.getOpenNdrCase(id);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.ndrCase.update({
        where: { id },
        data: {
          resolution: 'return_to_origin',
        },
      });

      await tx.shipment.update({
        where: { id: ndrCase.shipmentId },
        data: {
          status: 'RTO',
          trackingEvents: {
            create: {
              status: 'RTO',
              description: 'Shipment marked for return to origin',
            },
          },
        },
      });

      await tx.order.update({
        where: { id: ndrCase.shipment.orderId },
        data: {
          shippingStatus: 'RTO',
          events: {
            create: {
              type: 'shipping.rto_initiated',
              message: `Shipment ${ndrCase.shipmentId} returned to origin`,
              metadata: {
                ndrCaseId: id,
                shipmentId: ndrCase.shipmentId,
              },
            },
          },
        },
      });

      return updated;
    });
  }

  async createRtoCase(dto: CreateRtoCaseDto) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: dto.shipmentId },
      include: {
        items: {
          include: {
            orderItem: true,
          },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment ${dto.shipmentId} not found`);
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse ${dto.warehouseId} not found`,
      );
    }

    if (shipment.status !== 'RTO') {
      throw new BadRequestException(
        `Shipment must be in RTO status before creating an RTO case`,
      );
    }

    return this.prisma.rtoCase.create({
      data: {
        shipmentId: dto.shipmentId,
        warehouseId: dto.warehouseId,
      },
    });
  }

  async landRto(id: string) {
    const rtoCase = await this.prisma.rtoCase.findUnique({
      where: { id },
      include: {
        shipment: {
          include: {
            items: {
              include: {
                orderItem: true,
              },
            },
          },
        },
      },
    });

    if (!rtoCase) {
      throw new NotFoundException(`RTO case ${id} not found`);
    }

    if (rtoCase.inventoryUpdated) {
      throw new BadRequestException(
        `Inventory has already been updated for RTO case ${id}`,
      );
    }

    for (const item of rtoCase.shipment.items) {
      if (!item.orderItem.variantId) {
        throw new BadRequestException(
          `Order item ${item.orderItemId} has no variant and cannot be returned to inventory`,
        );
      }

      await this.inventoryService.adjust(
        item.orderItem.variantId,
        item.quantity,
        undefined,
        `RTO ${rtoCase.id}`,
      );
    }

    return this.prisma.rtoCase.update({
      where: { id },
      data: {
        receivedAt: new Date(),
        inventoryUpdated: true,
      },
      include: {
        shipment: true,
        warehouse: true,
      },
    });
  }

  private async getOpenNdrCase(id: string) {
    const ndrCase = await this.prisma.ndrCase.findUnique({
      where: { id },
      include: { shipment: true },
    });

    if (!ndrCase) {
      throw new NotFoundException(`NDR case ${id} not found`);
    }

    if (ndrCase.status !== 'NDR' || ndrCase.resolution !== null) {
      throw new BadRequestException(
        'NDR case is already resolved',
      );
    }

    return ndrCase;
  }

  private async resolveNdrAction(
    id: string,
    resolution: string,
    message: string,
  ) {
    const ndrCase = await this.getOpenNdrCase(id);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.ndrCase.update({
        where: { id },
        data: { resolution },
      });

      await tx.shipment.update({
        where: { id: ndrCase.shipmentId },
        data: {
          trackingEvents: {
            create: {
              status: 'NDR',
              description: message,
            },
          },
        },
      });

      await tx.order.update({
        where: { id: ndrCase.shipment.orderId },
        data: {
          events: {
            create: {
              type: `shipping.ndr_${resolution}`,
              message,
              metadata: {
                ndrCaseId: id,
                shipmentId: ndrCase.shipmentId,
              },
            },
          },
        },
      });

      return updated;
    });
  }
}
