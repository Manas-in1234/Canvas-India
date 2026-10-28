import { IsOptional, IsString } from 'class-validator';

export class ReviewShapeDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
