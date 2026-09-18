import { IsString } from 'class-validator';

export class StorefrontApplyDiscountDto {
  @IsString()
  code!: string;
}
