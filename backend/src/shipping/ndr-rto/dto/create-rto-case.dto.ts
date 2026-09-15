import { IsUUID } from 'class-validator';

export class CreateRtoCaseDto {
  @IsUUID()
  shipmentId!: string;

  @IsUUID()
  warehouseId!: string;
}
