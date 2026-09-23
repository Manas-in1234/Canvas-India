import { IsInt, IsString, Min } from 'class-validator';

export class ReserveInventoryDto {
  @IsString()
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsString()
  referenceType!: string; // e.g. "Order"

  @IsString()
  referenceId!: string;
}
