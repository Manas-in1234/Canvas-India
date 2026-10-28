import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { ProductTypesModule } from './product-types/product-types.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { CollectionsModule } from './collections/collections.module.js';
import { OptionsModule } from './options/options.module.js';
import { VariantsModule } from './variants/variants.module.js';
import { PricingModule } from './pricing/pricing.module.js';
import { OptionCategoriesModule } from './option-categories/option-categories.module.js';
import { SizePresetsModule } from './size-presets/size-presets.module.js';

@Module({
  imports: [
    ProductsModule,
    ProductTypesModule,
    CategoriesModule,
    CollectionsModule,
    OptionsModule,
    VariantsModule,
    PricingModule,
    OptionCategoriesModule,
    SizePresetsModule,
  ],
  exports: [
    ProductsModule,
    ProductTypesModule,
    CategoriesModule,
    CollectionsModule,
    OptionsModule,
    VariantsModule,
    PricingModule,
    OptionCategoriesModule,
    SizePresetsModule,
  ],
})
export class CatalogModule {}
