export const FAVORITES_KEY = 'skillswap_favorites';

export const getFavoriteIds = (): string[] => {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setFavoriteIds = (ids: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

export const addFavorite = (catalogItemId: string): void => {
  const current = getFavoriteIds();
  if (!current.includes(catalogItemId)) {
    setFavoriteIds([...current, catalogItemId]);
  }
};

export const removeFavorite = (catalogItemId: string): void => {
  const current = getFavoriteIds();
  if (current.includes(catalogItemId)) {
    setFavoriteIds(current.filter((id) => id !== catalogItemId));
  }
};

export const toggleFavoriteId = (catalogItemId: string): boolean => {
  const current = getFavoriteIds();
  const isFavorite = current.includes(catalogItemId);

  if (isFavorite) {
    setFavoriteIds(current.filter((id) => id !== catalogItemId));
    return false;
  }

  setFavoriteIds([...current, catalogItemId]);
  return true;
};

export const isFavorite = (catalogItemId: string): boolean =>
  getFavoriteIds().includes(catalogItemId);
