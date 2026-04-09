// src/features/skills/hooks/useSkillCategory.ts
import { useEffect, useState } from 'react';
import { fetchSubcategories } from '../../../api/endpoints/skillsApi';

export function useSkillCategory(skillId: string) {
  const [categoryId, setCategoryId] = useState<string>('other');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const subcategories = await fetchSubcategories();
        const skill = subcategories.find((s) => s.id === skillId);

        if (skill && skill.categoryId) {
          setCategoryId(skill.categoryId);
        } else {
          // Маппинг для конкретных skillId, если categoryId не задан
          const skillCategoryMap: Record<string, string> = {
            skill_001: '1', // Бизнес
            skill_002: '1',
            skill_009: '2', // Творчество
            skill_010: '2',
            skill_011: '2',
            skill_012: '2',
            skill_017: '3', // Языки
            skill_018: '3',
            skill_019: '3',
            // добавьте остальные маппинги
          };

          if (skillCategoryMap[skillId]) {
            setCategoryId(skillCategoryMap[skillId]);
          }
        }
      } catch (error) {
        console.error('Failed to load skill category:', error);
        setCategoryId('other');
      } finally {
        setLoading(false);
      }
    };

    if (skillId) {
      loadCategory();
    }
  }, [skillId]);

  return { categoryId, loading };
}
