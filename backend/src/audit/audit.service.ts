import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

export interface RecordAuditParams {
  adminUserId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  reason?: string;
}

/**
 * Write-only by design (scope §74): no update/delete method is exposed here,
 * and no controller ever exposes mutation of audit_logs.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(params: RecordAuditParams): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        adminUserId: params.adminUserId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        changes: params.changes ? (params.changes as never) : undefined,
        reason: params.reason,
      },
    });
  }
}
