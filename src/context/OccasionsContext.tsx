import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { buildApiUrl } from '../api/productsApi';
import { FESTIVAL_OCCASIONS, OCCASIONS, type OccasionDef } from '../data/occasionsData';
import { MEGA_MENUS_DATA } from '../data/storeData';
import type { MegaMenuConfig } from '../data/storeData';

type Occasion = OccasionDef & {
  heroTitle?: string;
  bannerColor?: string | null;
  group: 'occasion' | 'festival';
};

const defaults: Occasion[] = [
  ...OCCASIONS.map(row => ({ ...row, group: 'occasion' as const })),
  ...FESTIVAL_OCCASIONS.filter(row => !OCCASIONS.some(item => item.slug === row.slug))
    .map(row => ({ ...row, group: 'festival' as const })),
];
const originalSlugs = new Set(defaults.map(row => row.slug));
const defaultMenu = MEGA_MENUS_DATA.gifts;
const emptyMenu: MegaMenuConfig = { ...defaultMenu, groups: defaultMenu.groups.map(group => ({ ...group, items: [] })) };
const occasionsContext = createContext({
  entries: [] as Occasion[], occasions: [] as Occasion[], loading: true, unavailable: false, giftMenu: emptyMenu,
});

export function OccasionsProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]);
    fetch(buildApiUrl('/occasions'), { signal, cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Could not load occasions.');
        return response.json() as Promise<Occasion[]>;
      })
      .then(rows => {
        if (!Array.isArray(rows)) throw new Error('Invalid occasion list.');
        if (!controller.signal.aborted) {
          setEntries(rows.map(row => ({
            ...row,
            bannerImage: row.bannerImage.startsWith('/api/v1/')
              ? buildApiUrl(row.bannerImage.slice('/api/v1'.length))
              : row.bannerImage,
          })));
        }
      })
      .catch(() => { if (!controller.signal.aborted) setUnavailable(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const occasions = entries.filter(row => row.group === 'occasion');
  const namesByHref = new Map(entries.map(row => ['/occasions/' + row.slug, row.name]));
  const groups = defaultMenu.groups.map((group, index) => ({
    ...group,
    items: [
      ...group.items.filter(item => namesByHref.has(item.href ?? ''))
        .map(item => ({ ...item, name: namesByHref.get(item.href ?? '') ?? item.name })),
      ...(index === 0 ? occasions.filter(row => !originalSlugs.has(row.slug))
        .map(row => ({ name: row.name, slug: 'gifts', href: '/occasions/' + row.slug })) : []),
    ],
  }));

  return (
    <occasionsContext.Provider value={{ entries, occasions, loading, unavailable, giftMenu: { ...defaultMenu, groups } }}>
      {children}
    </occasionsContext.Provider>
  );
}

export function useOccasions() {
  return useContext(occasionsContext);
}
