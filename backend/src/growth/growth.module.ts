import { Module } from '@nestjs/common';
import { CustomerSegmentsModule } from './customer-segments/customer-segments.module.js';
import { DiscountsModule } from './discounts/discounts.module.js';
import { PromotionsModule } from './promotions/promotions.module.js';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { AbandonedCartsModule } from './abandoned-carts/abandoned-carts.module.js';

@Module({
  imports: [
    CustomerSegmentsModule,
    DiscountsModule,
    PromotionsModule,
    CampaignsModule,
    AbandonedCartsModule,
  ],
  exports: [
    CustomerSegmentsModule,
    DiscountsModule,
    PromotionsModule,
    CampaignsModule,
    AbandonedCartsModule,
  ],
})
export class GrowthModule {}
