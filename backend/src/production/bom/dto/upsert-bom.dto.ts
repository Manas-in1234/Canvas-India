import { IsArray, IsNumberString, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BomItemInput {
  @IsString()
  rawMaterialId!: string;

  @IsNumberString()
  quantityRequired!: string;
}

export class UpsertBomDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BomItemInput)
  items!: BomItemInput[];
}
