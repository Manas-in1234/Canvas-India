import { mapCatalogOptions } from './catalogOptions';
import { useEffect, useMemo, useState } from 'react';
import { fetchOptionCategoryItems, type OptionCategoryItemDto } from './optionCategoriesApi';

export function useCatalogItems(key: string, material?: 'CANVAS' | 'ACRYLIC') {
  const [result, setResult] = useState<{ key: string; items: OptionCategoryItemDto[] }>();
  const scope = key + ':' + (material ?? '');
  useEffect(() => {
    let active = true;
    fetchOptionCategoryItems(key, material, true).then((items) => {
      if (active) setResult({ key: scope, items });
    }).catch(() => { /* Retain defaults only when the catalog request fails. */ });
    return () => { active = false; };
  }, [key, material, scope]);
  return result?.key === scope ? result.items : undefined;
}

export function useCatalogOptions<T extends object>(key: string, defaults: T[], priceField?: keyof T): T[] {
  const rows = useCatalogItems(key, 'CANVAS');
  return useMemo(() => {
    return mapCatalogOptions(rows, defaults, priceField);
  }, [rows, defaults, priceField]);
}
