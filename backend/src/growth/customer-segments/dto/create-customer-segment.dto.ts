import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SegmentType {
  MANUAL = 'MANUAL',
  DYNAMIC = 'DYNAMIC',
}

export class CreateCustomerSegmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SegmentType)
  @IsOptional()
  type?: SegmentType;

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
