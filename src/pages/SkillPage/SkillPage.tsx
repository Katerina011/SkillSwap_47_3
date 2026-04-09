import { useLocation, useNavigate } from 'react-router-dom';
import { useSkillPage } from './hooks/useSkillPage';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import TagUI from '../../shared/ui/Tag/tagUi';
import {
  SkillCard,
  getCategoryVariant,
} from '../../widgets/SkillCard/SkillCard';
import styles from './SkillPage.module.css';
import { useAuth } from '../../shared/hooks/useAuth';
import { SkillTag } from '../../shared/ui/SkillName/SkillTag';

function getAgeSuffix(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100))
    return 'года';
  return 'лет';
}

export function SkillPage() {
  const { user, relatedUsers, loading, error } = useSkillPage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth } = useAuth();

  const handleProposeExchange = () => {
    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }
    // TODO(F-3.6): открыть создание заявки на обмен
  };

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

  return (
    <div className={styles['skill-page']}>
      <div className={styles['skill-page-container']}>
        {/* ОСНОВНАЯ СЕТКА (2 колонки) */}
        <div className={styles['skill-page-main-grid']}>
          {/* ЛЕВАЯ КОЛОНКА (320px) */}
          <div className={styles['skill-page-left']}>
            {/* Профиль */}
            <div className={styles['skill-page-profile']}>
              <div className={styles['skill-page-avatar-wrapper']}>
                <Avatar
                  src={`/avatars/${user.avatar}`}
                  name={user.name}
                  size="lg"
                />
              </div>
              <h1 className={styles['skill-page-name']}>{user.name}</h1>
              <p className={styles['skill-page-location']}>
                {user.city}, {user.age} {getAgeSuffix(user.age)}
              </p>
              {user.about && (
                <p className={styles['skill-page-bio']}>{user.about}</p>
              )}
            </div>

            {/* Может научить */}
            <div className={styles['skill-page-skills-block']}>
              <h2 className={styles['skill-page-section-title']}>
                Может научить
              </h2>
              <div className={styles['skill-page-skills-list']}>
                {user.skillCanTeach && (
                  <TagUI
                    variant={getCategoryVariant(user.skillCanTeach.categoryId)}
                  >
                    {user.skillCanTeach.name}
                  </TagUI>
                )}
              </div>
            </div>

            {/* Хочет научиться */}
            <div className={styles['skill-page-skills-block']}>
              <h2 className={styles['skill-page-section-title']}>
                Хочет научиться
              </h2>
              <div className={styles['skill-page-skills-list']}>
                {skillsToLearn.map((skillId) => (
                  <TagUI key={skillId} variant="other">
                    <SkillName skillId={skillId} />
                  </TagUI>
                ))}
                {remainingCount > 0 && (
                  <TagUI key="remaining-count" variant="other">
                    +{remainingCount}
                  </TagUI>
                )}
              </div>
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

              {/* Может научить */}
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

              {/* Хочет научиться */}
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

          {/* ПРАВАЯ КОЛОНКА (внутренний грид 3 колонки) */}
          <div className={styles['skill-page-right']}>
            {/* Колонка 2A — Описание */}
            <div className={styles['skill-page-description-block']}>
              <div className={styles['skill-page-skill-text']}>
                <h2 className={styles['skill-page-skill-name']}>
                  {user.skillCanTeach?.name}
                </h2>
                <span className={styles['skill-page-skill-category']}>
                  {/* TODO: добавить категорию из skills.json */}
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
                >
                  Предложить обмен
                </Button>
              </div>
            </div>

            {/* Колонка 2B — Главное фото */}
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

            {/* Колонка 2C — Вертикальная карусель */}
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

          {/* ПРАВАЯ КОЛОНКА (внутренний грид 3 колонки) */}
          <div className={styles['skill-page-right']}>
            {/* Колонка 2A — Описание */}
            <div className={styles['skill-page-description-block']}>
              <div className={styles['skill-page-skill-text']}>
                <h2 className={styles['skill-page-skill-name']}>
                  {user.skillCanTeach?.name}
                </h2>
                <span className={styles['skill-page-skill-category']}>
                  {/* TODO: добавить категорию из skills.json */}
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
                  onClick={handleProposeExchange}
                >
                  Предложить обмен
                </Button>
              </div>
            </div>

            {/* Колонка 2B — Главное фото */}
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

            {/* Колонка 2C — Вертикальная карусель */}
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

        {/* Похожие предложения */}
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
        {/* Похожие предложения */}
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
    </div>
  );
}
