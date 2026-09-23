import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsFilterDto } from './dto/analytics-filter.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../common/guards/permissions.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  @RequirePermissions('analytics.view')
  async getSales(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getSalesAnalytics(filter);
  }

  @Get('products')
  @RequirePermissions('analytics.view')
  async getProducts(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getProductAnalytics(filter);
  }

  @Get('customers')
  @RequirePermissions('analytics.view')
  async getCustomers(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getCustomerAnalytics(filter);
  }

  @Get('production')
  @RequirePermissions('analytics.view')
  async getProduction(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getProductionAnalytics(filter);
  }

  @Get('inventory')
  @RequirePermissions('analytics.view')
  async getInventory(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getInventoryAnalytics(filter);
  }

  @Get('shipping')
  @RequirePermissions('analytics.view')
  async getShipping(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getShippingAnalytics(filter);
  }

  @Get('profitability')
  @RequirePermissions('analytics.view')
  async getProfitability(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getProfitabilityAnalytics(filter);
  }
}
