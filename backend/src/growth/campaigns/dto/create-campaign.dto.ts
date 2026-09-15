import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export enum CampaignType {
  SEASONAL = 'SEASONAL',
  PRODUCT_LAUNCH = 'PRODUCT_LAUNCH',
  ABANDONED_CART = 'ABANDONED_CART',
  RETENTION = 'RETENTION',
  SPECIAL_PROMO = 'SPECIAL_PROMO',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CampaignType)
  @IsOptional()
  type?: CampaignType;

  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  @IsOptional()
  endsAt?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  targetSegmentId?: string;
}
