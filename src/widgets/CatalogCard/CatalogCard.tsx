import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import styles from './CatalogCard.module.css';
import TagUI from '../../shared/ui/Tag/tagUi';
import like from '../../assets/images/like.svg';
import like_active from '../../assets/images/like_active.svg';
import { User } from '../../entities/user/model/types';
import { SkillsResponse } from '../../api/endpoints/skillsApi';

interface CatalogCardProps {
  user: User; // или item: CatalogItem, в зависимости от того, что вам нужно
  skills: SkillsResponse | null;
}

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
    return 'года';
  return 'лет';
}

export function CatalogCard({ user, skills }: CatalogCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsLiked(!isLiked);
    }
  };
  // Функция для получения названия навыка из skillCanTeach
  const getTeachSkillName = (): string => {
    if (
      user.skillCanTeach &&
      typeof user.skillCanTeach === 'object' &&
      'name' in user.skillCanTeach
    ) {
      return user.skillCanTeach.name;
    }
    return '';
  };

  // Функция для получения списка навыков из skills (по ID)
  const getLearnSkillsNames = (): string[] => {
    if (!skills || !user.skills || !Array.isArray(user.skills)) {
      return [];
    }

    // Создаем Map для быстрого поиска навыков по ID
    const skillsMap = new Map();

    // Проходим по всем категориям и собираем скиллы
    if (skills.categories) {
      skills.categories.forEach((category) => {
        if (category.subcategory) {
          category.subcategory.forEach((skill) => {
            skillsMap.set(skill.id, skill.name);
          });
        }
      });
    }

    // Получаем названия навыков по ID из user.skills
    const skillNames = user.skills
      .map((skillId) => skillsMap.get(skillId))
      .filter((name) => name !== undefined); // Фильтруем undefined на случай, если навык не найден

    return skillNames;
  };

  // Функция для рендера тегов с ограничением в 2 штуки
  const renderLimitedTags = (tags: string[]) => {
    if (!tags || tags.length === 0) {
      return <TagUI variant="other">Не указано</TagUI>;
    }

    const visibleTags = tags.slice(0, 2);
    const remainingCount = tags.length - 2;

    return (
      <div className={styles.tagStyles}>
        {visibleTags.map((tag) => (
          <TagUI key={tag} variant="other">
            {tag.trim()}
          </TagUI>
        ))}
        {remainingCount > 0 && (
          <TagUI key="remaining-count" variant="other">
            +{remainingCount}
          </TagUI>
        )}
      </div>
    );
  };

  const teachSkillName = getTeachSkillName();
  const learnSkillsNames = getLearnSkillsNames();

  return (
    <div className={styles.card}>
      <div
        role="button"
        tabIndex={0}
        className={styles.likes}
        onClick={handleLikeClick}
        onKeyDown={handleKeyPress}
        aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
      >
        <img src={isLiked ? like_active : like} alt="" aria-hidden="true" />
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
      <div className={styles.content}>
        <h3 className={styles.title}>Может научить:</h3>
        {renderLimitedTags(teachSkillName ? [teachSkillName] : [])}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Хочет научиться:</h3>
        {renderLimitedTags(learnSkillsNames)}
      </div>
      {/* <div className={styles.content}>
                <h3 className={styles.title}>Может научить:</h3>
                {renderLimitedTags(user.skillCanTeach.name)}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>Хочет научиться:</h3>
                {renderLimitedTags(desc)}
            </div> */}
      <div className={styles.footer}>
        <Link to={`/skill/${user.skillCanTeach.id}`} className={styles.link}>
          <Button variant="primary" size="md" className={styles.button}>
            Подробнее
          </Button>
        </Link>
      </div>
    </div>
  );
}
