import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service.js';
import { PricingSettingsService } from './pricing-settings.service.js';
import { PricingSettingsPublicController, AdminPricingSettingsController } from './pricing-settings.controller.js';

@Module({
  controllers: [PricingSettingsPublicController, AdminPricingSettingsController],
  providers: [PricingService, PricingSettingsService],
  exports: [PricingService, PricingSettingsService],
})
export class PricingModule {}
