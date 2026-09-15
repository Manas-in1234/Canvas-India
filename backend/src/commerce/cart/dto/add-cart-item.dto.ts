import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  configuration?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  designVersionId?: string;
}
