import { IsDecimal } from 'class-validator';

export class UpdatePricingSettingDto {
  @IsDecimal()
  value!: string;
}
