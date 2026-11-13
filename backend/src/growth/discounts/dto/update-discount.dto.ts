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
  code?: string;

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
  maxDiscountAmount?: number | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderSubtotal?: number | null;

  @IsNumber()
  @Min(1)
  @IsOptional()
  usageLimit?: number | null;

  @IsNumber()
  @Min(1)
  @IsOptional()
  perCustomerLimit?: number | null;

  @IsDateString()
  @IsOptional()
  startsAt?: string | null;

  @IsDateString()
  @IsOptional()
  expiresAt?: string | null;

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
  customerSegmentId?: string | null;

  @IsString()
  @IsOptional()
  campaignId?: string | null;
}
