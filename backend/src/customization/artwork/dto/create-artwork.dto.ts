import { IsString } from 'class-validator';

export class CreateArtworkDto {
  @IsString()
  designVersionId!: string;
}
