import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllSkills,
  type SkillsResponse,
} from '../../api/endpoints/skillsApi';
import { getAllUsers } from '../../api/endpoints/usersApi';
import type { User } from '../../entities/user/model/types';
import { useFavorites } from '../../features/favorites/hooks/useFavorites';
import type { CatalogItem } from '../../features/catalog/model/types';
import { buildCatalogItems } from '../../features/catalog/utils/buildCatalogItems';
import { useAuth } from '../../shared/hooks/useAuth';
import { CatalogCard } from '../../widgets/CatalogCard';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const { isAuth } = useAuth();
  const { getFavoritesFromItems, isLoading: favoritesLoading } = useFavorites();
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<SkillsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSources = async () => {
      try {
        setLoading(true);
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
          setLoading(false);
        }
      }
    };

    loadSources();

    return () => {
      cancelled = true;
    };
  }, []);

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

  if (!isAuth) {
    return (
      <div className={styles.container}>
        <div className={styles['empty-state']}>
          <h2>Войдите в аккаунт</h2>
          <p>Чтобы просматривать избранное, пожалуйста, авторизуйтесь.</p>
          <Link className={styles['back-link']} to="/login">
            Перейти ко входу
          </Link>
        </div>
      </div>
    );
  }

  if (loading || favoritesLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Загрузка избранного...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles['empty-state']}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <Link className={styles['back-link']} to="/catalog">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  if (favoriteUsers.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles['empty-state']}>
          <h2>Избранное пусто</h2>
          <p>Добавляйте пользователей в избранное, чтобы не потерять их</p>
          <Link className={styles['back-link']} to="/catalog">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Избранное</h1>
        <p className={styles.count}>{favoriteUsers.length} предложений</p>
      </div>
      <div className={styles.grid}>
        {favoriteUsers.map((user) => (
          <CatalogCard key={user.id} user={user} skills={skills} />
        ))}
      </div>
    </div>
  );
}
