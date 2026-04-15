// src/pages/SkillPage/hooks/useSkillPage.ts
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { User } from '../../../entities/user/model/types';
import {
  getUserBySkillId,
  getUsersBySkillId,
} from '../../../api/endpoints/usersApi';

export function useSkillPage() {
  const { id: skillId } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [relatedUsers, setRelatedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillId) {
      setError('Навык не найден');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const foundUser = await getUserBySkillId(skillId);

        if (!foundUser) {
          setError('Пользователь с таким навыком не найден');
          setUser(null);
          setRelatedUsers([]);
          return;
        }

        setUser(foundUser);

        // Загружаем похожие предложения (другие пользователи с таким же навыком)
        const related = await getUsersBySkillId(skillId, foundUser.id);
        
        // 🔍 ЛОГИРОВАНИЕ - добавьте этот блок
        console.log('=== useSkillPage Debug ===');
        console.log('Current skillId:', skillId);
        console.log('Main user:', {
          id: foundUser.id,
          name: foundUser.name,
          skillId: foundUser.skillCanTeach?.id,
          skillName: foundUser.skillCanTeach?.name
        });
        console.log('Related users (before slice):', related.map(u => ({
          id: u.id,
          name: u.name,
          skillId: u.skillCanTeach?.id,
          skillName: u.skillCanTeach?.name
        })));
        
        setRelatedUsers(related.slice(0, 4));
        
        console.log('Related users (after slice, max 4):', related.slice(0, 4).map(u => u.name));
      } catch {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [skillId]);

  return { user, relatedUsers, loading, error, skillId };
}