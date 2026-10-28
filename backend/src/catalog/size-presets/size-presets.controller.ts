import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SizePresetsService } from './size-presets.service.js';
import { CreateSizePresetDto } from './dto/create-size-preset.dto.js';
import { UpdateSizePresetDto } from './dto/update-size-preset.dto.js';
import { ReorderItemsDto } from '../option-categories/dto/reorder-items.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

/** Public: the storefront customize page reads active size presets from here. */
@Controller('size-presets')
export class SizePresetsPublicController {
  constructor(private readonly sizePresetsService: SizePresetsService) {}

  @Get()
  findActiveForProduct(@Query('productTypeId') productTypeId: string, @Query('shapeId') shapeId?: string) {
    return this.sizePresetsService.findActiveForProduct(productTypeId, shapeId);
  }
}

@Controller('admin/size-presets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminSizePresetsController {
  constructor(private readonly sizePresetsService: SizePresetsService) {}

  @Put('reorder')
  @RequirePermissions('size_presets.manage')
  reorder(@Body() dto: ReorderItemsDto & { productTypeId: string }, @CurrentUser() user: AuthenticatedUser) {
    return this.sizePresetsService.reorder(dto.productTypeId, dto.itemIds, user.id);
  }

  @Get()
  @RequirePermissions('size_presets.view')
  findAll(@Query('productTypeId') productTypeId?: string) {
    return this.sizePresetsService.findAll(productTypeId);
  }

  @Get(':id')
  @RequirePermissions('size_presets.view')
  findOne(@Param('id') id: string) {
    return this.sizePresetsService.findOne(id);
  }

  @Post()
  @RequirePermissions('size_presets.manage')
  create(@Body() dto: CreateSizePresetDto, @CurrentUser() user: AuthenticatedUser) {
    return this.sizePresetsService.create(dto, user.id);
  }

  @Patch(':id')
  @RequirePermissions('size_presets.manage')
  update(@Param('id') id: string, @Body() dto: UpdateSizePresetDto, @CurrentUser() user: AuthenticatedUser) {
    return this.sizePresetsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('size_presets.manage')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.sizePresetsService.remove(id, user.id);
  }
}
