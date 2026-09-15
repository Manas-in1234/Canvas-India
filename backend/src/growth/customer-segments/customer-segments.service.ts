import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateCustomerSegmentDto } from './dto/create-customer-segment.dto.js';
import { UpdateCustomerSegmentDto } from './dto/update-customer-segment.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class CustomerSegmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
    return this.prisma.customerSegment.findMany({
      where: isActive !== undefined ? { isActive } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  async findOne(id: string) {
    const segment = await this.prisma.customerSegment.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            customer: {
              select: { id: true, name: true, email: true, phone: true, isGuest: true },
            },
          },
        },
        _count: { select: { members: true, campaigns: true, discounts: true, promotions: true } },
      },
    });

    if (!segment) {
      throw new NotFoundException(`Customer segment ${id} not found`);
    }

    return segment;
  }

  async findBySlug(slug: string) {
    const segment = await this.prisma.customerSegment.findUnique({
      where: { slug },
      include: {
        _count: { select: { members: true } },
      },
    });

    if (!segment) {
      throw new NotFoundException(`Customer segment with slug '${slug}' not found`);
    }

    return segment;
  }

  async create(dto: CreateCustomerSegmentDto) {
    const existing = await this.prisma.customerSegment.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug: dto.slug }],
      },
    });

    if (existing) {
      throw new ConflictException(
        `Segment with name '${dto.name}' or slug '${dto.slug}' already exists`,
      );
    }

    const segment = await this.prisma.customerSegment.create({
      data: {
        name: dto.name,
        slug: dto.slug.toLowerCase().trim(),
        description: dto.description,
        type: dto.type ?? 'DYNAMIC',
        criteria: dto.criteria ? (dto.criteria as Prisma.InputJsonValue) : Prisma.JsonNull,
        isActive: dto.isActive ?? true,
      },
    });

    // If dynamic and criteria provided, auto-evaluate
    if (segment.type === 'DYNAMIC' && dto.criteria) {
      await this.evaluateSegment(segment.id);
    }

    return this.findOne(segment.id);
  }

  async update(id: string, dto: UpdateCustomerSegmentDto) {
    await this.findOne(id);

    if (dto.name) {
      const conflict = await this.prisma.customerSegment.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (conflict) {
        throw new ConflictException(`Segment with name '${dto.name}' already exists`);
      }
    }

    const updated = await this.prisma.customerSegment.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        criteria: dto.criteria ? (dto.criteria as Prisma.InputJsonValue) : undefined,
        isActive: dto.isActive,
      },
    });

    if (updated.type === 'DYNAMIC' && dto.criteria) {
      await this.evaluateSegment(id);
    }

    return this.findOne(id);
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.customerSegment.delete({ where: { id } });
  }

  async addMembers(segmentId: string, customerIds: string[]) {
    const segment = await this.findOne(segmentId);

    if (segment.type === 'DYNAMIC') {
      throw new BadRequestException('Cannot manually add members to a dynamic segment');
    }

    // Verify customers exist
    const customers = await this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true },
    });

    const validIds = customers.map((c) => c.id);

    await this.prisma.customerSegmentMember.createMany({
      data: validIds.map((customerId) => ({
        segmentId,
        customerId,
      })),
      skipDuplicates: true,
    });

    return this.findOne(segmentId);
  }

  async removeMember(segmentId: string, customerId: string) {
    const segment = await this.findOne(segmentId);

    if (segment.type === 'DYNAMIC') {
      throw new BadRequestException('Cannot manually remove members from a dynamic segment');
    }

    await this.prisma.customerSegmentMember.deleteMany({
      where: { segmentId, customerId },
    });

    return { success: true };
  }

  async evaluateSegment(segmentId: string) {
    const segment = await this.prisma.customerSegment.findUnique({
      where: { id: segmentId },
    });

    if (!segment) {
      throw new NotFoundException(`Customer segment ${segmentId} not found`);
    }

    const criteria = segment.criteria as {
      minSpend?: number;
      maxSpend?: number;
      minOrders?: number;
      maxOrders?: number;
      isGuest?: boolean;
      daysSinceLastOrder?: number;
    } | null;

    if (!criteria) {
      return { segmentId, matchedCount: 0 };
    }

    const customers = await this.prisma.customer.findMany({
      where: { deletedAt: null },
      include: {
        orders: {
          where: { orderStatus: { not: 'CANCELLED' } },
          select: { total: true, createdAt: true },
        },
      },
    });

    const now = new Date();
    const matchedCustomerIds: string[] = [];

    for (const customer of customers) {
      let isEligible = true;

      if (criteria.isGuest !== undefined && customer.isGuest !== criteria.isGuest) {
        isEligible = false;
      }

      const totalSpend = customer.orders.reduce(
        (sum, order) => sum.plus(order.total),
        new Prisma.Decimal(0),
      );
      const orderCount = customer.orders.length;

      if (criteria.minSpend !== undefined && totalSpend.lessThan(criteria.minSpend)) {
        isEligible = false;
      }

      if (criteria.maxSpend !== undefined && totalSpend.greaterThan(criteria.maxSpend)) {
        isEligible = false;
      }

      if (criteria.minOrders !== undefined && orderCount < criteria.minOrders) {
        isEligible = false;
      }

      if (criteria.maxOrders !== undefined && orderCount > criteria.maxOrders) {
        isEligible = false;
      }

      if (criteria.daysSinceLastOrder !== undefined) {
        const lastOrder = customer.orders.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )[0];

        if (!lastOrder) {
          isEligible = false;
        } else {
          const daysDiff = (now.getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff > criteria.daysSinceLastOrder) {
            isEligible = false;
          }
        }
      }

      if (isEligible) {
        matchedCustomerIds.push(customer.id);
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.customerSegmentMember.deleteMany({ where: { segmentId } });

      if (matchedCustomerIds.length > 0) {
        await tx.customerSegmentMember.createMany({
          data: matchedCustomerIds.map((customerId) => ({
            segmentId,
            customerId,
          })),
          skipDuplicates: true,
        });
      }
    });

    return { segmentId, matchedCount: matchedCustomerIds.length };
  }

  async isCustomerInSegment(customerId: string, segmentId: string): Promise<boolean> {
    const member = await this.prisma.customerSegmentMember.findUnique({
      where: {
        segmentId_customerId: {
          segmentId,
          customerId,
        },
      },
    });

    return !!member;
  }
}
