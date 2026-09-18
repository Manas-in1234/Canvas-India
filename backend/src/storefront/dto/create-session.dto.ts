import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStorefrontSessionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
