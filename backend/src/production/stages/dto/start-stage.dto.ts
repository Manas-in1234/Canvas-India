import { IsOptional, IsString } from 'class-validator';

export class StartStageDto {
  @IsOptional()
  @IsString()
  machineId?: string;
}
