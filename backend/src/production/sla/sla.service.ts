import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

/**
 * SLA due-date calculation is configurable per product type + stage (scope
 * §104-106, §113: don't hard-code). A null productTypeId rule applies to all
 * product types; a specific-productType rule takes precedence when present.
 */
@Injectable()
export class SlaService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveDueDate(productTypeId: string, stage: string, from: Date): Promise<Date | null> {
    const specific = await this.prisma.productionSlaRule.findFirst({
      where: { productTypeId, stage: stage as never, isActive: true },
    });
    const rule =
      specific ??
      (await this.prisma.productionSlaRule.findFirst({
        where: { productTypeId: null, stage: stage as never, isActive: true },
      }));

    if (!rule) return null;

    return this.addMinutes(from, rule.durationMinutes);
  }

  addMinutes(base: Date, minutes: number): Date {
    return new Date(base.getTime() + minutes * 60_000);
  }
}
