import { useState, useEffect, useCallback } from 'react';
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_KEY,
  getFavoriteIds,
  addFavorite,
  removeFavorite,
} from '../api/favoritesStorage';
import type { CatalogItem } from '../../catalog/model/types';
import { useAuth } from '../../../shared/hooks/useAuth';

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
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds(user?.id));
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || !user?.id) {
      return undefined;
    }

    const syncFavorites = () => {
      setFavoriteIds(getFavoriteIds(user.id));
    };

    const handleStorage = (event: StorageEvent) => {
      const { key } = event;
      if (!key?.startsWith(`${FAVORITES_KEY}_`)) return;
      if (key !== `${FAVORITES_KEY}_${user.id}`) return;
      syncFavorites();
    };

    const handleFavoritesChanged = (event: Event) => {
      const custom = event as CustomEvent<{ userId?: string }>;
      if (custom.detail?.userId !== user.id) return;
      syncFavorites();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChanged);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(
        FAVORITES_CHANGED_EVENT,
        handleFavoritesChanged,
      );
    };
  }, [user?.id]);

  const handleAddFavorite = useCallback(
    (id: string) => {
      if (!user?.id) return;
      addFavorite(id, user.id);
      setFavoriteIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    },
    [user?.id],
  );

  const handleRemoveFavorite = useCallback(
    (id: string) => {
      if (!user?.id) return;
      removeFavorite(id, user.id);
      setFavoriteIds((prev) => prev.filter((itemId) => itemId !== id));
    },
    [user?.id],
  );

  const handleToggleFavorite = useCallback(
    (id: string): boolean => {
      if (!user?.id) return false;
      const current = favoriteIds.includes(id);
      if (current) {
        handleRemoveFavorite(id);
        return false;
      }
      handleAddFavorite(id);
      return true;
    },
    [favoriteIds, handleAddFavorite, handleRemoveFavorite, user?.id],
  );

  const checkIsFavorite = useCallback(
    (id: string): boolean => favoriteIds.includes(id),
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
