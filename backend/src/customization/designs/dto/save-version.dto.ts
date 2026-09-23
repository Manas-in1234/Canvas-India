import { IsInt, IsNumberString, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class SaveVersionDto {
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

  @IsOptional()
  @IsString()
  previewAssetId?: string;
}
