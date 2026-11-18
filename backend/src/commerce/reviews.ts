import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const maxCommentLength = 2000;

export class Reviews {
  constructor(private readonly prisma: PrismaClient) {}

  /** Public: approved reviews for one product, used on the storefront product page. */
  async listApprovedForProduct(productSlug: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productSlug, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, rating: true, comment: true, createdAt: true,
        customer: { select: { name: true } },
      },
    });
    const count = reviews.length;
    const average = count ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : 0;
    return {
      count,
      average,
      reviews: reviews.map(r => ({
        id: r.id, rating: r.rating, comment: r.comment, createdAt: r.createdAt,
        // First name and an initial only — a review is public, so the full name is never shown.
        customerName: firstNameAndInitial(r.customer.name),
      })),
    };
  }

  /**
   * Resolves who is asking the same way order status lookup and cancellation already do:
   * the order number plus the email it was placed under. No separate customer login needed.
   */
  private async findOrderForCustomer(orderNumber: string, email: string) {
    const order = await this.prisma.order.findFirst({
      where: { orderNumber: orderNumber.trim(), customer: { email: email.trim().toLowerCase() } },
      select: { id: true, customerId: true, shippingStatus: true },
    });
    if (!order) throw new NotFoundException('No order found with that order number and email.');
    return order;
  }

  /**
   * Customer: the order items on this order that can be reviewed right now — delivered,
   * carrying a product slug (orders placed before slug-tracking was added can't be reviewed),
   * and not already reviewed.
   */
  async listReviewable(orderNumber: string, email: string) {
    const order = await this.findOrderForCustomer(orderNumber, email);
    const items = await this.prisma.orderItem.findMany({
      where: { orderId: order.id, review: null },
      orderBy: { createdAt: 'desc' },
      select: { id: true, productNameSnapshot: true, createdAt: true, variantSnapshot: true },
    });
    const reviewableItems = items
      .filter(item => (item.variantSnapshot as { productSlug?: string } | null)?.productSlug)
      .map(item => ({
        orderItemId: item.id,
        productName: item.productNameSnapshot,
        productSlug: (item.variantSnapshot as { productSlug: string }).productSlug,
        imageUrl: (item.variantSnapshot as { imageUrl?: string } | null)?.imageUrl ?? null,
        purchasedAt: item.createdAt,
      }));
    return {
      delivered: order.shippingStatus === 'DELIVERED',
      items: order.shippingStatus === 'DELIVERED' ? reviewableItems : [],
    };
  }

  /** Customer: submit a review for one order item on an order they can prove is theirs. */
  async create(orderNumber: string, email: string, orderItemId: string, rating: number, comment: string) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be a whole number from 1 to 5.');
    }
    const text = comment.trim();
    if (!text || text.length > maxCommentLength) {
      throw new BadRequestException(`Write a review of up to ${maxCommentLength} characters.`);
    }

    const order = await this.findOrderForCustomer(orderNumber, email);
    if (order.shippingStatus !== 'DELIVERED') {
      throw new BadRequestException('You can review an item once it has been delivered.');
    }
    const item = await this.prisma.orderItem.findUnique({ where: { id: orderItemId }, include: { review: true } });
    if (!item || item.orderId !== order.id) throw new NotFoundException('That item is not on this order.');
    const productSlug = (item.variantSnapshot as { productSlug?: string } | null)?.productSlug;
    if (!productSlug) {
      throw new BadRequestException('This order was placed before reviews were tracked and cannot be reviewed.');
    }
    if (item.review) throw new ConflictException('You already reviewed this item.');

    return this.prisma.review.create({
      data: { customerId: order.customerId, orderItemId, productSlug, rating, comment: text },
    });
  }

  /** Admin: every review, optionally filtered by status, for the moderation screen. */
  async listForModeration(status?: string) {
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (status && !validStatuses.includes(status)) throw new BadRequestException('Invalid status filter.');
    return this.prisma.review.findMany({
      where: status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        orderItem: { select: { productNameSnapshot: true, order: { select: { orderNumber: true } } } },
      },
    });
  }

  /** Admin: approve or reject a pending (or previously-moderated) review. */
  async moderate(id: string, status: 'APPROVED' | 'REJECTED', adminUserId: string, rejectionReason?: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found.');
    if (status === 'REJECTED' && rejectionReason !== undefined && rejectionReason.length > 500) {
      throw new BadRequestException('Rejection reason must be 500 characters or fewer.');
    }
    return this.prisma.review.update({
      where: { id },
      data: {
        status,
        moderatedBy: adminUserId,
        moderatedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? (rejectionReason?.trim() || null) : null,
      },
    });
  }

  /** Admin: permanently delete a review (e.g. spam, abuse). */
  async remove(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found.');
    await this.prisma.review.delete({ where: { id } });
    return { deleted: true };
  }
}

function firstNameAndInitial(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Customer';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
