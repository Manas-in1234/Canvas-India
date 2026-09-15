import { IsOptional, IsISO8601, IsString } from 'class-validator';

/**
 * Common filter DTO for analytics endpoints.
 * Dates are ISO-8601 strings interpreted as UTC.
 * startDate is inclusive, endDate exclusive.
 * If omitted, defaults to last 30 days.
 */
export class AnalyticsFilterDto {
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  // Warehouse filter applied where supported (e.g. Sales, Shipping, Inventory)
  @IsOptional()
  @IsString()
  warehouseId?: string;

  // Product filter for product analytics
  @IsOptional()
  @IsString()
  productId?: string;

  // Customer filter for customer analytics
  @IsOptional()
  @IsString()
  customerId?: string;

  // Status filter where supported
  @IsOptional()
  @IsString()
  status?: string;
}
