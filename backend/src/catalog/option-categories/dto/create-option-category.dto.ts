import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MaterialScope {
  ACRYLIC = 'ACRYLIC',
  CANVAS = 'CANVAS',
  BOTH = 'BOTH',
}

export class CreateOptionCategoryDto {
  @IsString()
  baseKey!: string;

  @IsEnum(MaterialScope)
  materialScope!: MaterialScope;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
