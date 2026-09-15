import { IsDecimal, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
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
