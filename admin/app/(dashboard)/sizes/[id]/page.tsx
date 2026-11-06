import { SizesDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function SizesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SizesDetailClient productTypeId={decodeURIComponent(id)} />;
}
