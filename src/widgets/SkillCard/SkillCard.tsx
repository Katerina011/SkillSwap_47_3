import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { SkillName } from '../../shared/ui/SkillName/SkillName';
import type { User } from '../../entities/user/model/types';
import styles from './SkillCard.module.css';

interface SkillCardProps {
  user: User;
}

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return 'года';
  return 'лет';
}

export function SkillCard({ user }: SkillCardProps) {
  const skillsToLearn = user.skills?.slice(0, 3) || [];
  const remainingCount = (user.skills?.length || 0) - 3;

  return (
    <div className={styles['skill-card']}>
      <div className={styles['skill-card-header']}>
        <Avatar
          src={`/avatars/${user.avatar}`}
          name={user.name}
          size="lg"
        />
        <div className={styles['skill-card-info']}>
          <h3 className={styles['skill-card-name']}>{user.name}</h3>
          <p className={styles['skill-card-location']}>
            {user.city}, {user.age} {getAgeSuffix(user.age)}
          </p>
        </div>
      </div>

      <div className={styles['skill-card-skills']}>
        <p className={styles['skill-card-skills-label']}>Может научить:</p>
        <div className={styles['skill-card-skills-list']}>
          {user.skillCanTeach && (
            <span className={styles['skill-card-skill-tag']}>
              {user.skillCanTeach.name}
            </span>
          )}
        </div>
      </div>

      <div className={styles['skill-card-skills']}>
        <p className={styles['skill-card-skills-label']}>Хочет научиться:</p>
        <div className={styles['skill-card-skills-list']}>
          {skillsToLearn.map((skillId) => (
            <span key={skillId} className={styles['skill-card-skill-tag']}>
              <SkillName skillId={skillId} />
            </span>
          ))}
          {remainingCount > 0 && (
            <span className={styles['skill-card-skill-tag']}>
              +{remainingCount}
            </span>
          )}
        </div>
      </div>

      <Link to={`/skill/${user.skillCanTeach?.id}`}>
        <Button variant="secondary" size="md" className={styles['skill-card-button']}>
          Смотреть
        </Button>
      </Link>
    </div>
  );
}