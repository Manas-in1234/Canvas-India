import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: Partial<PrismaService>;

  const mockOrderAggregate = vi.fn();
  const mockOrderCount = vi.fn();
  const mockOrderGroupBy = vi.fn();
  const mockOrderItemAggregate = vi.fn();
  const mockOrderItemGroupBy = vi.fn();
  const mockOrderItemFindMany = vi.fn();
  const mockProductVariantFindMany = vi.fn();
  const mockCustomerCount = vi.fn();
  const mockCustomerFindMany = vi.fn();
  const mockCustomerSegmentFindMany = vi.fn();
  const mockProductionJobCount = vi.fn();
  const mockProductionJobGroupBy = vi.fn();
  const mockProductionJobStageGroupBy = vi.fn();
  const mockProductionJobStageCount = vi.fn();
  const mockInventoryItemAggregate = vi.fn();
  const mockInventoryItemCount = vi.fn();
  const mockInventoryMovementGroupBy = vi.fn();
  const mockShipmentCount = vi.fn();
  const mockShipmentGroupBy = vi.fn();
  const mockNdrCaseCount = vi.fn();
  const mockRtoCaseCount = vi.fn();

  beforeEach(async () => {
    prisma = {
      order: {
        aggregate: mockOrderAggregate,
        count: mockOrderCount,
        groupBy: mockOrderGroupBy,
      },
      orderItem: {
        aggregate: mockOrderItemAggregate,
        groupBy: mockOrderItemGroupBy,
        findMany: mockOrderItemFindMany,
      },
      productVariant: {
        findMany: mockProductVariantFindMany,
      },
      customer: {
        count: mockCustomerCount,
        findMany: mockCustomerFindMany,
      },
      customerSegment: {
        findMany: mockCustomerSegmentFindMany,
      },
      productionJob: {
        count: mockProductionJobCount,
        groupBy: mockProductionJobGroupBy,
      },
      productionJobStage: {
        groupBy: mockProductionJobStageGroupBy,
        count: mockProductionJobStageCount,
      },
      inventoryItem: {
        aggregate: mockInventoryItemAggregate,
        count: mockInventoryItemCount,
      },
      inventoryMovement: {
        groupBy: mockInventoryMovementGroupBy,
      },
      shipment: {
        count: mockShipmentCount,
        groupBy: mockShipmentGroupBy,
      },
      ndrCase: {
        count: mockNdrCaseCount,
      },
      rtoCase: {
        count: mockRtoCaseCount,
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 0. DATE FILTER & VALIDATION
  describe('getDateRange', () => {
    it('defaults to last 30 days in UTC when no dates are provided', () => {
      const { startDate, endDate } = service.getDateRange({});
      expect(startDate).toBeInstanceOf(Date);
      expect(endDate).toBeInstanceOf(Date);
      const diffDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(30);
    });

    it('parses valid ISO-8601 start and end dates', () => {
      const { startDate, endDate } = service.getDateRange({
        startDate: '2026-09-01T00:00:00.000Z',
        endDate: '2026-09-30T00:00:00.000Z',
      });
      expect(startDate.toISOString()).toBe('2026-09-01T00:00:00.000Z');
      expect(endDate.toISOString()).toBe('2026-09-30T00:00:00.000Z');
    });

    it('throws BadRequestException if startDate >= endDate', () => {
      expect(() =>
        service.getDateRange({
          startDate: '2026-10-01T00:00:00.000Z',
          endDate: '2026-09-01T00:00:00.000Z',
        }),
      ).toThrow(BadRequestException);
    });

    it('throws BadRequestException if date is invalid', () => {
      expect(() =>
        service.getDateRange({
          startDate: 'not-a-valid-date',
        }),
      ).toThrow(BadRequestException);
    });
  });

  // 1. SALES ANALYTICS
  describe('getSalesAnalytics', () => {
    it('aggregates sales, units, gross, discounts, refunds, net sales, and AOV', async () => {
      mockOrderAggregate
        .mockResolvedValueOnce({
          _sum: {
            subtotal: new Prisma.Decimal(1200),
            total: new Prisma.Decimal(1150),
            discount: new Prisma.Decimal(100),
            tax: new Prisma.Decimal(60),
            shipping: new Prisma.Decimal(40),
          },
        }) // orderAgg
        .mockResolvedValueOnce({
          _sum: { total: new Prisma.Decimal(50) },
        }); // refundAgg

      mockOrderItemAggregate.mockResolvedValueOnce({
        _sum: { quantity: 15 },
      });

      mockOrderCount.mockResolvedValueOnce(10);

      mockOrderGroupBy.mockResolvedValueOnce([
        { orderStatus: 'COMPLETED', _count: { _all: 8 }, _sum: { total: new Prisma.Decimal(900) } },
        { orderStatus: 'PROCESSING', _count: { _all: 2 }, _sum: { total: new Prisma.Decimal(250) } },
      ]);

      const result = await service.getSalesAnalytics({
        startDate: '2026-09-01T00:00:00.000Z',
        endDate: '2026-09-30T00:00:00.000Z',
        warehouseId: 'wh-1',
      });

      expect(result.summary).toEqual({
        totalOrders: 10,
        totalUnits: 15,
        grossSales: 1200,
        totalDiscounts: 100,
        totalRefunds: 50,
        netSales: 1050, // 1200 - 100 - 50
        averageOrderValue: 105, // 1050 / 10
        totalTax: 60,
        totalShippingRevenue: 40,
      });

      expect(result.breakdown.byStatus).toHaveLength(2);
      expect(result.breakdown.byStatus[0].status).toBe('COMPLETED');
    });

    it('handles empty sales dataset safely', async () => {
      mockOrderAggregate
        .mockResolvedValueOnce({ _sum: { subtotal: null, total: null, discount: null, tax: null, shipping: null } })
        .mockResolvedValueOnce({ _sum: { total: null } });
      mockOrderItemAggregate.mockResolvedValueOnce({ _sum: { quantity: null } });
      mockOrderCount.mockResolvedValueOnce(0);
      mockOrderGroupBy.mockResolvedValueOnce([]);

      const result = await service.getSalesAnalytics({});
      expect(result.summary.totalOrders).toBe(0);
      expect(result.summary.grossSales).toBe(0);
      expect(result.summary.netSales).toBe(0);
      expect(result.summary.averageOrderValue).toBe(0);
      expect(result.breakdown.byStatus).toEqual([]);
    });
  });

  // 2. PRODUCT ANALYTICS
  describe('getProductAnalytics', () => {
    it('aggregates products by units sold and revenue without N+1 queries', async () => {
      mockOrderItemGroupBy.mockResolvedValueOnce([
        { variantId: 'v1', _sum: { quantity: 10, priceSnapshot: new Prisma.Decimal(500) }, _count: { orderId: 4 } },
        { variantId: 'v2', _sum: { quantity: 5, priceSnapshot: new Prisma.Decimal(300) }, _count: { orderId: 2 } },
      ]);

      mockProductVariantFindMany.mockResolvedValueOnce([
        { id: 'v1', productId: 'p1', product: { name: 'Canvas 10x12' } },
        { id: 'v2', productId: 'p1', product: { name: 'Canvas 10x12' } },
      ]);

      const result = await service.getProductAnalytics({
        productId: 'p1',
      });

      expect(mockProductVariantFindMany).toHaveBeenCalledTimes(1);
      expect(result.summary).toEqual({
        totalProductsWithSales: 1,
        totalUnitsSold: 15,
        totalRevenue: 800,
      });
      expect(result.products).toHaveLength(1);
      expect(result.products[0]).toEqual({
        productId: 'p1',
        productName: 'Canvas 10x12',
        unitsSold: 15,
        revenue: 800,
        orderCount: 6,
      });
    });

    it('handles empty product dataset safely', async () => {
      mockOrderItemGroupBy.mockResolvedValueOnce([]);
      const result = await service.getProductAnalytics({});
      expect(result.summary).toEqual({
        totalProductsWithSales: 0,
        totalUnitsSold: 0,
        totalRevenue: 0,
      });
      expect(result.products).toEqual([]);
    });
  });

  // 3. CUSTOMER ANALYTICS
  describe('getCustomerAnalytics', () => {
    it('calculates customer metrics, returning customers, and segment counts', async () => {
      mockCustomerCount
        .mockResolvedValueOnce(100) // totalCustomers
        .mockResolvedValueOnce(20); // newCustomers

      mockOrderGroupBy.mockResolvedValueOnce([
        { customerId: 'c1', _sum: { total: new Prisma.Decimal(600) }, _count: { _all: 3 } }, // returning
        { customerId: 'c2', _sum: { total: new Prisma.Decimal(200) }, _count: { _all: 1 } }, // active
      ]);

      mockCustomerSegmentFindMany.mockResolvedValueOnce([
        { id: 'seg-1', name: 'VIP Buyers', _count: { members: 15 } },
      ]);

      mockCustomerFindMany.mockResolvedValueOnce([
        { id: 'c1', name: 'Alice', email: 'alice@example.com' },
        { id: 'c2', name: 'Bob', email: 'bob@example.com' },
      ]);

      const result = await service.getCustomerAnalytics({});
      expect(result.summary).toEqual({
        totalCustomers: 100,
        newCustomers: 20,
        returningCustomers: 1,
        activeCustomers: 2,
        totalCustomerRevenue: 800,
        averageCustomerOrderValue: 200, // 800 / 4 orders
      });
      expect(result.topCustomers).toHaveLength(2);
      expect(result.topCustomers[0].name).toBe('Alice');
      expect(result.segmentBreakdown).toEqual([
        { segmentId: 'seg-1', name: 'VIP Buyers', memberCount: 15 },
      ]);
    });

    it('handles empty customer analytics', async () => {
      mockCustomerCount.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
      mockOrderGroupBy.mockResolvedValueOnce([]);
      mockCustomerSegmentFindMany.mockResolvedValueOnce([]);

      const result = await service.getCustomerAnalytics({});
      expect(result.summary).toEqual({
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        activeCustomers: 0,
        totalCustomerRevenue: 0,
        averageCustomerOrderValue: 0,
      });
      expect(result.topCustomers).toEqual([]);
      expect(result.segmentBreakdown).toEqual([]);
    });
  });

  // 4. PRODUCTION ANALYTICS
  describe('getProductionAnalytics', () => {
    it('aggregates jobs, stages, SLA, and accounts for multiple jobs per OrderItem', async () => {
      mockProductionJobCount.mockResolvedValueOnce(12); // totalJobs

      mockProductionJobGroupBy
        .mockResolvedValueOnce([
          { status: 'COMPLETED', _count: { _all: 8 } },
          { status: 'IN_PROGRESS', _count: { _all: 3 } },
          { status: 'QUEUED', _count: { _all: 1 } },
        ]) // byStatus
        .mockResolvedValueOnce([
          { orderItemId: 'item-1', _count: { _all: 2 } }, // 2 jobs for 1 item (reprint)
          { orderItemId: 'item-2', _count: { _all: 1 } },
        ]); // unique order items

      mockProductionJobStageGroupBy.mockResolvedValueOnce([
        { stage: 'PRINTING', _count: { _all: 5 } },
        { stage: 'QC', _count: { _all: 7 } },
      ]);

      mockProductionJobStageCount.mockResolvedValueOnce(1); // 1 overdue stage

      const result = await service.getProductionAnalytics({});

      expect(result.summary.totalJobs).toBe(12);
      expect(result.summary.totalUniqueOrderItems).toBe(2); // verified multiple jobs per item handled
      expect(result.summary.queuedJobs).toBe(1);
      expect(result.summary.activeJobs).toBe(3);
      expect(result.summary.completedJobs).toBe(8);
      expect(result.summary.overdueJobs).toBe(1);
      expect(result.summary.slaBreachedJobs).toBe(1);
      expect(result.summary.slaCompliantJobs).toBe(10); // (8 + 3) - 1
      expect(result.summary.slaComplianceRate).toBe(90.91);
      expect(result.breakdown.byStage).toHaveLength(2);
    });

    it('handles empty production data safely', async () => {
      mockProductionJobCount.mockResolvedValueOnce(0);
      mockProductionJobGroupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockProductionJobStageGroupBy.mockResolvedValueOnce([]);
      mockProductionJobStageCount.mockResolvedValueOnce(0);

      const result = await service.getProductionAnalytics({});
      expect(result.summary.totalJobs).toBe(0);
      expect(result.summary.slaComplianceRate).toBe(100);
      expect(result.breakdown.byStage).toEqual([]);
    });
  });

  // 5. INVENTORY ANALYTICS
  describe('getInventoryAnalytics', () => {
    it('aggregates stock balances and movement ledger in read-only mode', async () => {
      mockInventoryItemAggregate.mockResolvedValueOnce({
        _sum: { available: 50, reserved: 20, damaged: 5 },
      });

      mockInventoryItemCount.mockResolvedValueOnce(2); // lowStock

      mockInventoryMovementGroupBy.mockResolvedValueOnce([
        { movementType: 'PURCHASE', _sum: { quantity: 100 }, _count: { _all: 5 } },
        { movementType: 'CONSUMPTION', _sum: { quantity: -40 }, _count: { _all: 8 } },
      ]);

      const result = await service.getInventoryAnalytics({});

      expect(result.summary).toEqual({
        totalStock: 70, // 50 + 20
        totalAvailable: 50,
        totalReserved: 20,
        totalDamaged: 5,
        totalStockIn: 100,
        totalStockOut: 40,
        lowStockItemsCount: 2,
      });

      expect(result.movementsBreakdown).toHaveLength(2);
    });

    it('handles empty inventory balances safely', async () => {
      mockInventoryItemAggregate.mockResolvedValueOnce({
        _sum: { available: null, reserved: null, damaged: null },
      });
      mockInventoryItemCount.mockResolvedValueOnce(0);
      mockInventoryMovementGroupBy.mockResolvedValueOnce([]);

      const result = await service.getInventoryAnalytics({});
      expect(result.summary.totalStock).toBe(0);
      expect(result.summary.totalStockIn).toBe(0);
      expect(result.summary.totalStockOut).toBe(0);
    });
  });

  // 6. SHIPPING ANALYTICS
  describe('getShippingAnalytics', () => {
    it('aggregates delivery rate, NDR, RTO, and does NOT treat Order.shipping as cost', async () => {
      mockShipmentCount.mockResolvedValueOnce(20); // totalShipments

      mockShipmentGroupBy
        .mockResolvedValueOnce([
          { status: 'DELIVERED', _count: { _all: 16 } },
          { status: 'IN_TRANSIT', _count: { _all: 2 } },
          { status: 'NDR', _count: { _all: 1 } },
          { status: 'RTO', _count: { _all: 1 } },
        ]) // byStatus
        .mockResolvedValueOnce([
          { courierProvider: 'BLUEDART', _count: { _all: 12 } },
          { courierProvider: 'DELHIVERY', _count: { _all: 8 } },
        ]); // byCourier

      mockNdrCaseCount.mockResolvedValueOnce(2);
      mockRtoCaseCount.mockResolvedValueOnce(1);

      const result = await service.getShippingAnalytics({ warehouseId: 'wh-1' });

      expect(result.summary).toEqual({
        totalShipments: 20,
        deliveredShipments: 16,
        inTransitShipments: 2,
        cancelledShipments: 0,
        ndrCount: 2,
        rtoCount: 1,
        deliverySuccessRate: 80, // 16 / 20 * 100
        ndrRate: 10, // 2 / 20 * 100
        rtoRate: 5, // 1 / 20 * 100
        shippingCostTracked: false, // Explicitly false per spec
      });

      expect(result.breakdown.byCourier).toHaveLength(2);
      expect(result.unavailableMetrics).toContain('carrierActualShippingCost');
    });

    it('handles empty shipping datasets safely', async () => {
      mockShipmentCount.mockResolvedValueOnce(0);
      mockShipmentGroupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockNdrCaseCount.mockResolvedValueOnce(0);
      mockRtoCaseCount.mockResolvedValueOnce(0);

      const result = await service.getShippingAnalytics({});
      expect(result.summary.totalShipments).toBe(0);
      expect(result.summary.deliverySuccessRate).toBe(0);
      expect(result.summary.ndrRate).toBe(0);
    });
  });

  // 7. PROFITABILITY ANALYTICS
  describe('getProfitabilityAnalytics', () => {
    it('calculates gross/net revenue, product cost via costPrice * quantity, and profit margin', async () => {
      mockOrderAggregate
        .mockResolvedValueOnce({
          _sum: {
            subtotal: new Prisma.Decimal(1000),
            total: new Prisma.Decimal(950),
            discount: new Prisma.Decimal(50),
            shipping: new Prisma.Decimal(30),
          },
        }) // orderAgg
        .mockResolvedValueOnce({
          _sum: { total: new Prisma.Decimal(50) },
        }); // refundAgg

      mockOrderItemFindMany.mockResolvedValueOnce([
        {
          quantity: 2,
          variant: { product: { costPrice: new Prisma.Decimal(100) } },
        },
        {
          quantity: 3,
          variant: { product: { costPrice: new Prisma.Decimal(50) } },
        },
      ]); // 2 * 100 + 3 * 50 = 350 COGS

      const result = await service.getProfitabilityAnalytics({});

      // Net revenue = 1000 - 50 - 50 = 900
      // Available product cost = 350
      // Gross profit = 900 - 350 = 550
      // Profit margin = (550 / 900) * 100 = 61.11%
      expect(result.summary).toEqual({
        grossRevenue: 1000,
        discounts: 50,
        refunds: 50,
        netRevenue: 900,
        costsAvailable: true,
        availableProductCost: 350,
        grossProfit: 550,
        profitMargin: 61.11,
      });

      expect(result.unavailableCostComponents).toContain('carrierActualShippingCost');
      expect(result.unavailableCostComponents).toContain('productionLaborAndMachineCost');
    });

    it('handles zero revenue safely without division by zero', async () => {
      mockOrderAggregate
        .mockResolvedValueOnce({
          _sum: { subtotal: null, total: null, discount: null, shipping: null },
        })
        .mockResolvedValueOnce({ _sum: { total: null } });

      mockOrderItemFindMany.mockResolvedValueOnce([]);

      const result = await service.getProfitabilityAnalytics({});
      expect(result.summary.grossRevenue).toBe(0);
      expect(result.summary.netRevenue).toBe(0);
      expect(result.summary.availableProductCost).toBe(0);
      expect(result.summary.grossProfit).toBe(0);
      expect(result.summary.profitMargin).toBe(0);
    });
  });
});
