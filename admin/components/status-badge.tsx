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
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn('border-0 font-medium', STATUS_STYLES[status] ?? 'bg-muted')}>
      {status.replaceAll('_', ' ')}
    </Badge>
  );
}
