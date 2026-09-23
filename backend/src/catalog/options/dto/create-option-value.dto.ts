import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOptionValueDto {
  @IsString()
  value!: string;

  @IsOptional()
  @IsDecimal()
  priceAdjustment?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
