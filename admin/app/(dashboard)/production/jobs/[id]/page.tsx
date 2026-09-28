import { ProductionJobDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function ProductionJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductionJobDetailClient id={id} />;
}
