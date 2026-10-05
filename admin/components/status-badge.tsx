import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Deliberately renders orderStatus/paymentStatus/shippingStatus as separate
// badges wherever used — never collapsed into a single combined status,
// mirroring the backend's explicit separation of these fields (scope §9).
const STATUS_STYLES: Record<string, string> = {
  // Order status
  DRAFT: 'bg-muted text-muted-foreground',
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-red-100 text-red-800',
  // Payment status
  PENDING: 'bg-amber-100 text-amber-800',
  AUTHORIZED: 'bg-blue-100 text-blue-800',
  FAILED: 'bg-red-100 text-red-800',
  PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-800',
  // Shipping status
  NOT_SHIPPED: 'bg-muted text-muted-foreground',
  READY: 'bg-blue-100 text-blue-800',
  PICKED_UP: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  OUT_FOR_DELIVERY: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  NDR: 'bg-orange-100 text-orange-800',
  RTO: 'bg-red-100 text-red-800',
  // Product status
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  ARCHIVED: 'bg-stone-200 text-stone-700',
  // Production job / stage status
  QUEUED: 'bg-muted text-muted-foreground',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
  PASSED: 'bg-emerald-100 text-emerald-800',
  SKIPPED: 'bg-stone-200 text-stone-700',
  // Machine status
  AVAILABLE: 'bg-emerald-100 text-emerald-800',
  RUNNING: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-amber-100 text-amber-800',
  OFFLINE: 'bg-stone-200 text-stone-700',
  // Artwork status
  PREFLIGHT_PASSED: 'bg-emerald-100 text-emerald-800',
  PREFLIGHT_WARNING: 'bg-amber-100 text-amber-800',
  PREFLIGHT_FAILED: 'bg-red-100 text-red-800',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn('border-0 font-medium', STATUS_STYLES[status] ?? 'bg-muted')}>
      {status.replaceAll('_', ' ')}
    </Badge>
  );
}
