import { useEffect, useMemo, useState } from 'react';
import {
  getAllSkills,
  type SkillsResponse,
} from '../../../api/endpoints/skillsApi';
import { getAllUsers } from '../../../api/endpoints/usersApi';
import type { User } from '../../../entities/user/model/types';
import type { CatalogItem } from '../../catalog/model/types';
import { buildCatalogItems } from '../../catalog/utils/buildCatalogItems';
import { useFavorites } from './useFavorites';

type UseFavoriteUsersResult = {
  favoriteUsers: User[];
  skills: SkillsResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function useFavoriteUsers(enabled = true): UseFavoriteUsersResult {
  const { getFavoritesFromItems, isLoading: favoritesLoading } = useFavorites();
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<SkillsResponse | null>(null);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSourcesLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    const loadSources = async () => {
      try {
        setSourcesLoading(true);
        setError(null);
        const [nextUsers, nextSkills] = await Promise.all([
          getAllUsers(),
          getAllSkills(),
        ]);
        if (!cancelled) {
          setUsers(nextUsers);
          setSkills(nextSkills);
        }
      } catch {
        if (!cancelled) {
          setError(
            'Не удалось загрузить избранное. Попробуйте обновить страницу.',
          );
        }
      } finally {
        if (!cancelled) {
          setSourcesLoading(false);
        }
      }
    };

    loadSources();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const allItems = useMemo((): CatalogItem[] => {
    if (!skills) return [];
    return buildCatalogItems(users, skills);
  }, [users, skills]);

  const favoriteItems = useMemo(
    () => getFavoritesFromItems(allItems),
    [allItems, getFavoritesFromItems],
  );

  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  );

  const favoriteUsers = useMemo(() => {
    const out: User[] = [];
    const seen = new Set<string>();
    favoriteItems.forEach((item) => {
      if (seen.has(item.authorId)) return;
      const user = usersById.get(item.authorId);
      if (!user) return;
      seen.add(item.authorId);
      out.push(user);
    });
    return out;
  }, [favoriteItems, usersById]);

  return {
    favoriteUsers,
    skills,
    isLoading: enabled && (sourcesLoading || favoritesLoading),
    error,
  };
}
