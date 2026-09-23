import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { JobsService } from '../../production/jobs/jobs.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { CreateReturnRequestDto } from './dto/create-return-request.dto.js';
import type { CreateReplacementRequestDto } from './dto/create-replacement-request.dto.js';

@Injectable()
export class ReturnsReplacementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly ordersService: OrdersService,
  ) {}

  // -------------------------------------------------------------
  // RETURNS
  // -------------------------------------------------------------

  findReturnRequests() {
    return this.prisma.returnRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: true,
        orderItem: true,
      },
    });
  }

  async findReturnRequest(id: string) {
    const request = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: {
        order: true,
        orderItem: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Return request ${id} not found`);
    }

    return request;
  }

  async createReturnRequest(dto: CreateReturnRequestDto) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: dto.orderItemId },
      include: { order: true },
    });

    if (!orderItem) {
      throw new NotFoundException(
        `Order item ${dto.orderItemId} not found`,
      );
    }

    if (orderItem.orderId !== dto.orderId) {
      throw new BadRequestException(
        'Order item does not belong to the specified order',
      );
    }

    if (!dto.reason.trim()) {
      throw new BadRequestException('Return reason cannot be empty');
    }

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.returnRequest.create({
        data: {
          orderId: dto.orderId,
          orderItemId: dto.orderItemId,
          reason: dto.reason.trim(),
          status: 'REQUESTED',
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: dto.orderId,
          type: 'return.requested',
          message: `Return requested for order item ${dto.orderItemId}`,
          metadata: {
            returnRequestId: request.id,
            orderItemId: dto.orderItemId,
            reason: dto.reason.trim(),
          },
        },
      });

      return request;
    });
  }

  async reviewReturn(id: string) {
    const request = await this.findReturnRequest(id);

    if (request.status !== 'REQUESTED') {
      throw new BadRequestException(
        `Return request cannot move to REVIEW from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id },
        data: { status: 'REVIEW' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'return.review',
          message: `Return request ${id} moved to review`,
          metadata: { returnRequestId: id },
        },
      });

      return updated;
    });
  }

  async approveReturn(id: string) {
    const request = await this.findReturnRequest(id);

    if (request.status !== 'REVIEW') {
      throw new BadRequestException(
        `Return request cannot be approved from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'return.approved',
          message: `Return request ${id} approved`,
          metadata: { returnRequestId: id },
        },
      });

      return updated;
    });
  }

  async markReturned(id: string) {
    const request = await this.findReturnRequest(id);

    if (request.status !== 'APPROVED') {
      throw new BadRequestException(
        `Return request cannot be marked RETURNED from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id },
        data: { status: 'RETURNED' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'return.returned',
          message: `Return request ${id} marked as returned`,
          metadata: { returnRequestId: id },
        },
      });

      return updated;
    });
  }

  // Refund integration will use the existing Orders refund path.
  // This method intentionally does not create a second refund mechanism.

  // -------------------------------------------------------------
  async refundReturn(id: string) {
    const request = await this.findReturnRequest(id);

    if (request.status !== 'RETURNED') {
      throw new BadRequestException(
        `Return request cannot be refunded from ${request.status}`,
      );
    }

    const amount = new Prisma.Decimal(request.orderItem.priceSnapshot)
      .mul(request.orderItem.quantity)
      .toFixed(2);

    await this.ordersService.refund(
      request.orderId,
      amount,
      request.reason,
    );

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id },
        data: { status: 'REFUNDED' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'return.refunded',
          message: `Return request ${id} refunded`,
          metadata: {
            returnRequestId: id,
            orderItemId: request.orderItemId,
            amount,
          },
        },
      });

      return updated;
    });
  }
  // REPLACEMENTS
  // -------------------------------------------------------------

  findReplacementRequests() {
    return this.prisma.replacementRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: true,
        orderItem: true,
      },
    });
  }

  async findReplacementRequest(id: string) {
    const request = await this.prisma.replacementRequest.findUnique({
      where: { id },
      include: {
        order: true,
        orderItem: true,
      },
    });

    if (!request) {
      throw new NotFoundException(
        `Replacement request ${id} not found`,
      );
    }

    return request;
  }

  async createReplacementRequest(dto: CreateReplacementRequestDto) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: dto.orderItemId },
      include: { order: true },
    });

    if (!orderItem) {
      throw new NotFoundException(
        `Order item ${dto.orderItemId} not found`,
      );
    }

    if (orderItem.orderId !== dto.orderId) {
      throw new BadRequestException(
        'Order item does not belong to the specified order',
      );
    }

    if (!dto.complaintReason.trim()) {
      throw new BadRequestException(
        'Complaint reason cannot be empty',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const request = await tx.replacementRequest.create({
        data: {
          orderId: dto.orderId,
          orderItemId: dto.orderItemId,
          complaintReason: dto.complaintReason.trim(),
          status: 'REQUESTED',
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: dto.orderId,
          type: 'replacement.requested',
          message: `Replacement requested for order item ${dto.orderItemId}`,
          metadata: {
            replacementRequestId: request.id,
            orderItemId: dto.orderItemId,
            complaintReason: dto.complaintReason.trim(),
          },
        },
      });

      return request;
    });
  }

  async reviewReplacement(id: string) {
    const request = await this.findReplacementRequest(id);

    if (request.status !== 'REQUESTED') {
      throw new BadRequestException(
        `Replacement request cannot move to REVIEW from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.replacementRequest.update({
        where: { id },
        data: { status: 'REVIEW' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'replacement.review',
          message: `Replacement request ${id} moved to review`,
          metadata: { replacementRequestId: id },
        },
      });

      return updated;
    });
  }

  async approveReplacement(id: string) {
    const request = await this.findReplacementRequest(id);

    if (request.status !== 'REVIEW') {
      throw new BadRequestException(
        `Replacement request cannot be approved from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const job = await this.jobsService.createForOrderItem(
        request.orderItemId,
        true,
        tx,
      );

      const updated = await tx.replacementRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'replacement.approved',
          message: `Replacement request ${id} approved`,
          metadata: {
            replacementRequestId: id,
            orderItemId: request.orderItemId,
            productionJobId: job?.id ?? null,
          },
        },
      });

      return {
        request: updated,
        productionJob: job,
      };
    });
  }

  async completeReplacement(id: string) {
    const request = await this.findReplacementRequest(id);

    if (request.status !== 'APPROVED') {
      throw new BadRequestException(
        `Replacement request cannot be completed from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.replacementRequest.update({
        where: { id },
        data: { status: 'COMPLETED' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'replacement.completed',
          message: `Replacement request ${id} completed`,
          metadata: { replacementRequestId: id },
        },
      });

      return updated;
    });
  }

  async rejectReplacement(id: string) {
    const request = await this.findReplacementRequest(id);

    if (
      request.status !== 'REQUESTED' &&
      request.status !== 'REVIEW'
    ) {
      throw new BadRequestException(
        `Replacement request cannot be rejected from ${request.status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.replacementRequest.update({
        where: { id },
        data: { status: 'REJECTED' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: request.orderId,
          type: 'replacement.rejected',
          message: `Replacement request ${id} rejected`,
          metadata: { replacementRequestId: id },
        },
      });

      return updated;
    });
  }
}

