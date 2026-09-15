import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReplacementRequestDto {
  @IsUUID()
  orderId!: string;

  @IsUUID()
  orderItemId!: string;

  @IsString()
  @IsNotEmpty()
  complaintReason!: string;
}
