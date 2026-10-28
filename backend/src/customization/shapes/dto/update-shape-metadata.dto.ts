import { IsDecimal, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ShapePriceMode {
  FLAT = 'FLAT',
  AREA_RATE = 'AREA_RATE',
}

export enum ShapeActiveStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateShapeMetadataDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ShapePriceMode)
  priceMode?: ShapePriceMode;

  @IsOptional()
  @IsDecimal()
  flatPrice?: string;

  @IsOptional()
  @IsDecimal()
  areaRatePerSqIn?: string;

  @IsOptional()
  @IsEnum(ShapeActiveStatus)
  status?: ShapeActiveStatus;
}
