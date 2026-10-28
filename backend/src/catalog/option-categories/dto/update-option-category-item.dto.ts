import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionCategoryItemDto } from './create-option-category-item.dto.js';

export class UpdateOptionCategoryItemDto extends PartialType(CreateOptionCategoryItemDto) {}
