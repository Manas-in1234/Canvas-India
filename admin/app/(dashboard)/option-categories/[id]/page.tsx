import { OptionCategoryDetailClient } from './detail-client';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function OptionCategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OptionCategoryDetailClient id={id} />;
}
