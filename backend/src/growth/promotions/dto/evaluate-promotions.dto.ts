import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDiscountContextDto } from '../../discounts/dto/validate-discount.dto.js';

export class EvaluatePromotionsDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDiscountContextDto)
  @IsNotEmpty()
  items: CartItemDiscountContextDto[];

  @IsNumber()
  @Min(0)
  subtotal: number;
}
