import { IsArray, IsInt, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipmentItemDto {
  @IsUUID()
  orderItemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateShipmentDto {
  @IsUUID()
  orderId!: string;

  @IsUUID()
  warehouseId!: string;

  @IsString()
  courierProvider!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShipmentItemDto)
  items!: CreateShipmentItemDto[];
}
