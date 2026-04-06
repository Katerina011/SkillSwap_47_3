export interface CatalogItem {
  user: {
    id: string;
    name: string;
    skillCanTeach: {
      id: string;
      categoryId: string;
      name: string;
      description?: string;
    };
    skills: string[];
  };
}

export interface FilterOptions {
  search: string;
  categoryId: string | 'all';
  mode: 'all' | 'teach' | 'learn';
}

export const filterCatalogItems = (
  items: CatalogItem[],
  filters: FilterOptions
): CatalogItem[] => {
  const { search, categoryId, mode } = filters;
  const searchTerm = search.trim().toLowerCase();

  return items.filter((item) => {
    const { user } = item;
    const { skillCanTeach: teachSkill } = user;

    // 1. ПОИСК
    let matchesSearch = true;
    if (searchTerm !== '') {
      const { name: skillName, description = '' } = teachSkill;
      const { name: userName } = user;
      
      matchesSearch = 
        skillName.toLowerCase().includes(searchTerm) ||
        userName.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm);
    }

    // 2. КАТЕГОРИЯ
    let matchesCategory = true;
    if (categoryId !== 'all') {
      matchesCategory = teachSkill.categoryId === categoryId;
    }

    // 3. РЕЖИМ
    let matchesMode = true;
    if (mode === 'learn') {
      matchesMode = user.skills && user.skills.length > 0;
    }

    return matchesSearch && matchesCategory && matchesMode;
  });
};