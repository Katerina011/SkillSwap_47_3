import { describe, it, expect } from '@jest/globals';
import { filterCatalogItems, type CatalogFilters } from './filterCatalogItems';
import type { CatalogItem } from '../model/types';

const defaultFilters: CatalogFilters = {
  search: '',
  categoryId: 'all',
  subcategoryId: 'all',
  mode: 'all',
};

const makeFilters = (search: string): CatalogFilters => ({
  ...defaultFilters,
  search,
});

describe('filterCatalogItems', () => {
  const items: CatalogItem[] = [
    {
      id: 'broken-item',
      kind: 'teach',
      categoryId: 'cat-1',
      subcategoryId: 'sub-1',
      title: undefined,
      authorName: null,
      description: 42,
      authorId: 'usr-1',
      avatar: 'avatar.png',
    } as unknown as CatalogItem,
    {
      id: 'searchable-item',
      kind: 'learn',
      categoryId: 'cat-2',
      subcategoryId: 'sub-2',
      title: '',
      authorName: 'Alice',
      description: 'Основы TypeScript',
      authorId: 'usr-2',
      avatar: 'avatar-2.png',
    },
  ];

  it('не падает на отсутствующих или нестроковых полях при пустом поиске', () => {
    expect(() => filterCatalogItems(items, defaultFilters)).not.toThrow();
    expect(filterCatalogItems(items, defaultFilters)).toHaveLength(2);
  });

  it('находит карточку по authorName без учета регистра', () => {
    expect(filterCatalogItems(items, makeFilters('alice'))).toEqual([items[1]]);
  });

  it('находит карточку по description без учета регистра', () => {
    expect(filterCatalogItems(items, makeFilters('typescript'))).toEqual([
      items[1],
    ]);
  });
});
