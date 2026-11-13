import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddStockDto {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
