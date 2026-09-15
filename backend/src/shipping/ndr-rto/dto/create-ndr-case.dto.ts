import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateNdrCaseDto {
  @IsUUID()
  shipmentId!: string;

  @IsString()
  reason!: string;

  @IsInt()
  @Min(1)
  attemptNumber!: number;
}
