import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReturnRequestDto {
  @IsUUID()
  orderId!: string;

  @IsUUID()
  orderItemId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
