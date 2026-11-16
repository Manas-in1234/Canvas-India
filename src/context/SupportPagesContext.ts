import { useEffect, useState } from 'react';
import { buildApiUrl } from '../api/productsApi';

const empty: Record<string, string> = {};

export function useSupportPage(slug: string) {
  const [saved, setSaved] = useState<{ slug: string; content: Record<string, string> }>();
  useEffect(() => {
    const controller = new AbortController();
    fetch(buildApiUrl('/support-pages/' + slug), { signal: controller.signal, cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(result => {
        if (!controller.signal.aborted && result?.content && typeof result.content === 'object') {
          setSaved({ slug, content: result.content });
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [slug]);
  const content = saved?.slug === slug ? saved.content : empty;
  return { content, copy: (key: string, fallback: string) => content[key] ?? fallback };
}
