import { IsString, IsNotEmpty } from 'class-validator';

export class CreateShapeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  sourceAssetId!: string;
}
