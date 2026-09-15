import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VariantsService } from './variants.service.js';
import { CreateVariantDto } from './dto/create-variant.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('products/:productId/variants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  @RequirePermissions('products.view')
  findByProduct(@Param('productId') productId: string) {
    return this.variantsService.findByProduct(productId);
  }

  @Post()
  @RequirePermissions('products.edit')
  create(@Param('productId') productId: string, @Body() dto: CreateVariantDto) {
    return this.variantsService.create(productId, dto.sku, dto.price, dto.optionValueIds);
  }
}
