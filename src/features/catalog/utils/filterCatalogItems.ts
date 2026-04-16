import type { CatalogItem, CatalogItemKind } from '../model/types';

export type CatalogFilterMode = 'all' | CatalogItemKind;
export type CatalogFilterCategory = 'all' | string;
export type CatalogFilterSubcategory = 'all' | string;

export interface CatalogFilters {
  search: string;
  categoryId: CatalogFilterCategory;
  subcategoryId: CatalogFilterSubcategory;
  mode: CatalogFilterMode;
}

const safeLower = (value: unknown) =>
  typeof value === 'string' ? value.toLowerCase() : '';

const normalizeFilterId = (value: unknown): 'all' | string => {
  if (value === 'all') return 'all';
  if (typeof value === 'string') return value;
  return String(value);
};

export const filterCatalogItems = (
  items: CatalogItem[],
  { search, categoryId, subcategoryId, mode }: CatalogFilters,
): CatalogItem[] => {
  const searchTerm = search.trim().toLowerCase();
  const normalizedCategoryId = normalizeFilterId(categoryId);
  const normalizedSubcategoryId = normalizeFilterId(subcategoryId);

  return items.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      safeLower(item.title).includes(searchTerm) ||
      safeLower(item.authorName).includes(searchTerm) ||
      safeLower(item.description).includes(searchTerm);

    let matchesCategory = true;
    if (normalizedCategoryId !== 'all') {
      if (normalizedSubcategoryId === 'all') {
        matchesCategory = item.categoryId === normalizedCategoryId;
      } else {
        matchesCategory =
          item.categoryId === normalizedCategoryId &&
          item.subcategoryId === normalizedSubcategoryId;
      }
    }

    const matchesMode = mode === 'all' || item.kind === mode;

    return matchesSearch && matchesCategory && matchesMode;
  });
};
