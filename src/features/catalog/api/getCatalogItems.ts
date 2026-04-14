import { getCreatedSkills } from '../../skills/api/createdSkillsStorage';
import type { CatalogItem } from '../model/types';

// Загрузка базовых навыков (например, из JSON)
async function loadBaseCatalogItems(): Promise<CatalogItem[]> {
  // Здесь логика загрузки
  // Например:
  // const response = await fetch('/api/skills');
  // return response.json();
  return [];
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  const [baseItems, createdItems] = await Promise.all([
    loadBaseCatalogItems(),
    Promise.resolve(getCreatedSkills()),
  ]);

  // Созданные навыки показываем первыми
  return [...createdItems, ...baseItems];
}
