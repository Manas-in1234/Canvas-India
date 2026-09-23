import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedMaterials?: string[];

  @IsOptional()
  @IsString()
  warehouseId?: string;
}
