import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { DiscountType } from '../../discounts/dto/create-discount.dto.js';

export enum PromotionType {
  AUTOMATIC_DISCOUNT = 'AUTOMATIC_DISCOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  TIERED_DISCOUNT = 'TIERED_DISCOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PromotionType)
  @IsOptional()
  promotionType?: PromotionType;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderSubtotal?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  minQuantity?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxDiscountAmount?: number;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  isStackable?: boolean;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

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

  @IsObject()
  @IsOptional()
  rules?: Record<string, any>;
}
