import { IsString } from 'class-validator';

export class ChangeNdrAddressDto {
  @IsString()
  address!: string;
}
