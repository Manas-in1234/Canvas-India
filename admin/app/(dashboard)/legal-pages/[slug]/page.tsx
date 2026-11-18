import { LegalPageEditor } from './detail-client';

export function generateStaticParams() {
  return [{ slug: 'placeholder' }];
}

export default async function LegalPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegalPageEditor slug={slug} />;
}
