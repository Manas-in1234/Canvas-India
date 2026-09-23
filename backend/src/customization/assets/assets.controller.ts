import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service.js';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('customization/assets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload-url')
  @RequirePermissions('assets.upload')
  requestUploadUrl(@Body() dto: RequestUploadUrlDto) {
    return this.assetsService.requestUploadUrl(dto.ownerType, dto.ownerId, dto.fileName, dto.mimeType, dto.fileSize);
  }

  @Post(':id/confirm')
  @RequirePermissions('assets.upload')
  confirmUpload(@Param('id') id: string) {
    return this.assetsService.confirmUpload(id);
  }

  @Get(':id')
  @RequirePermissions('assets.upload')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Get(':id/download-url')
  @RequirePermissions('assets.upload')
  getDownloadUrl(@Param('id') id: string) {
    return this.assetsService.getDownloadUrl(id);
  }

  @Get()
  @RequirePermissions('assets.upload')
  findByOwner(@Query('ownerType') ownerType: string, @Query('ownerId') ownerId: string) {
    return this.assetsService.findByOwner(ownerType, ownerId);
  }
}
