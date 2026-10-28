import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from '../../audit/audit.service.js';

export const SHAPE_AREA_RATE_PER_SQIN_KEY = 'shape_area_rate_per_sqin';

@Injectable()
export class PricingSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  findAll() {
    return this.prisma.pricingSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async findOne(key: string) {
    const setting = await this.prisma.pricingSetting.findUnique({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Pricing setting ${key} not found`);
    }
    return setting;
  }

  /** Public, unauthenticated read used by the storefront to price shapes live. */
  async getShapeAreaRate(): Promise<Prisma.Decimal> {
    const setting = await this.prisma.pricingSetting.findUnique({ where: { key: SHAPE_AREA_RATE_PER_SQIN_KEY } });
    return setting?.value ?? new Prisma.Decimal(0);
  }

  async update(key: string, value: string, adminUserId: string) {
    await this.findOne(key);

    const updated = await this.prisma.pricingSetting.update({
      where: { key },
      data: { value, updatedBy: adminUserId },
    });

    await this.auditService.record({
      adminUserId,
      action: 'PRICING_SETTING_UPDATED',
      entityType: 'PricingSetting',
      entityId: key,
      reason: `Set to ${value}`,
    });

    return updated;
  }
}
