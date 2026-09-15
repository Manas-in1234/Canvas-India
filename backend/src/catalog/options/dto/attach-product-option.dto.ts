import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class AttachProductOptionDto {
  @IsString()
  optionGroupId!: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
