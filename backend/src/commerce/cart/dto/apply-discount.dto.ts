import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyDiscountDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
