import type { CatalogItem, CatalogItemKind } from '../../catalog/model/types';

export const CREATED_SKILLS_KEY = 'skillswap_created_skills';

export interface CreatedSkillData {
  title: string;
  description: string;
  kind: CatalogItemKind;
  categoryId: string;
  subcategoryId: string;
  authorName: string;
  authorId: string;
  avatar?: string;
  images?: string[];
  tags?: string[];
}

// CreatedSkill расширяет CatalogItem, добавляя createdAt и tags
export interface CreatedSkill extends CatalogItem {
  createdAt: string;
  tags?: string[];
}

export function getCreatedSkills(): CreatedSkill[] {
  try {
    const raw = localStorage.getItem(CREATED_SKILLS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addCreatedSkill(skillData: CreatedSkillData): CreatedSkill {
  const current = getCreatedSkills();

  const newSkill: CreatedSkill = {
    id: `created_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    kind: skillData.kind,
    categoryId: skillData.categoryId,
    subcategoryId: skillData.subcategoryId,
    title: skillData.title,
    description: skillData.description || 'Пока не заполнено',
    authorName: skillData.authorName,
    authorId: skillData.authorId,
    avatar: skillData.avatar || '',
    images: skillData.images,
    createdAt: new Date().toISOString(),
    tags: skillData.tags,
  };

  localStorage.setItem(
    CREATED_SKILLS_KEY,
    JSON.stringify([newSkill, ...current]),
  );

  return newSkill;
}

// Функция для получения всех навыков (созданные + базовые)
export function getAllSkillsForCatalog(
  baseSkills: CatalogItem[],
): CatalogItem[] {
  const createdSkills = getCreatedSkills();
  // CreatedSkill совместим с CatalogItem, так как расширяет его
  return [...createdSkills, ...baseSkills];
}
