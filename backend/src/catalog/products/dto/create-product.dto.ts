import { IsDecimal, IsOptional, IsString, IsObject, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsIn(['DRAFT', 'ACTIVE'])
  status?: 'DRAFT' | 'ACTIVE';

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
