import { IsOptional, IsString } from 'class-validator';

export class ReviewArtworkDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
