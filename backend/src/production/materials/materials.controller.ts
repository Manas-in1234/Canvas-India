import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service.js';
import { CreateMaterialDto } from './dto/create-material.dto.js';
import { AdjustMaterialDto } from './dto/adjust-material.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

@Controller('production/materials')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  @RequirePermissions('materials.view')
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @RequirePermissions('materials.view')
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Post()
  @RequirePermissions('materials.adjust')
  create(@Body() dto: CreateMaterialDto) {
    return this.materialsService.create(dto.name, dto.unit, dto.reorderLevel);
  }

  @Post('adjust')
  @RequirePermissions('materials.adjust')
  adjust(@Body() dto: AdjustMaterialDto, @CurrentUser() user: AuthenticatedUser) {
    return this.materialsService.adjust(dto.rawMaterialId, dto.quantity, user.id);
  }
}
