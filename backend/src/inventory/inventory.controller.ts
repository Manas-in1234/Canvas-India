import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto.js';
import { ReserveInventoryDto } from './dto/reserve-inventory.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../common/guards/permissions.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';

@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @RequirePermissions('inventory.view')
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':sku')
  @RequirePermissions('inventory.view')
  findBySku(@Param('sku') sku: string) {
    return this.inventoryService.findBySku(sku);
  }

  @Post('adjust')
  @RequirePermissions('inventory.adjust')
  adjust(@Body() dto: AdjustInventoryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.adjust(dto.variantId, dto.quantity, user.id, dto.reason);
  }

  @Post('reserve')
  @RequirePermissions('inventory.adjust')
  reserve(@Body() dto: ReserveInventoryDto) {
    return this.inventoryService.reserve(dto.variantId, dto.quantity, dto.referenceType, dto.referenceId);
  }

  @Post('release')
  @RequirePermissions('inventory.adjust')
  release(@Body() dto: ReserveInventoryDto) {
    return this.inventoryService.release(dto.variantId, dto.quantity, dto.referenceType, dto.referenceId);
  }
}
