import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ShapesService } from './shapes.service.js';
import { CreateShapeDto } from './dto/create-shape.dto.js';
import { ReviewShapeDto } from './dto/review-shape.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  /** Public: the storefront customizer's shape picker reads from here. */
  @Get()
  findApproved() {
    return this.shapesService.findApproved();
  }
}

@Controller('admin/shapes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  @Get()
  @RequirePermissions('shapes.view')
  findAll(@Query('status') status?: string) {
    return this.shapesService.findAll(status);
  }

  @Get(':id')
  @RequirePermissions('shapes.view')
  findOne(@Param('id') id: string) {
    return this.shapesService.findOne(id);
  }

  @Post()
  @RequirePermissions('shapes.create')
  create(@Body() dto: CreateShapeDto, @CurrentUser() user: AuthenticatedUser) {
    return this.shapesService.create({ name: dto.name, sourceAssetId: dto.sourceAssetId, createdBy: user.id });
  }

  @Post(':id/approve')
  @RequirePermissions('shapes.approve')
  approve(@Param('id') id: string, @Body() dto: ReviewShapeDto, @CurrentUser() user: AuthenticatedUser) {
    return this.shapesService.approve(id, user.id, dto.reason);
  }

  @Post(':id/reject')
  @RequirePermissions('shapes.reject')
  reject(@Param('id') id: string, @Body() dto: ReviewShapeDto, @CurrentUser() user: AuthenticatedUser) {
    return this.shapesService.reject(id, user.id, dto.reason);
  }
}
