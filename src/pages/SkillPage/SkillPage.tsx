import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillPage } from './hooks/useSkillPage';
import { useAuth } from '../../shared/hooks/useAuth';
import { useExchangeRequest } from '../../features/requests/hooks/useExchangeRequest';
import {
  ExchangeModal,
  ExchangeModalType,
} from '../../features/requests/ui/ExchangeModal/ExchangeModal';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import TagUI from '../../shared/ui/Tag/tagUi';
import {
  SkillCard,
  getCategoryVariant,
} from '../../widgets/SkillCard/SkillCard';
import { SkillTag } from '../../shared/ui/SkillName/SkillTag';
import styles from './SkillPage.module.css';

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
    return 'года';
  return 'лет';
}

export function SkillPage() {
  const { user, relatedUsers, loading, error } = useSkillPage();
  const { isAuth, user: currentUser } = useAuth();
  const { createRequest, hasActiveRequestForSkill } = useExchangeRequest();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ExchangeModalType>('auth');

  if (loading) {
    return (
      <div className={styles['skill-page']}>
        <div className={styles['skill-page-container']}>
          <div className={styles['skill-page-loading']}>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles['skill-page']}>
        <div className={styles['skill-page-container']}>
          <div className={styles['skill-page-error']}>
            {error || 'Навык не найден'}
          </div>
        </div>
      </div>
    );
  }

  const skillsToLearn = user.skills?.slice(0, 3) || [];
  const remainingCount = (user.skills?.length || 0) - 3;

  const hasActiveRequest = currentUser
    ? hasActiveRequestForSkill(
        user.skillCanTeach?.id || '',
        currentUser.id,
        user.id,
      )
    : false;

  const handleExchangeClick = () => {
    if (!isAuth || !currentUser) {
      setModalType('auth');
      setModalOpen(true);
      return;
    }

    if (hasActiveRequest) {
      setModalType('request-sent');
      setModalOpen(true);
      return;
    }

    const newRequest = createRequest(
      currentUser.id,
      user.id,
      user.skillCanTeach?.id || '',
    );

    if (newRequest) {
      setModalType('success');
      setModalOpen(true);
    } else {
      setModalType('request-sent');
      setModalOpen(true);
    }
  };

  const handleModalAction = () => {
    if (modalType === 'auth') {
      navigate('/login', {
        state: { from: { pathname: `/skill/${user.skillCanTeach?.id}` } },
      });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles['skill-page']}>
      <div className={styles['skill-page-container']}>
        <div className={styles['skill-page-main-grid']}>
          <div className={styles['skill-page-left']}>
            <div className={styles['skill-page-profile']}>
              <div className={styles['skill-page-avatar-wrapper']}>
                <Avatar
                  src={`/avatars/${user.avatar}`}
                  name={user.name}
                  size="lg"
                />
                <div className={styles['skill-page-text']}>
                  <h1 className={styles['skill-page-name']}>{user.name}</h1>
                  <p className={styles['skill-page-location']}>
                    {user.city},
                    <br />
                    {user.age} {getAgeSuffix(user.age)}
                  </p>
                </div>
              </div>
              {user.about && (
                <p className={styles['skill-page-bio']}>{user.about}</p>
              )}

              <div className={styles['skill-page-skills-block']}>
                <h2 className={styles['skill-page-section-title']}>
                  Может научить
                </h2>
                <div className={styles['skill-page-skills-list']}>
                  {user.skillCanTeach && (
                    <TagUI
                      className={styles['skill-text']}
                      variant={getCategoryVariant(
                        user.skillCanTeach.categoryId,
                      )}
                    >
                      {user.skillCanTeach.name}
                    </TagUI>
                  )}
                </div>
              </div>

              <div className={styles['skill-page-skills-block']}>
                <h2 className={styles['skill-page-section-title']}>
                  Хочет научиться
                </h2>
                <div className={styles['skill-page-skills-list']}>
                  {skillsToLearn.map((skillId) => (
                    <SkillTag
                      className={styles['skill-text']}
                      key={skillId}
                      skillId={skillId}
                    />
                  ))}
                  {remainingCount > 0 && (
                    <TagUI key="remaining-count" variant="other">
                      +{remainingCount}
                    </TagUI>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles['skill-page-right']}>
            <div className={styles['skill-page-description-block']}>
              <div className={styles['skill-page-skill-text']}>
                <h2 className={styles['skill-page-skill-name']}>
                  {user.skillCanTeach?.name}
                </h2>
                <span className={styles['skill-page-skill-category']}>
                  Творчество и искусство / Музыка и звук
                </span>
                <p className={styles['skill-page-skill-description']}>
                  {user.skillCanTeach?.description || 'Описание отсутствует'}
                </p>
              </div>
              <div className={styles['skill-page-exchange-button']}>
                <Button
                  variant="primary"
                  size="lg"
                  className={styles['skill-page-exchange-full-width']}
                  onClick={handleExchangeClick}
                >
                  Предложить обмен
                </Button>
              </div>
            </div>

            <div className={styles['skill-page-main-photo']}>
              <img
                src={
                  user.images?.[0]
                    ? `/photos/${user.images[0]}`
                    : '/placeholder.jpg'
                }
                alt={user.skillCanTeach?.name}
                className={styles['skill-page-main-photo-image']}
              />
            </div>

            {user.images && user.images.length > 1 && (
              <div className={styles['skill-page-vertical-carousel']}>
                <div className={styles['skill-page-carousel-container']}>
                  {user.images.slice(1).map((image, idx) => (
                    <img
                      key={image}
                      src={`/photos/${image}`}
                      alt={`${user.skillCanTeach?.name} - фото ${idx + 2}`}
                      className={styles['skill-page-carousel-item']}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedUsers.length > 0 && (
          <div className={styles['skill-page-related-section']}>
            <h2 className={styles['skill-page-section-title']}>
              Похожие предложения
            </h2>
            <div className={styles['skill-page-related-grid']}>
              {relatedUsers.map((relatedUser) => (
                <SkillCard key={relatedUser.id} user={relatedUser} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ExchangeModal
        isOpen={modalOpen}
        type={modalType}
        onClose={handleModalClose}
        onAction={handleModalAction}
        skillName={user.skillCanTeach?.name}
        userName={user.name}
      />
    </div>
  );
}
