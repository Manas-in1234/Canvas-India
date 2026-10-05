import { SegmentDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function SegmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SegmentDetailClient id={id} />;
}
