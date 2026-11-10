import type { OptionCategoryItemDto } from './optionCategoriesApi';

function sameFieldType(value: unknown, example: unknown): boolean {
  if (Array.isArray(example)) return Array.isArray(value);
  if (example === null) return value === null;
  if (typeof example === 'number') return typeof value === 'number' && Number.isFinite(value);
  return value !== null && typeof value === typeof example;
}

export function mapCatalogOptions<T extends object>(rows: OptionCategoryItemDto[] | undefined, defaults: T[], priceField?: keyof T): T[] {
    if (!rows) return defaults;
    const templates = defaults as Record<string, unknown>[];
    const requiredFields = Object.keys(templates[0] ?? {}).filter((field) =>
      templates.every((template) => template[field] !== undefined),
    );
    const options = rows.flatMap((row) => {
      const id = row.extras?.id;
      const original = defaults.find((option) =>
        ('id' in option && option.id === id) || ('hex' in option && option.hex === id),
      );
      const value = { ...original, ...row.extras } as T & Record<string, unknown>;
      if ('label' in value) Object.assign(value, { label: row.label });
      if ('name' in value) Object.assign(value, { name: row.label });
      if ('description' in value && row.description) Object.assign(value, { description: row.description });
      if ('previewImage' in value && row.imageUrl) Object.assign(value, { previewImage: row.imageUrl });
      if (priceField) Object.assign(value, { [priceField]: Number(row.flatPrice) });
      if (!requiredFields.every((field) => sameFieldType(value[field], templates[0][field]))) {
        return original ? [original] : [];
      }
      return [value];
    });
    return options;
}
