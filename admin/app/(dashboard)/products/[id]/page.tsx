import { ProductDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
