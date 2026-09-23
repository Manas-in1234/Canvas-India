import { IsDecimal, IsOptional, IsString } from 'class-validator';

export class RefundOrderDto {
  @IsDecimal()
  amount!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
