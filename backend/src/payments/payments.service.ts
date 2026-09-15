import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  findByOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      include: { transactions: true },
    });
  }

  createForOrder(orderId: string, provider: 'RAZORPAY' | 'UPI' | 'COD', amount: string) {
    return this.prisma.payment.create({
      data: { orderId, provider, amount, status: 'PENDING' },
    });
  }

  async recordTransaction(paymentId: string, type: string, status: string, rawPayload?: unknown) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found`);
    }

    return this.prisma.paymentTransaction.create({
      data: { paymentId, type, status, rawPayload: rawPayload as never },
    });
  }

  async markPaid(paymentId: string, providerRef: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', providerRef },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'PAID', orderStatus: 'PAID' },
      });

      await tx.orderEvent.create({
        data: { orderId: payment.orderId, type: 'order.paid', message: 'Payment confirmed' },
      });

      return payment;
    });
  }
}
