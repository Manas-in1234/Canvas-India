import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { ReturnsReplacementsService } from './returns-replacements.service.js';
import { CreateReturnRequestDto } from './dto/create-return-request.dto.js';
import { CreateReplacementRequestDto } from './dto/create-replacement-request.dto.js';

@Controller('returns-replacements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReturnsReplacementsController {
  constructor(
    private readonly returnsReplacementsService: ReturnsReplacementsService,
  ) {}

  @Get('returns')
  @RequirePermissions('returns.view')
  findReturnRequests() {
    return this.returnsReplacementsService.findReturnRequests();
  }

  @Get('returns/:id')
  @RequirePermissions('returns.view')
  findReturnRequest(@Param('id') id: string) {
    return this.returnsReplacementsService.findReturnRequest(id);
  }

  @Post('returns')
  @RequirePermissions('returns.manage')
  createReturnRequest(@Body() dto: CreateReturnRequestDto) {
    return this.returnsReplacementsService.createReturnRequest(dto);
  }

  @Post('returns/:id/review')
  @RequirePermissions('returns.manage')
  reviewReturn(@Param('id') id: string) {
    return this.returnsReplacementsService.reviewReturn(id);
  }

  @Post('returns/:id/approve')
  @RequirePermissions('returns.manage')
  approveReturn(@Param('id') id: string) {
    return this.returnsReplacementsService.approveReturn(id);
  }

  @Post('returns/:id/returned')
  @RequirePermissions('returns.manage')
  markReturned(@Param('id') id: string) {
    return this.returnsReplacementsService.markReturned(id);
  }

  @Post('returns/:id/refund')
  @RequirePermissions('returns.manage')
  refundReturn(@Param('id') id: string) {
    return this.returnsReplacementsService.refundReturn(id);
  }
  @Get('replacements')
  @RequirePermissions('returns.view')
  findReplacementRequests() {
    return this.returnsReplacementsService.findReplacementRequests();
  }

  @Get('replacements/:id')
  @RequirePermissions('returns.view')
  findReplacementRequest(@Param('id') id: string) {
    return this.returnsReplacementsService.findReplacementRequest(id);
  }

  @Post('replacements')
  @RequirePermissions('returns.manage')
  createReplacementRequest(
    @Body() dto: CreateReplacementRequestDto,
  ) {
    return this.returnsReplacementsService.createReplacementRequest(dto);
  }

  @Post('replacements/:id/review')
  @RequirePermissions('returns.manage')
  reviewReplacement(@Param('id') id: string) {
    return this.returnsReplacementsService.reviewReplacement(id);
  }

  @Post('replacements/:id/approve')
  @RequirePermissions('returns.manage')
  approveReplacement(@Param('id') id: string) {
    return this.returnsReplacementsService.approveReplacement(id);
  }

  @Post('replacements/:id/complete')
  @RequirePermissions('returns.manage')
  completeReplacement(@Param('id') id: string) {
    return this.returnsReplacementsService.completeReplacement(id);
  }

  @Post('replacements/:id/reject')
  @RequirePermissions('returns.manage')
  rejectReplacement(@Param('id') id: string) {
    return this.returnsReplacementsService.rejectReplacement(id);
  }
}

