import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import configuration from './config/configuration.js';
import { DatabaseModule } from './database/database.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { CommerceModule } from './commerce/commerce.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { CustomizationModule } from './customization/customization.module.js';
import { ProductionModule } from './production/production.module.js';
import { ShippingModule } from './shipping/shipping.module.js';
import { GrowthModule } from './growth/growth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    AuditModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CustomersModule,
    CatalogModule,
    CommerceModule,
    PaymentsModule,
    InventoryModule,
    CustomizationModule,
    ProductionModule,
    ShippingModule,
    GrowthModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
