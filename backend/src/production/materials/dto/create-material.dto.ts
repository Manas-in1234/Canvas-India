import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  name!: string;

  @IsString()
  unit!: string;

  @IsOptional()
  @IsNumberString()
  reorderLevel?: string;
}
