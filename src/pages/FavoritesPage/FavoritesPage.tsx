import { Link } from 'react-router-dom';
import { useFavoriteUsers } from '../../features/favorites/hooks/useFavoriteUsers';
import { useAuth } from '../../shared/hooks/useAuth';
import { CatalogCard } from '../../widgets/CatalogCard';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const { isAuth } = useAuth();
  const { favoriteUsers, skills, isLoading, error } = useFavoriteUsers(isAuth);

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

  if (isLoading) {
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
