import { IsArray, IsDecimal, IsString } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  sku!: string;

  @IsDecimal()
  price!: string;

  @IsArray()
  @IsString({ each: true })
  optionValueIds!: string[];
}
