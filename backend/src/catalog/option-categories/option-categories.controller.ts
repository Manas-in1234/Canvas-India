import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OptionCategoriesService } from './option-categories.service.js';
import { CreateOptionCategoryDto } from './dto/create-option-category.dto.js';
import { UpdateOptionCategoryDto } from './dto/update-option-category.dto.js';
import { CreateOptionCategoryItemDto } from './dto/create-option-category-item.dto.js';
import { UpdateOptionCategoryItemDto } from './dto/update-option-category-item.dto.js';
import { ReorderItemsDto } from './dto/reorder-items.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

/** Public: the storefront customize page reads active options from here. */
@Controller('option-categories')
export class OptionCategoriesPublicController {
  constructor(private readonly optionCategoriesService: OptionCategoriesService) {}

  @Get()
  findActiveByBaseKey(@Query('baseKey') baseKey: string, @Query('material') material?: 'ACRYLIC' | 'CANVAS') {
    return this.optionCategoriesService.findActiveByBaseKey(baseKey, material);
  }
}

@Controller('admin/option-categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminOptionCategoriesController {
  constructor(private readonly optionCategoriesService: OptionCategoriesService) {}

  @Get()
  @RequirePermissions('option_catalog.view')
  findAll() {
    return this.optionCategoriesService.findAll();
  }

  // Literal "items/..." routes are declared before the ":id" routes below —
  // Express/NestJS matches in registration order, so ":id" would otherwise
  // greedily capture "items" as an id on PATCH/DELETE.
  @Patch('items/:itemId')
  @RequirePermissions('option_catalog.manage')
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateOptionCategoryItemDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.optionCategoriesService.updateItem(itemId, dto, user.id);
  }

  @Delete('items/:itemId')
  @RequirePermissions('option_catalog.manage')
  removeItem(@Param('itemId') itemId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.optionCategoriesService.removeItem(itemId, user.id);
  }

  @Get(':id')
  @RequirePermissions('option_catalog.view')
  findOne(@Param('id') id: string) {
    return this.optionCategoriesService.findOne(id);
  }

  @Post()
  @RequirePermissions('option_catalog.manage')
  create(@Body() dto: CreateOptionCategoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.optionCategoriesService.create(dto, user.id);
  }

  @Patch(':id')
  @RequirePermissions('option_catalog.manage')
  update(@Param('id') id: string, @Body() dto: UpdateOptionCategoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.optionCategoriesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('option_catalog.manage')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.optionCategoriesService.remove(id, user.id);
  }

  @Post(':id/items')
  @RequirePermissions('option_catalog.manage')
  createItem(
    @Param('id') categoryId: string,
    @Body() dto: CreateOptionCategoryItemDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.optionCategoriesService.createItem(categoryId, dto, user.id);
  }

  @Put(':id/items/reorder')
  @RequirePermissions('option_catalog.manage')
  reorderItems(
    @Param('id') categoryId: string,
    @Body() dto: ReorderItemsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.optionCategoriesService.reorderItems(categoryId, dto.itemIds, user.id);
  }
}
