import { useState, useEffect } from 'react';
import type { CatalogItem } from '../model/types';
import { getAllSkillsForCatalog } from '../../skills/api/createdSkillsStorage';
import { catalogItemFixtures } from '../model/catalogItemFixtures';

export function useCatalogItems() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = () => {
    try {
      // функциия, которая гарантирует правильный тип
      const allItems = getAllSkillsForCatalog(catalogItemFixtures);
      setItems(allItems);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load catalog items:', error);
      setItems(catalogItemFixtures);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    refetch: loadItems,
  };
}
