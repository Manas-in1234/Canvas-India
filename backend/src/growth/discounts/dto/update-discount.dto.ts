import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { DiscountType } from './create-discount.dto.js';

export class UpdateDiscountDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  value?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxDiscountAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderSubtotal?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  usageLimit?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  perCustomerLimit?: number;

  @IsDateString()
  @IsOptional()
  startsAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isExclusive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableCategoryIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableProductIds?: string[];

  @IsString()
  @IsOptional()
  customerSegmentId?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}
