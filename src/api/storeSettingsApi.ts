import { buildApiUrl } from './productsApi';

export interface StoreSettings {
  cod_enabled_for_customizer: boolean;
  cod_surcharge: number;
  min_order_value: number;
}

const DEFAULTS: StoreSettings = {
  cod_enabled_for_customizer: false,
  cod_surcharge: 0,
  min_order_value: 0,
};

/** Used until (or unless) the settings load, so checkout never depends on the request succeeding. */
export async function fetchStoreSettings(signal?: AbortSignal): Promise<StoreSettings> {
  try {
    const response = await fetch(buildApiUrl('/store-settings'), { signal });
    if (!response.ok) return DEFAULTS;
    const data = await response.json();
    if (!data || typeof data !== 'object') return DEFAULTS;
    return {
      cod_enabled_for_customizer: data.cod_enabled_for_customizer === '1',
      cod_surcharge: Number(data.cod_surcharge) || 0,
      min_order_value: Number(data.min_order_value) || 0,
    };
  } catch {
    return DEFAULTS;
  }
}
