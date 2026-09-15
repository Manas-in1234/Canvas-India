import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to resolve and validate the UTC date range.
   * - startDate: inclusive
   * - endDate: exclusive
   * - Defaults to last 30 days in UTC if omitted
   * - Throws BadRequestException if dates are invalid or startDate >= endDate
   */
  public getDateRange(filter: AnalyticsFilterDto) {
    const now = new Date();
    let endDate: Date;
    let startDate: Date;

    if (filter.endDate) {
      endDate = new Date(filter.endDate);
      if (isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid endDate. Must be a valid ISO-8601 string.');
      }
    } else {
      endDate = now;
    }

    if (filter.startDate) {
      startDate = new Date(filter.startDate);
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException('Invalid startDate. Must be a valid ISO-8601 string.');
      }
    } else {
      // Default: 30 days prior in UTC
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    if (startDate >= endDate) {
      throw new BadRequestException('startDate must be strictly before endDate.');
    }

    return {
      startDate: new Date(startDate.toISOString()),
      endDate: new Date(endDate.toISOString()),
    };
  }

  // 1. SALES ANALYTICS
  async getSalesAnalytics(filter: AnalyticsFilterDto) {
    const { startDate, endDate } = this.getDateRange(filter);
    const ordersWhere: Prisma.OrderWhereInput = {
      createdAt: { gte: startDate, lt: endDate },
      orderStatus: { not: 'CANCELLED' },
    };

    // Sales warehouse filtering: Filter through associated shipment's warehouseId.
    // An EXISTS subquery ensures an order is counted at most once even if it has multiple shipments.
    if (filter.warehouseId) {
      ordersWhere.shipments = { some: { warehouseId: filter.warehouseId } };
    }

    const [orderAgg, itemAgg, totalOrders, byStatus, refundAgg] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { subtotal: true, total: true, discount: true, tax: true, shipping: true },
        where: ordersWhere,
      }),
      this.prisma.orderItem.aggregate({
        _sum: { quantity: true },
        where: { order: ordersWhere },
      }),
      this.prisma.order.count({ where: ordersWhere }),
      this.prisma.order.groupBy({
        by: ['orderStatus'],
        where: { createdAt: { gte: startDate, lt: endDate } },
        _count: { _all: true },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          ...ordersWhere,
          orderStatus: 'REFUNDED',
        },
      }),
    ]);

    const grossSales = Number(orderAgg._sum.subtotal ?? orderAgg._sum.total ?? 0);
    const totalDiscounts = Number(orderAgg._sum.discount ?? 0);
    const totalRefunds = Number(refundAgg._sum.total ?? 0);
    const netSales = grossSales - totalDiscounts - totalRefunds;
    const averageOrderValue = totalOrders > 0 ? netSales / totalOrders : 0;
    const totalUnits = itemAgg._sum.quantity ?? 0;

    return {
      summary: {
        totalOrders,
        totalUnits,
        grossSales,
        totalDiscounts,
        totalRefunds,
        netSales,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        totalTax: Number(orderAgg._sum.tax ?? 0),
        totalShippingRevenue: Number(orderAgg._sum.shipping ?? 0),
      },
      breakdown: {
        byStatus: byStatus.map((s) => ({
          status: s.orderStatus,
          count: s._count?._all ?? 0,
          revenue: Number(s._sum?.total ?? 0),
        })),
      },
    };
  }

  // 2. PRODUCT ANALYTICS
  async getProductAnalytics(filter: AnalyticsFilterDto) {
    const { startDate, endDate } = this.getDateRange(filter);
    const orderWhere: Prisma.OrderWhereInput = {
      createdAt: { gte: startDate, lt: endDate },
      orderStatus: { not: 'CANCELLED' },
    };
    if (filter.warehouseId) {
      orderWhere.shipments = { some: { warehouseId: filter.warehouseId } };
    }

    const itemWhere: Prisma.OrderItemWhereInput = {
      order: orderWhere,
    };
    if (filter.productId) {
      itemWhere.variant = { productId: filter.productId };
    }

    const grouped = await this.prisma.orderItem.groupBy({
      by: ['variantId'],
      where: itemWhere,
      _sum: { quantity: true, priceSnapshot: true },
      _count: { orderId: true },
    });

    const variantIds = grouped
      .map((g) => g.variantId)
      .filter((id): id is string => Boolean(id));

    // Batch query product variants to avoid N+1 queries
    const variants = variantIds.length > 0
      ? await this.prisma.productVariant.findMany({
          where: { id: { in: variantIds } },
          include: { product: true },
        })
      : [];

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // Aggregate by product
    const productMap = new Map<
      string,
      { productId: string; productName: string; unitsSold: number; revenue: number; orderCount: number }
    >();

    for (const row of grouped) {
      const variant = row.variantId ? variantMap.get(row.variantId) : null;
      const productId = variant?.productId ?? (filter.productId || 'UNKNOWN');
      const productName = variant?.product?.name ?? 'Unknown Product';
      const units = row._sum?.quantity ?? 0;
      const rev = Number(row._sum?.priceSnapshot ?? 0);
      const orders = row._count?.orderId ?? 0;

      if (productMap.has(productId)) {
        const existing = productMap.get(productId)!;
        existing.unitsSold += units;
        existing.revenue += rev;
        existing.orderCount += orders;
      } else {
        productMap.set(productId, {
          productId,
          productName,
          unitsSold: units,
          revenue: rev,
          orderCount: orders,
        });
      }
    }

    const products = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue);
    const totalProductsWithSales = products.length;
    const totalUnitsSold = products.reduce((acc, p) => acc + p.unitsSold, 0);
    const totalRevenue = products.reduce((acc, p) => acc + p.revenue, 0);

    return {
      summary: {
        totalProductsWithSales,
        totalUnitsSold,
        totalRevenue,
      },
      products,
    };
  }

  // 3. CUSTOMER ANALYTICS
  async getCustomerAnalytics(filter: AnalyticsFilterDto) {
    const { startDate, endDate } = this.getDateRange(filter);
    const orderWhere: Prisma.OrderWhereInput = {
      createdAt: { gte: startDate, lt: endDate },
      orderStatus: { not: 'CANCELLED' },
    };
    if (filter.customerId) {
      orderWhere.customerId = filter.customerId;
    }

    const [totalCustomers, newCustomers, customerOrders, segments] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.customer.count({
        where: {
          createdAt: { gte: startDate, lt: endDate },
          deletedAt: null,
        },
      }),
      this.prisma.order.groupBy({
        by: ['customerId'],
        where: orderWhere,
        _sum: { total: true },
        _count: { _all: true },
        orderBy: { _sum: { total: 'desc' } },
      }),
      this.prisma.customerSegment.findMany({
        where: { isActive: true },
        select: { id: true, name: true, _count: { select: { members: true } } },
      }),
    ]);

    const activeCustomers = customerOrders.length;
    let returningCustomers = 0;
    let totalCustomerRevenue = 0;

    for (const co of customerOrders) {
      const count = co._count?._all ?? 0;
      if (count > 1) {
        returningCustomers++;
      }
      totalCustomerRevenue += Number(co._sum?.total ?? 0);
    }

    // Top 10 customers by spend - single query batch fetch (no N+1)
    const topOrders = customerOrders.slice(0, 10);
    const topCustomerIds = topOrders.map((o) => o.customerId);
    const customerDetails = topCustomerIds.length > 0
      ? await this.prisma.customer.findMany({
          where: { id: { in: topCustomerIds } },
          select: { id: true, name: true, email: true },
        })
      : [];
    const custMap = new Map(customerDetails.map((c) => [c.id, c]));

    const topCustomers = topOrders.map((o) => ({
      customerId: o.customerId,
      name: custMap.get(o.customerId)?.name ?? 'Unknown',
      email: custMap.get(o.customerId)?.email ?? 'Unknown',
      totalOrders: o._count?._all ?? 0,
      totalSpend: Number(o._sum?.total ?? 0),
    }));

    const totalOrdersInPeriod = customerOrders.reduce((sum, c) => sum + (c._count?._all ?? 0), 0);
    const averageCustomerOrderValue =
      totalOrdersInPeriod > 0 ? totalCustomerRevenue / totalOrdersInPeriod : 0;

    return {
      summary: {
        totalCustomers,
        newCustomers,
        returningCustomers,
        activeCustomers,
        totalCustomerRevenue,
        averageCustomerOrderValue: Math.round(averageCustomerOrderValue * 100) / 100,
      },
      topCustomers,
      segmentBreakdown: segments.map((s) => ({
        segmentId: s.id,
        name: s.name,
        memberCount: s._count.members,
      })),
    };
  }

  // 4. PRODUCTION ANALYTICS
  async getProductionAnalytics(filter: AnalyticsFilterDto) {
    const { startDate, endDate } = this.getDateRange(filter);
    const where: Prisma.ProductionJobWhereInput = {
      createdAt: { gte: startDate, lt: endDate },
    };

    // Note: An OrderItem can have multiple ProductionJobs (e.g. from replacement requests or reprints).
    // We aggregate production jobs directly while also measuring unique orderItems.
    const [totalJobs, byStatus, byStage, uniqueOrderItems, overdueStages] = await Promise.all([
      this.prisma.productionJob.count({ where }),
      this.prisma.productionJob.groupBy({
        by: ['status'],
        where,
        _count: { _all: true },
      }),
      this.prisma.productionJobStage.groupBy({
        by: ['stage'],
        where: { productionJob: where },
        _count: { _all: true },
      }),
      this.prisma.productionJob.groupBy({
        by: ['orderItemId'],
        where,
        _count: { _all: true },
      }),
      this.prisma.productionJobStage.count({
        where: {
          productionJob: where,
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          slaDueAt: { lt: new Date() },
        },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const s of byStatus) {
      statusCounts[s.status] = s._count?._all ?? 0;
    }

    const queuedJobs = statusCounts['QUEUED'] ?? 0;
    const activeJobs = statusCounts['IN_PROGRESS'] ?? 0;
    const completedJobs = statusCounts['COMPLETED'] ?? 0;
    const failedJobs = statusCounts['CANCELLED'] ?? 0;
    const overdueJobs = overdueStages;

    const totalEvaluated = completedJobs + activeJobs;
    const slaBreachedJobs = overdueJobs;
    const slaCompliantJobs = Math.max(0, totalEvaluated - slaBreachedJobs);
    const slaComplianceRate =
      totalEvaluated > 0 ? Math.round((slaCompliantJobs / totalEvaluated) * 10000) / 100 : 100;

    return {
      summary: {
        totalJobs,
        totalUniqueOrderItems: uniqueOrderItems.length,
        queuedJobs,
        activeJobs,
        completedJobs,
        failedJobs,
        overdueJobs,
        slaCompliantJobs,
        slaBreachedJobs,
        slaComplianceRate,
      },
      breakdown: {
        byStage: byStage.map((s) => ({ stage: s.stage, count: s._count?._all ?? 0 })),
        byStatus: byStatus.map((s) => ({ status: s.status, count: s._count?._all ?? 0 })),
      },
    };
  }

  // 5. INVENTORY ANALYTICS
  async getInventoryAnalytics(_filter: AnalyticsFilterDto) {
    // Read-only aggregation using database queries
    const [stockAgg, lowStockCount, movements] = await Promise.all([
      this.prisma.inventoryItem.aggregate({
        _sum: { available: true, reserved: true, damaged: true },
      }),
      this.prisma.inventoryItem.count({
        where: {
          available: { lte: 10 },
        },
      }),
      this.prisma.inventoryMovement.groupBy({
        by: ['movementType'],
        _sum: { quantity: true },
        _count: { _all: true },
      }),
    ]);

    const totalAvailable = stockAgg._sum?.available ?? 0;
    const totalReserved = stockAgg._sum?.reserved ?? 0;
    const totalDamaged = stockAgg._sum?.damaged ?? 0;
    const totalStock = totalAvailable + totalReserved;

    let totalStockIn = 0;
    let totalStockOut = 0;
    for (const m of movements) {
      const qty = Math.abs(m._sum?.quantity ?? 0);
      if (['PURCHASE', 'RETURN', 'ADJUSTMENT'].includes(m.movementType)) {
        totalStockIn += qty;
      } else {
        totalStockOut += qty;
      }
    }

    return {
      summary: {
        totalStock,
        totalAvailable,
        totalReserved,
        totalDamaged,
        totalStockIn,
        totalStockOut,
        lowStockItemsCount: lowStockCount,
      },
      movementsBreakdown: movements.map((m) => ({
        type: m.movementType,
        totalQuantity: m._sum?.quantity ?? 0,
        movementCount: m._count?._all ?? 0,
      })),
    };
  }

  // 6. SHIPPING ANALYTICS
  async getShippingAnalytics(filter: AnalyticsFilterDto) {
    const { startDate, endDate } = this.getDateRange(filter);
    const where: Prisma.ShipmentWhereInput = {
      createdAt: { gte: startDate, lt: endDate },
    };
    if (filter.warehouseId) {
      where.warehouseId = filter.warehouseId;
    }

    const [totalShipments, byStatus, byCourier, ndrCount, rtoCount] = await Promise.all([
      this.prisma.shipment.count({ where }),
      this.prisma.shipment.groupBy({
        by: ['status'],
        where,
        _count: { _all: true },
      }),
      this.prisma.shipment.groupBy({
        by: ['courierProvider'],
        where,
        _count: { _all: true },
      }),
      this.prisma.ndrCase.count({
        where: { shipment: where },
      }),
      this.prisma.rtoCase.count({
        where: { shipment: where },
      }),
    ]);

    const statusMap: Record<string, number> = {};
    for (const s of byStatus) {
      if (s.status) statusMap[s.status] = s._count?._all ?? 0;
    }

    const deliveredShipments = statusMap['DELIVERED'] ?? 0;
    const inTransitShipments =
      (statusMap['IN_TRANSIT'] ?? 0) +
      (statusMap['PICKED_UP'] ?? 0) +
      (statusMap['OUT_FOR_DELIVERY'] ?? 0);
    const cancelledShipments = 0;

    const deliverySuccessRate =
      totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 10000) / 100 : 0;
    const ndrRate =
      totalShipments > 0 ? Math.round((ndrCount / totalShipments) * 10000) / 100 : 0;
    const rtoRate =
      totalShipments > 0 ? Math.round((rtoCount / totalShipments) * 10000) / 100 : 0;

    // Critical client requirement: Order.shipping is NOT carrier shipping cost.
    // Carrier cost is not tracked on Shipment, so we explicitly do not fabricate it.
    return {
      summary: {
        totalShipments,
        deliveredShipments,
        inTransitShipments,
        cancelledShipments,
        ndrCount,
        rtoCount,
        deliverySuccessRate,
        ndrRate,
        rtoRate,
        shippingCostTracked: false,
      },
      breakdown: {
        byCourier: byCourier.map((c) => ({
          courier: c.courierProvider ?? 'UNASSIGNED',
          count: c._count?._all ?? 0,
        })),
        byStatus: byStatus.map((s) => ({
          status: s.status,
          count: s._count?._all ?? 0,
        })),
      },
      unavailableMetrics: ['carrierActualShippingCost'],
    };
  }

  // 7. PROFITABILITY ANALYTICS
  async getProfitabilityAnalytics(filter: AnalyticsFilterDto) {
    const { startDate, endDate } = this.getDateRange(filter);
    const ordersWhere: Prisma.OrderWhereInput = {
      createdAt: { gte: startDate, lt: endDate },
      orderStatus: { not: 'CANCELLED' },
    };

    const [orderAgg, refundAgg, orderItems] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { subtotal: true, total: true, discount: true, shipping: true },
        where: ordersWhere,
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { ...ordersWhere, orderStatus: 'REFUNDED' },
      }),
      this.prisma.orderItem.findMany({
        where: { order: ordersWhere },
        select: {
          quantity: true,
          variant: {
            select: {
              product: {
                select: { costPrice: true },
              },
            },
          },
        },
      }),
    ]);

    const grossRevenue = Number(orderAgg._sum?.subtotal ?? orderAgg._sum?.total ?? 0);
    const discounts = Number(orderAgg._sum?.discount ?? 0);
    const refunds = Number(refundAgg._sum?.total ?? 0);
    const netRevenue = grossRevenue - discounts - refunds;

    // Calculate COGS from available Product.costPrice * quantity
    let totalCOGS = new Prisma.Decimal(0);
    for (const item of orderItems) {
      const cost = item.variant?.product?.costPrice ?? new Prisma.Decimal(0);
      totalCOGS = totalCOGS.plus(cost.times(item.quantity));
    }

    const availableProductCost = totalCOGS.toNumber();
    const grossProfit = netRevenue - availableProductCost;
    const profitMargin =
      netRevenue > 0 ? Math.round((grossProfit / netRevenue) * 10000) / 100 : 0;

    return {
      summary: {
        grossRevenue,
        discounts,
        refunds,
        netRevenue,
        costsAvailable: true,
        availableProductCost,
        grossProfit,
        profitMargin,
      },
      unavailableCostComponents: [
        'carrierActualShippingCost',
        'productionLaborAndMachineCost',
        'packagingMaterialCost',
        'storageAndWarehousingCost',
      ],
      profitabilityFormula:
        'grossProfit = netRevenue - availableProductCost; profitMargin = (grossProfit / netRevenue) * 100',
    };
  }
}
