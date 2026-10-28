import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionCategoryDto } from './create-option-category.dto.js';

export class UpdateOptionCategoryDto extends PartialType(CreateOptionCategoryDto) {}
