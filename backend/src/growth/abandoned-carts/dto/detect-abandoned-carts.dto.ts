import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class DetectAbandonedCartsDto {
  @IsInt()
  @Min(1)
  @Max(720)
  @IsOptional()
  inactivityHours?: number = 1;

  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  limit?: number = 100;
}
