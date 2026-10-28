import { IsArray, IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSizePresetDto {
  @IsString()
  productTypeId!: string;

  @IsOptional()
  @IsString()
  shapeId?: string;

  @IsString()
  label!: string;

  @IsString()
  dimensionsSummary!: string;

  @IsDecimal()
  widthInches!: string;

  @IsDecimal()
  heightInches!: string;

  @IsDecimal()
  acrylicPrice!: string;

  @IsDecimal()
  canvasPrice!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  panelsCount?: number;

  @IsOptional()
  @IsArray()
  panels?: Record<string, unknown>[];

  @IsOptional()
  @IsString()
  arrangement?: string;
}
