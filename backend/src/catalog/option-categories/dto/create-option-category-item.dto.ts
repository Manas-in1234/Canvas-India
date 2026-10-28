import { IsBoolean, IsDecimal, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum OptionPriceMode {
  FLAT = 'FLAT',
  AREA_RATE = 'AREA_RATE',
}

export class CreateOptionCategoryItemDto {
  @IsString()
  label!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(OptionPriceMode)
  priceMode?: OptionPriceMode;

  @IsOptional()
  @IsDecimal()
  flatPrice?: string;

  @IsOptional()
  @IsDecimal()
  areaRatePerSqIn?: string;

  @IsOptional()
  @IsObject()
  extras?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
