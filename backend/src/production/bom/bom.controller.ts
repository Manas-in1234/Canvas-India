import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { BomService } from './bom.service.js';
import { UpsertBomDto } from './dto/upsert-bom.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('products/:productId/bom')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Get()
  @RequirePermissions('bom.view')
  findByProduct(@Param('productId') productId: string) {
    return this.bomService.findByProduct(productId);
  }

  @Put()
  @RequirePermissions('bom.manage')
  upsert(@Param('productId') productId: string, @Body() dto: UpsertBomDto) {
    return this.bomService.upsert(productId, dto.items);
  }
}
