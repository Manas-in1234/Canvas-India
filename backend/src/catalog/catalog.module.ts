import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { CollectionsModule } from './collections/collections.module.js';
import { OptionsModule } from './options/options.module.js';
import { VariantsModule } from './variants/variants.module.js';
import { PricingModule } from './pricing/pricing.module.js';

@Module({
  imports: [ProductsModule, CategoriesModule, CollectionsModule, OptionsModule, VariantsModule, PricingModule],
  exports: [ProductsModule, CategoriesModule, CollectionsModule, OptionsModule, VariantsModule, PricingModule],
})
export class CatalogModule {}
