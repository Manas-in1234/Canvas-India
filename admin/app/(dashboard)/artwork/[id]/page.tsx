import { ArtworkDetailClient } from './detail-client';

// Static export requires at least one concrete path per dynamic route.
// This id is never actually used — the shell it builds is reused for every
// real id at runtime (see public/_redirects), since all data here is
// fetched client-side from the API, never at build time.
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArtworkDetailClient id={id} />;
}
