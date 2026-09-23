import { IsIn, IsInt, IsString, Min } from 'class-validator';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class RequestUploadUrlDto {
  @IsString()
  fileName!: string;

  @IsIn(ALLOWED_MIME_TYPES)
  mimeType!: string;

  @IsInt()
  @Min(1)
  fileSize!: number;

  @IsString()
  ownerType!: string; // e.g. "Customer"

  @IsString()
  ownerId!: string;
}
