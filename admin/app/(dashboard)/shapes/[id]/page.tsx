import { ShapeDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function ShapeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShapeDetailClient id={id} />;
}
