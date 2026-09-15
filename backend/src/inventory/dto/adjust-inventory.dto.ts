import { IsInt, IsOptional, IsString } from 'class-validator';

export class AdjustInventoryDto {
  @IsString()
  variantId!: string;

  @IsInt()
  quantity!: number; // positive to add, negative to remove

  @IsOptional()
  @IsString()
  reason?: string;
}
