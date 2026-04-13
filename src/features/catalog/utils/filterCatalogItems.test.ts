import { describe, it, expect } from '@jest/globals';
import { filterCatalogItems } from './filterCatalogItems';
import type { CatalogItem } from '../model/types';

describe('filterCatalogItems', () => {
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

  const defaultFilters = {
    search: '',
    categoryId: 'all',
    subcategoryId: 'all',
    mode: 'all',
  } as const;

  it('должна возвращать все элементы, если фильтры по умолчанию', () => {
    const result = filterCatalogItems(mockItems, defaultFilters);
    expect(result).toHaveLength(3);
  });

  it('должна фильтровать по поисковому запросу (trim, игнорирование регистра)', () => {
    const result = filterCatalogItems(mockItems, {
      ...defaultFilters,
      search: '  react  ',
    });
    // Подходят 'React Fundamentals' (title) и 'React' (title)
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
    // Только категория
    const resultCat1 = filterCatalogItems(mockItems, {
      ...defaultFilters,
      categoryId: 'cat-1',
    });
    expect(resultCat1).toHaveLength(2);

    // Категория и подкатегория
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

    // Только teach-2 подходит: автор Ivan Ivanov, cat-2, режим teach
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('teach-2');
  });
});
