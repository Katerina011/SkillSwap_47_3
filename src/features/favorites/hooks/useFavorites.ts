import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getFavoriteIds,
  addFavorite,
  removeFavorite,
  toggleFavoriteId,
  isFavorite,
} from '../api/favoritesStorage';
import type { CatalogItem } from '../../catalog/model/types';

export interface UseFavoritesReturn {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  isLoading: boolean;
  getFavoritesFromItems: (items: CatalogItem[]) => CatalogItem[];
}

export function useFavorites(): UseFavoritesReturn {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
    setIsLoading(false);
  }, []);

  const handleAddFavorite = useCallback((id: string) => {
    addFavorite(id);
    setFavoriteIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const handleRemoveFavorite = useCallback((id: string) => {
    removeFavorite(id);
    setFavoriteIds((prev) => prev.filter((itemId) => itemId !== id));
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string): boolean => {
      const current = favoriteIds.includes(id);
      if (current) {
        handleRemoveFavorite(id);
        return false;
      } else {
        handleAddFavorite(id);
        return true;
      }
    },
    [favoriteIds, handleAddFavorite, handleRemoveFavorite],
  );

  const checkIsFavorite = useCallback(
    (id: string): boolean => {
      return favoriteIds.includes(id);
    },
    [favoriteIds],
  );

  const getFavoritesFromItems = useCallback(
    (items: CatalogItem[]): CatalogItem[] => {
      const idsSet = new Set(favoriteIds);
      return items.filter((item) => idsSet.has(item.id));
    },
    [favoriteIds],
  );

  return {
    favoriteIds,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
    toggleFavorite: handleToggleFavorite,
    isFavorite: checkIsFavorite,
    isLoading,
    getFavoritesFromItems,
  };
}
