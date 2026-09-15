import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OptionsService } from './options.service.js';
import { CreateOptionGroupDto } from './dto/create-option-group.dto.js';
import { CreateOptionValueDto } from './dto/create-option-value.dto.js';
import { AttachProductOptionDto } from './dto/attach-product-option.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get('option-groups')
  @RequirePermissions('products.view')
  findAllGroups() {
    return this.optionsService.findAllGroups();
  }

  @Post('option-groups')
  @RequirePermissions('products.edit')
  createGroup(@Body() dto: CreateOptionGroupDto) {
    return this.optionsService.createGroup(dto.name);
  }

  @Post('option-groups/:groupId/values')
  @RequirePermissions('products.edit')
  addValue(@Param('groupId') groupId: string, @Body() dto: CreateOptionValueDto) {
    return this.optionsService.addValue(groupId, dto.value, dto.priceAdjustment, dto.sortOrder);
  }

  @Post('products/:productId/options')
  @RequirePermissions('products.edit')
  attachToProduct(@Param('productId') productId: string, @Body() dto: AttachProductOptionDto) {
    return this.optionsService.attachToProduct(productId, dto.optionGroupId, dto.isRequired, dto.sortOrder);
  }
}
