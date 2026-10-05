import { OrderDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
