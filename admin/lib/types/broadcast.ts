export type BroadcastStatus = 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED';

export interface Broadcast {
  id: string;
  subject: string;
  body: string;
  status: BroadcastStatus;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  errorMessage: string | null;
  sentAt: string | null;
  createdAt: string;
  targetSegment: { name: string } | null;
}
