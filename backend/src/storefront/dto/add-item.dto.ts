import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class StorefrontAddItemDto {
  @IsString()
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  designVersionId?: string;
}
