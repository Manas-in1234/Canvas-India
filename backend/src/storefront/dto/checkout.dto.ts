import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';

export class StorefrontAddressDto {
  @IsIn(['BILLING', 'SHIPPING'])
  type!: 'BILLING' | 'SHIPPING';

  @IsString()
  name!: string;

  @IsString()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  postalCode!: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class StorefrontCheckoutDto {
  @ValidateNested({ each: true })
  @Type(() => StorefrontAddressDto)
  addresses!: StorefrontAddressDto[];
}
