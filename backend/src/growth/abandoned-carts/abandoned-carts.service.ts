import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service.js';
import { DiscountsService } from '../discounts/discounts.service.js';
import { DetectAbandonedCartsDto } from './dto/detect-abandoned-carts.dto.js';
import {
  NotificationChannel,
  SendRecoveryNotificationDto,
} from './dto/send-recovery-notification.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class AbandonedCartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly discountsService: DiscountsService,
  ) {}

  findAll(filter?: { status?: string; customerId?: string }) {
    const where: Prisma.AbandonedCartRecoveryWhereInput = {};
    if (filter?.status) where.status = filter.status as any;
    if (filter?.customerId) where.customerId = filter.customerId;

    return this.prisma.abandonedCartRecovery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        cart: {
          include: {
            items: {
              include: {
                variant: {
                  include: { product: { select: { id: true, name: true } } },
                },
              },
            },
          },
        },
        customer: { select: { id: true, name: true, email: true, phone: true } },
        offeredDiscount: { select: { id: true, code: true, discountType: true, value: true } },
      },
    });
  }

  async findOne(id: string) {
    const recovery = await this.prisma.abandonedCartRecovery.findUnique({
      where: { id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                variant: {
                  include: { product: { select: { id: true, name: true } } },
                },
              },
            },
          },
        },
        customer: true,
        offeredDiscount: true,
      },
    });

    if (!recovery) {
      throw new NotFoundException(`Abandoned cart recovery ${id} not found`);
    }

    return recovery;
  }

  async findByToken(token: string) {
    const recovery = await this.prisma.abandonedCartRecovery.findUnique({
      where: { recoveryToken: token },
      include: {
        cart: {
          include: {
            items: {
              include: {
                variant: {
                  include: { product: { select: { id: true, name: true } } },
                },
              },
            },
          },
        },
        customer: true,
        offeredDiscount: true,
      },
    });

    if (!recovery) {
      throw new NotFoundException(`Recovery token '${token}' is invalid`);
    }

    return recovery;
  }

  async detectAbandonedCarts(dto?: DetectAbandonedCartsDto) {
    const hours = dto?.inactivityHours ?? 1;
    const limit = dto?.limit ?? 100;
    const threshold = new Date(Date.now() - hours * 60 * 60 * 1000);

    // Find carts that are ACTIVE, have items, and haven't been touched since threshold
    const candidates = await this.prisma.cart.findMany({
      where: {
        status: 'ACTIVE',
        updatedAt: { lte: threshold },
        items: { some: {} },
        recovery: null, // Cart doesn't already have an AbandonedCartRecovery record
      },
      take: limit,
      include: { items: true },
    });

    const detectedRecoveries = [];

    for (const cart of candidates) {
      const recoveryToken = crypto.randomBytes(24).toString('hex');

      const recovery = await this.prisma.$transaction(async (tx) => {
        await tx.cart.update({
          where: { id: cart.id },
          data: { status: 'ABANDONED' },
        });

        return tx.abandonedCartRecovery.create({
          data: {
            cartId: cart.id,
            customerId: cart.customerId,
            recoveryToken,
            status: 'DETECTED',
            reminderCount: 0,
          },
          include: {
            cart: { include: { items: true } },
            customer: true,
          },
        });
      });

      detectedRecoveries.push(recovery);
    }

    return {
      detectedCount: detectedRecoveries.length,
      recoveries: detectedRecoveries,
    };
  }

  async sendRecoveryNotification(id: string, dto?: SendRecoveryNotificationDto) {
    const recovery = await this.findOne(id);

    if (recovery.status === 'RECOVERED') {
      throw new BadRequestException('Cannot send recovery notification for an already recovered cart');
    }

    if (recovery.status === 'CANCELLED' || recovery.status === 'EXPIRED') {
      throw new BadRequestException(
        `Cannot send recovery notification for a cart in ${recovery.status} status`,
      );
    }

    // Cooldown check (minimum 10 minutes between notifications)
    if (recovery.lastNotificationSentAt) {
      const msSinceLast = Date.now() - recovery.lastNotificationSentAt.getTime();
      const cooldownMs = 10 * 60 * 1000;
      if (msSinceLast < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - msSinceLast) / 1000);
        throw new BadRequestException(
          `Notification cooldown active. Please wait ${remainingSec} seconds before sending another reminder`,
        );
      }
    }

    // Max reminders check
    if (recovery.reminderCount >= 3) {
      throw new BadRequestException('Maximum reminder limit (3) reached for this cart');
    }

    let discountId: string | undefined = recovery.offeredDiscountId ?? undefined;

    if (dto?.discountCode) {
      const discount = await this.discountsService.findByCode(dto.discountCode);
      discountId = discount.id;
    }

    const channel = dto?.channel ?? NotificationChannel.EMAIL;
    const now = new Date();

    const existingMetadata =
      recovery.metadata && typeof recovery.metadata === 'object' && !Array.isArray(recovery.metadata)
        ? (recovery.metadata as Record<string, any>)
        : {};

    const logs = Array.isArray(existingMetadata.logs) ? existingMetadata.logs : [];
    logs.push({
      sentAt: now.toISOString(),
      channel,
      discountCode: dto?.discountCode,
      message: dto?.customMessage,
    });

    const updated = await this.prisma.abandonedCartRecovery.update({
      where: { id },
      data: {
        status: 'NOTIFICATION_SENT',
        reminderCount: { increment: 1 },
        lastNotificationSentAt: now,
        offeredDiscountId: discountId,
        metadata: {
          ...existingMetadata,
          logs,
        },
      },
      include: {
        cart: true,
        customer: true,
        offeredDiscount: true,
      },
    });

    return {
      recovery: updated,
      recoveryUrl: `/cart/recover?token=${updated.recoveryToken}`,
      channel,
    };
  }

  async recoverCart(token: string) {
    const recovery = await this.findByToken(token);

    if (recovery.status === 'CANCELLED') {
      throw new BadRequestException('This recovery link has been cancelled');
    }

    if (recovery.status === 'EXPIRED') {
      throw new BadRequestException('This recovery link has expired');
    }

    return this.prisma.$transaction(async (tx) => {
      // Set cart back to ACTIVE so customer can continue checkout
      const cart = await tx.cart.update({
        where: { id: recovery.cartId },
        data: {
          status: 'ACTIVE',
          discountCode: recovery.offeredDiscount ? recovery.offeredDiscount.code : undefined,
        },
        include: { items: true },
      });

      const updatedRecovery = await tx.abandonedCartRecovery.update({
        where: { id: recovery.id },
        data: {
          status: 'RECOVERED',
          recoveredAt: new Date(),
        },
        include: { offeredDiscount: true },
      });

      return {
        message: 'Cart successfully recovered',
        cart,
        recovery: updatedRecovery,
      };
    });
  }

  async markConverted(cartId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    const recovery = await client.abandonedCartRecovery.findUnique({
      where: { cartId },
    });

    if (recovery && recovery.status !== 'RECOVERED') {
      await client.abandonedCartRecovery.update({
        where: { id: recovery.id },
        data: {
          status: 'RECOVERED',
          recoveredAt: new Date(),
        },
      });
    }
  }
}
