import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { PricingSettingsService } from './pricing-settings.service.js';
import { UpdatePricingSettingDto } from './dto/update-pricing-setting.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

/** Public: the storefront reads live pricing settings (e.g. the shape area rate) from here. */
@Controller('pricing-settings')
export class PricingSettingsPublicController {
  constructor(private readonly pricingSettingsService: PricingSettingsService) {}

  @Get()
  findAll() {
    return this.pricingSettingsService.findAll();
  }
}

@Controller('admin/pricing-settings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminPricingSettingsController {
  constructor(private readonly pricingSettingsService: PricingSettingsService) {}

  @Get()
  @RequirePermissions('pricing.view')
  findAll() {
    return this.pricingSettingsService.findAll();
  }

  @Get(':key')
  @RequirePermissions('pricing.view')
  findOne(@Param('key') key: string) {
    return this.pricingSettingsService.findOne(key);
  }

  @Patch(':key')
  @RequirePermissions('pricing.manage')
  update(@Param('key') key: string, @Body() dto: UpdatePricingSettingDto, @CurrentUser() user: AuthenticatedUser) {
    return this.pricingSettingsService.update(key, dto.value, user.id);
  }
}
