import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerSegmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  criteria?: {
    minSpend?: number;
    maxSpend?: number;
    minOrders?: number;
    maxOrders?: number;
    isGuest?: boolean;
    daysSinceLastOrder?: number;
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
