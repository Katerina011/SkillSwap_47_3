// src/pages/FavoritesPage/FavoritesPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useFavorites } from '../../features/favorites/hooks/useFavorites';
import { SkillCard } from '../../widgets/SkillCard/SkillCard';
import { getAllUsers } from '../../api/endpoints/usersApi';
import type { User } from '../../entities/user/model/types';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const { isAuth } = useAuth();
  const { getFavoritesFromItems, isLoading: favoritesLoading } = useFavorites();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем всех пользователей
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        // Ошибка загрузки пользователей
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Преобразуем пользователей в формат CatalogItem для getFavoritesFromItems
  // и получаем избранных
  useEffect(() => {
    if (allUsers.length > 0 && !favoritesLoading) {
      // Преобразуем User в CatalogItem (структуру, которую понимает getFavoritesFromItems)
      const catalogItems = allUsers.map((user) => ({
        id: user.id,
        kind: 'teach' as const,
        categoryId: user.skillCanTeach?.categoryId || '',
        subcategoryId: user.skillCanTeach?.id || '',
        title: user.skillCanTeach?.name || '',
        description: user.skillCanTeach?.description || '',
        authorName: user.name,
        authorId: user.id,
        avatar: user.avatar,
        images: user.images,
      }));

      // Используем getFavoritesFromItems для получения избранных
      const favorites = getFavoritesFromItems(catalogItems);

      // Находим полные объекты User для избранных ID
      const favoriteIds = new Set(favorites.map((item) => item.id));
      const favoriteUsersList = allUsers.filter((user) =>
        favoriteIds.has(user.id),
      );

      setFavoriteUsers(favoriteUsersList);
    }
  }, [allUsers, favoritesLoading, getFavoritesFromItems]);

  // Если пользователь не авторизован
  if (!isAuth) {
    return (
      <div className={styles.container}>
        <div className={styles['empty-state']}>
          <h2>Войдите в аккаунт</h2>
          <p>Чтобы просматривать избранное, пожалуйста, авторизуйтесь</p>
        </div>
      </div>
    );
  }

  // Во время загрузки
  if (loading || favoritesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка избранного...</div>
      </div>
    );
  }

  // Если избранное пусто
  if (favoriteUsers.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles['empty-state']}>
          <h2>Избранное пусто</h2>
          <p>Добавляйте пользователей в избранное, чтобы не потерять их</p>
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
          <SkillCard key={user.id} user={user} variant="default" />
        ))}
      </div>
    </div>
  );
}
