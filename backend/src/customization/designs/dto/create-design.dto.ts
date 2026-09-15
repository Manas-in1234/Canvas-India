import { IsInt, IsNumberString, IsObject, IsString, Min } from 'class-validator';

export class CreateDesignDto {
  @IsString()
  customerId!: string;

  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  canvasWidth!: number;

  @IsInt()
  @Min(1)
  canvasHeight!: number;

  @IsNumberString()
  targetWidthInches!: string;

  @IsNumberString()
  targetHeightInches!: string;

  @IsObject()
  designJson!: Record<string, unknown>;
}
