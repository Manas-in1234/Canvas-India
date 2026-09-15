import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  machineId?: string;

  @IsArray()
  @IsString({ each: true })
  productionJobIds!: string[];
}
