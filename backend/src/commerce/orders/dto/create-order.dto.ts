import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerId!: string;

  @IsString()
  cartId!: string;
}
