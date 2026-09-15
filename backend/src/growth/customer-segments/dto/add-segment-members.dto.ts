import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AddSegmentMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  customerIds: string[];
}
