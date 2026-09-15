import { IsNumberString, IsString } from 'class-validator';

export class AdjustMaterialDto {
  @IsString()
  rawMaterialId!: string;

  @IsNumberString()
  quantity!: string; // positive to add, negative to remove
}
