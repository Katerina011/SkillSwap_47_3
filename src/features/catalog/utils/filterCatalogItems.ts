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

export const filterCatalogItems = (
  items: CatalogItem[],
  { search, categoryId, subcategoryId, mode }: CatalogFilters,
): CatalogItem[] => {
  const searchTerm = search.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      safeLower(item.title).includes(searchTerm) ||
      safeLower(item.authorName).includes(searchTerm) ||
      safeLower(item.description).includes(searchTerm);

    let matchesCategory = true;
    if (categoryId !== 'all') {
      if (subcategoryId === 'all') {
        matchesCategory = item.categoryId === categoryId;
      } else {
        matchesCategory =
          item.categoryId === categoryId &&
          item.subcategoryId === subcategoryId;
      }
    }

    const matchesMode = mode === 'all' || item.kind === mode;

    return matchesSearch && matchesCategory && matchesMode;
  });
};
