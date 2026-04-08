// src/pages/SkillPage/components/RelatedOffers.tsx
import { SkillCard } from '../../../widgets/SkillCard';
import type { User } from '../../../entities/user/model/types';
import styles from '../SkillPage.module.css';

interface RelatedOffersProps {
  users: User[];
  currentSkillId: string;
}

export function RelatedOffers({ users, currentSkillId }: RelatedOffersProps) {
  if (users.length === 0) {
    return null;
  }

  // Можно использовать currentSkillId для аналитики или фильтрации
  // Например, для отслеживания показов похожих предложений
  console.log(`Showing related offers for skill: ${currentSkillId}`);

  return (
    <div className={styles['skill-page__related-section']}>
      <div className={styles['skill-page__container']}>
        <h2 className={styles['skill-page__section-title']}>Похожие предложения</h2>
        <div className={styles['skill-page__related-grid']}>
          {users.map((user) => (
            <SkillCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}