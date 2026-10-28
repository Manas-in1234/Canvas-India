import { Module } from '@nestjs/common';
import { AssetsModule } from './assets/assets.module.js';
import { DesignsModule } from './designs/designs.module.js';
import { ArtworkModule } from './artwork/artwork.module.js';
import { ShapesModule } from './shapes/shapes.module.js';

@Module({
  imports: [AssetsModule, DesignsModule, ArtworkModule, ShapesModule],
  exports: [AssetsModule, DesignsModule, ArtworkModule, ShapesModule],
})
export class CustomizationModule {}
