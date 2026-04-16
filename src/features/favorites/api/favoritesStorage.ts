export const FAVORITES_KEY = 'skillswap_favorites';
export const FAVORITES_CHANGED_EVENT = 'skillswap:favorites-changed';

const getFavoritesStorageKey = (userId: string): string =>
  `${FAVORITES_KEY}_${userId}`;

const emitFavoritesChanged = (userId?: string): void => {
  if (typeof window === 'undefined' || !userId) return;
  window.dispatchEvent(
    new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: { userId } }),
  );
};

export const getFavoriteIds = (userId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  if (!userId) return [];

  const raw = localStorage.getItem(getFavoritesStorageKey(userId));
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
};

export const setFavoriteIds = (ids: string[], userId?: string): void => {
  if (typeof window === 'undefined') return;
  if (!userId) return;
  localStorage.setItem(getFavoritesStorageKey(userId), JSON.stringify(ids));
  emitFavoritesChanged(userId);
};

export const addFavorite = (catalogItemId: string, userId?: string): void => {
  const current = getFavoriteIds(userId);
  if (!current.includes(catalogItemId)) {
    setFavoriteIds([...current, catalogItemId], userId);
  }
};

export const removeFavorite = (
  catalogItemId: string,
  userId?: string,
): void => {
  const current = getFavoriteIds(userId);
  if (current.includes(catalogItemId)) {
    setFavoriteIds(
      current.filter((id) => id !== catalogItemId),
      userId,
    );
  }
};

export const toggleFavoriteId = (
  catalogItemId: string,
  userId?: string,
): boolean => {
  const current = getFavoriteIds(userId);
  const isFav = current.includes(catalogItemId);

  if (isFav) {
    setFavoriteIds(
      current.filter((id) => id !== catalogItemId),
      userId,
    );
    return false;
  }

  setFavoriteIds([...current, catalogItemId], userId);
  return true;
};

export const isFavorite = (catalogItemId: string, userId?: string): boolean =>
  getFavoriteIds(userId).includes(catalogItemId);
