/** Запрос фильтра каталога из шапки (панель «Все навыки») */
export type CatalogFacetApply = {
  categoryId: string;
  subcategoryId: 'all' | string;
};

/** Контекст Outlet для страниц каталога (поиск из шапки + фильтр по навыку) */
export type CatalogOutletContext = {
  catalogSearch: string;
  pendingFacetApply: CatalogFacetApply | null;
  clearPendingFacetApply: () => void;
};
