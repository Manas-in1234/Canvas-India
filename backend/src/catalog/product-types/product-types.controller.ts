import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductTypesService } from './product-types.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('product-types')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Get()
  @RequirePermissions('products.view')
  findAll() {
    return this.productTypesService.findAll();
  }
}
