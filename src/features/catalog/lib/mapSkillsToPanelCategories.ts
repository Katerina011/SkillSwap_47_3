import type { SkillsResponse } from '../../../api/endpoints/skillsApi';

export type AllSkillsPanelCategory = {
  categoryId: string;
  title: string;
  iconLabel: string;
  subcategories: { id: string; name: string }[];
};

export function mapSkillsToPanelCategories(
  data: SkillsResponse,
): AllSkillsPanelCategory[] {
  return data.categories.map((cat) => ({
    categoryId: cat.id,
    title: cat.name,
    iconLabel: cat.icon,
    subcategories: cat.subcategory.map((s) => ({
      id: s.id,
      name: s.name,
    })),
  }));
}
