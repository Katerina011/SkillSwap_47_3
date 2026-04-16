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
  const malformedItems: CatalogItem[] = [
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

  const mockItems: CatalogItem[] = [
    {
      id: 'teach-1',
      kind: 'teach',
      categoryId: 'cat-1',
      subcategoryId: 'sub-1',
      title: 'React Fundamentals',
      description: 'Basics of React',
      authorName: 'Ivan Ivanov',
      authorId: 'user-1',
      avatar: 'avatar1.png',
    },
    {
      id: 'learn-1',
      kind: 'learn',
      categoryId: 'cat-1',
      subcategoryId: 'sub-1',
      title: 'React',
      description: '',
      authorName: 'Petr Petrov',
      authorId: 'user-2',
      avatar: 'avatar2.png',
    },
    {
      id: 'teach-2',
      kind: 'teach',
      categoryId: 'cat-2',
      subcategoryId: 'sub-2',
      title: 'Advanced Python',
      description: 'Deep dive into Python',
      authorName: 'Ivan Ivanov',
      authorId: 'user-1',
      avatar: 'avatar1.png',
    },
  ];

  it('не падает на отсутствующих или нестроковых полях при пустом поиске', () => {
    expect(() =>
      filterCatalogItems(malformedItems, defaultFilters),
    ).not.toThrow();
    expect(filterCatalogItems(malformedItems, defaultFilters)).toHaveLength(2);
  });

  it('находит карточку по authorName без учета регистра', () => {
    expect(filterCatalogItems(malformedItems, makeFilters('alice'))).toEqual([
      malformedItems[1],
    ]);
  });

  it('находит карточку по description без учета регистра', () => {
    expect(
      filterCatalogItems(malformedItems, makeFilters('typescript')),
    ).toEqual([malformedItems[1]]);
  });

  it('должна возвращать все элементы, если фильтры по умолчанию', () => {
    const result = filterCatalogItems(mockItems, defaultFilters);
    expect(result).toHaveLength(3);
  });

  it('должна фильтровать по поисковому запросу (trim, игнорирование регистра)', () => {
    const result = filterCatalogItems(mockItems, {
      ...defaultFilters,
      search: '  react  ',
    });

    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual(
      expect.arrayContaining(['teach-1', 'learn-1']),
    );
  });

  it('должна фильтровать по поисковому запросу среди авторов и описания', () => {
    const result = filterCatalogItems(mockItems, {
      ...defaultFilters,
      search: 'Petr    ',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('learn-1');
  });

  it('должна фильтровать по категории и подкатегории', () => {
    const resultCat1 = filterCatalogItems(mockItems, {
      ...defaultFilters,
      categoryId: 'cat-1',
    });
    expect(resultCat1).toHaveLength(2);

    const resultSub2 = filterCatalogItems(mockItems, {
      ...defaultFilters,
      categoryId: 'cat-2',
      subcategoryId: 'sub-2',
    });
    expect(resultSub2).toHaveLength(1);
    expect(resultSub2[0].id).toBe('teach-2');
  });

  it('должна фильтровать по режиму (учу/учусь)', () => {
    const resultTeach = filterCatalogItems(mockItems, {
      ...defaultFilters,
      mode: 'teach',
    });
    expect(resultTeach).toHaveLength(2);

    const resultLearn = filterCatalogItems(mockItems, {
      ...defaultFilters,
      mode: 'learn',
    });
    expect(resultLearn).toHaveLength(1);
    expect(resultLearn[0].id).toBe('learn-1');
  });

  it('должна корректно комбинировать фильтры (условие И/AND)', () => {
    const result = filterCatalogItems(mockItems, {
      search: 'ivanov',
      categoryId: 'cat-2',
      subcategoryId: 'all',
      mode: 'teach',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('teach-2');
  });

  it("регрессия: корректно фильтрует строковые id категории/подкатегории и 'all'", () => {
    const stringIdItems: CatalogItem[] = [
      {
        id: 'teach-string-id',
        kind: 'teach',
        categoryId: '5',
        subcategoryId: 'skill_031',
        title: 'Test title',
        description: 'Test description',
        authorName: 'Test User',
        authorId: 'user_test_1',
        avatar: 'avatar-test-1.jpg',
      },
    ];

    const byCategoryOnly = filterCatalogItems(stringIdItems, {
      search: '',
      categoryId: '5',
      subcategoryId: 'all',
      mode: 'all',
    });
    expect(byCategoryOnly).toHaveLength(1);

    const byCategoryAndSubcategory = filterCatalogItems(stringIdItems, {
      search: '',
      categoryId: '5',
      subcategoryId: 'skill_031',
      mode: 'all',
    });
    expect(byCategoryAndSubcategory).toHaveLength(1);
  });

  it('нормализует нестроковый categoryId на входной границе фильтра', () => {
    const numberLikeItems: CatalogItem[] = [
      {
        id: 'teach-number-like',
        kind: 'teach',
        categoryId: '5',
        subcategoryId: 'skill_031',
        title: 'Test title',
        description: 'Test description',
        authorName: 'Test User',
        authorId: 'user_test_2',
        avatar: 'avatar-test-2.jpg',
      },
    ];

    const result = filterCatalogItems(numberLikeItems, {
      search: '',
      categoryId: 5 as unknown as CatalogFilters['categoryId'],
      subcategoryId: 'all',
      mode: 'all',
    });

    expect(result).toHaveLength(1);
  });
});
