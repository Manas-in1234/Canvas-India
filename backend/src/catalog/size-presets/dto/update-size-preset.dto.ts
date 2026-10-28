import { PartialType } from '@nestjs/mapped-types';
import { CreateSizePresetDto } from './create-size-preset.dto.js';

export class UpdateSizePresetDto extends PartialType(CreateSizePresetDto) {}
