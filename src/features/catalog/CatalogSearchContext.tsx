// CatalogSearchContext.tsx
import { createContext, useContext, useState, useMemo } from 'react';

type CatalogSearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const CatalogSearchContext = createContext<CatalogSearchContextType | null>(
  null,
);

export function CatalogSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const value = useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery]);

  return (
    <CatalogSearchContext.Provider value={value}>
      {children}
    </CatalogSearchContext.Provider>
  );
}

export function useCatalogSearch() {
  const context = useContext(CatalogSearchContext);
  if (!context) throw new Error('useCatalogSearch used outside Provider');
  return context;
}
