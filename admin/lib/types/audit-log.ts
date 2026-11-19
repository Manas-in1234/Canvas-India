export interface AuditLogEntry {
  id: string;
  adminUserId: string | null;
  adminUser: { name: string; email: string } | null;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  reason: string | null;
  createdAt: string;
}
