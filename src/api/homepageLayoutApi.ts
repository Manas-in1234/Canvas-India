import { useEffect, useState } from 'react';
import { buildApiUrl } from './productsApi';

export interface HomepageSectionSetting {
  key: string;
  enabled: boolean;
  /** Replaces the section heading when not empty. */
  title: string;
}

export interface HomepageLayout {
  storeOpen: boolean;
  closedMessage: string;
  sections: HomepageSectionSetting[];
}

/** Used until (or unless) the admin's layout loads, so the homepage never depends on the request succeeding. */
export const DEFAULT_HOMEPAGE_LAYOUT: HomepageLayout = {
  storeOpen: true,
  closedMessage: '',
  sections: ['categories', 'canvas', 'acrylic', 'cork', 'occasions', 'bestsellers', 'bulk', 'why', 'testimonials'].map((key) => ({
    key,
    enabled: true,
    title: '',
  })),
};

export async function fetchHomepageLayout(signal?: AbortSignal): Promise<HomepageLayout | null> {
  try {
    const response = await fetch(buildApiUrl('/homepage-layout'), { signal });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data !== 'object' || !Array.isArray(data.sections)) return null;
    return data as HomepageLayout;
  } catch {
    return null;
  }
}

export function useHomepageLayout(): HomepageLayout {
  const [layout, setLayout] = useState<HomepageLayout>(DEFAULT_HOMEPAGE_LAYOUT);
  useEffect(() => {
    const controller = new AbortController();
    fetchHomepageLayout(controller.signal).then((loaded) => {
      if (loaded && !controller.signal.aborted) setLayout(loaded);
    });
    return () => controller.abort();
  }, []);
  return layout;
}
