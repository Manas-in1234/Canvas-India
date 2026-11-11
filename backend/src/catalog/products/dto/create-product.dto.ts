import { IsDecimal, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsObject()
  storefront?: Record<string, any>;

  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  productTypeId!: string;

  @IsDecimal()
  basePrice!: string;

  @IsOptional()
  @IsDecimal()
  costPrice?: string;
}
