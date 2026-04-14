export const FAVORITES_KEY = 'skillswap_favorites';

/*Список ID избранных карточек*/
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

/*Сохранить список ID избранных карточек*/
export const setFavoriteIds = (ids: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

/*Добавить карточку в избранное*/
export const addFavorite = (catalogItemId: string): void => {
  const current = getFavoriteIds();
  if (!current.includes(catalogItemId)) {
    setFavoriteIds([...current, catalogItemId]);
  }
};

/*Удалить карточку из избранного*/
export const removeFavorite = (catalogItemId: string): void => {
  const current = getFavoriteIds();
  if (current.includes(catalogItemId)) {
    setFavoriteIds(current.filter((id) => id !== catalogItemId));
  }
};

/*Переключить статус избранного (true - в избранном, false - не в избранном)*/
export const toggleFavoriteId = (catalogItemId: string): boolean => {
  const current = getFavoriteIds();
  const isFavorite = current.includes(catalogItemId);

  if (isFavorite) {
    setFavoriteIds(current.filter((id) => id !== catalogItemId));
    return false;
  } else {
    setFavoriteIds([...current, catalogItemId]);
    return true;
  }
};

/*Проверить, находится ли карточка в избранном*/
export const isFavorite = (catalogItemId: string): boolean => {
  return getFavoriteIds().includes(catalogItemId);
};
