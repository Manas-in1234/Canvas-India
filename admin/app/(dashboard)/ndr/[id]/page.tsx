import { NdrDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function NdrDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NdrDetailClient id={id} />;
}
