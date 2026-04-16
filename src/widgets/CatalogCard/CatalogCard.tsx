import { type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import styles from './CatalogCard.module.css';
import TagUI from '../../shared/ui/Tag/tagUi';
import { SkillTag } from '../../shared/ui/SkillName/SkillTag';
import like from '../../assets/images/like.svg';
import like_active from '../../assets/images/like_active.svg';
import type { User } from '../../entities/user/model/types';
import type { SkillsResponse } from '../../api/endpoints/skillsApi';
import { getCategoryVariant } from '../SkillCard/SkillCard';
import { useAuth } from '../../shared/hooks/useAuth';
import { useFavorites } from '../../features/favorites/hooks/useFavorites';

interface CatalogCardProps {
  user: User;
  skills: SkillsResponse | null;
}

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
    return 'года';
  return 'лет';
}

const VISIBLE_LEARN = 2;

export function CatalogCard({ user, skills }: CatalogCardProps) {
  const { isAuth } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const catalogItemId = `teach-${user.id}`;
  const liked = isFavorite(catalogItemId);

  const learnIds = user.skills ?? [];
  const visibleLearn = learnIds.slice(0, VISIBLE_LEARN);
  const learnExtra = learnIds.length - VISIBLE_LEARN;

  return (
    <div className={styles.card}>
      <div
        className={`${styles.likes} ${!isAuth ? styles['likes-guest'] : ''}`}
        {...(isAuth
          ? {
              role: 'button' as const,
              tabIndex: 0,
              onClick: () => toggleFavorite(catalogItemId),
              onKeyDown: (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFavorite(catalogItemId);
                }
              },
              'aria-label': liked
                ? 'Убрать из избранного'
                : 'Добавить в избранное',
            }
          : {
              'aria-label':
                'Избранное недоступно: войдите в аккаунт, чтобы добавлять карточки',
              title: 'Войдите в аккаунт, чтобы добавить в избранное',
            })}
      >
        <img src={liked ? like_active : like} alt="" aria-hidden="true" />
      </div>
      <div className={styles.header}>
        <Avatar
          src={user.avatar ? `/avatars/${user.avatar}` : undefined}
          name={user.name}
          size="lg"
        />
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>{user.name.split(' ')[0]}</div>
          <div className={styles.skillPageLocation}>
            <span>{user.city}, </span>
            <span>
              {user.age} {getAgeSuffix(user.age)}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.skillsBlock}>
        <h3 className={styles.sectionTitle}>Может научить:</h3>
        <div className={styles.tagRow}>
          {user.skillCanTeach ? (
            <TagUI
              className={styles.tag}
              variant={getCategoryVariant(user.skillCanTeach.categoryId)}
            >
              {user.skillCanTeach.name}
            </TagUI>
          ) : (
            <TagUI className={styles.tag} variant="other">
              Не указано
            </TagUI>
          )}
        </div>
      </div>
      <div className={styles.skillsBlock}>
        <h3 className={styles.sectionTitle}>Хочет научиться:</h3>
        <div className={styles.tagRow}>
          {skills && learnIds.length > 0 ? (
            <>
              {visibleLearn.map((skillId) => (
                <SkillTag
                  key={skillId}
                  skillId={skillId}
                  className={styles.tag}
                />
              ))}
              {learnExtra > 0 ? (
                <TagUI className={styles.tag} variant="other">
                  +{learnExtra}
                </TagUI>
              ) : null}
            </>
          ) : (
            <TagUI className={styles.tag} variant="other">
              Не указано
            </TagUI>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        {user.skillCanTeach?.id ? (
          <Link
            to={`/skill/${user.skillCanTeach.id}/${user.id}`}
            className={styles.link}
          >
            <Button variant="primary" size="md" className={styles.button}>
              Подробнее
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="md"
            className={styles.button}
            disabled
          >
            Подробнее
          </Button>
        )}
      </div>
    </div>
  );
}
