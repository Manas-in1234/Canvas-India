export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReviewListItem {
  id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  rejectionReason: string | null;
  moderatedBy: string | null;
  moderatedAt: string | null;
  createdAt: string;
  customer: { name: string; email: string };
  orderItem: { productNameSnapshot: string; order: { orderNumber: string } };
}
