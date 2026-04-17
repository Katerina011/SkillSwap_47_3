// src/pages/ProfilePage/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { getRequestsByUser } from '../../features/requests/api/requestsApi';
import { fetchCities } from '../../api/endpoints/citiesApi';
import { updateUserProfileInMockDb } from '../../api/endpoints/usersApi';
import { Avatar } from '../../shared/ui/Avatar';
import TagUI from '../../shared/ui/Tag/tagUi';
import { getCategoryVariant } from '../../widgets/SkillCard/SkillCard';
import type { User } from '../../entities/user/model/types';
import requestIcon from '../../assets/images/request.svg';
import messageIcon from '../../assets/images/message-text.svg';
import favoriteIcon from '../../assets/images/like.svg';
import skillsIcon from '../../assets/images/idea.svg';
import userIcon from '../../assets/images/user.svg';
import editIcon from '../../assets/images/edit.png';
import calendarIcon from '../../assets/images/calendar.svg';
import chevronDownIcon from '../../assets/images/chevron-down.svg';
import styles from './ProfilePage.module.css';

const profileTabs = [
  { key: 'requests', label: 'Заявки', icon: requestIcon },
  { key: 'exchanges', label: 'Мои обмены', icon: messageIcon },
  { key: 'favorites', label: 'Избранное', icon: favoriteIcon },
  { key: 'skills', label: 'Мои навыки', icon: skillsIcon },
  { key: 'profile', label: 'Личные данные', icon: userIcon },
] as const;

type ProfileTabKey = (typeof profileTabs)[number]['key'];

const GENDER_OPTIONS = [
  { value: 'женский', label: 'Женский' },
  { value: 'мужской', label: 'Мужской' },
] as const;

const requestStatusMap: Record<string, string> = {
  pending: 'Ожидает',
  accepted: 'Принята',
  rejected: 'Отклонена',
  cancelled: 'Отменена',
};

export default function ProfilePage() {
  const { user, isAuth, isLoading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('profile');
  const [cities, setCities] = useState<string[]>([]);

  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'женский' | 'мужской'>('женский');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteUsers] = useState<User[]>([]); // ← исправлено: User[] вместо any[]
  const [isFavoritesLoading] = useState(false);

  const userRequests = user ? getRequestsByUser(user.id) : [];
  const skillsToLearn = user?.skills?.slice(0, 10) || [];

  useEffect(() => {
    const loadCities = async () => {
      const citiesList = await fetchCities();
      setCities(citiesList);
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? '');
      setName(user.name ?? '');
      setBirthDate(user.birthDate ?? '');
      setGender(user.gender ?? 'женский');
      setCity(user.city ?? '');
      setAbout(user.about ?? '');
    }
  }, [user]);

  if (isLoading) {
    return <div className={styles['profile-state']}>Загрузка профиля...</div>;
  }

  if (!isAuth || !user) {
    return (
      <div className={styles['profile-state']}>
        Пожалуйста, войдите в аккаунт
      </div>
    );
  }

  const hasChanges = () => {
    if (!user) return false;
    return (
      email !== (user.email ?? '') ||
      name !== (user.name ?? '') ||
      birthDate !== (user.birthDate ?? '') ||
      gender !== (user.gender ?? 'женский') ||
      city !== (user.city ?? '') ||
      about !== (user.about ?? '')
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges() || isSaving) return;

    setIsSaving(true);
    const nextUser = {
      ...user,
      email: email.trim(),
      name: name.trim(),
      birthDate: birthDate.trim(),
      gender,
      city: city.trim() || undefined,
      about: about.trim() || undefined,
    };

    updateUser(nextUser);
    await updateUserProfileInMockDb(user.id, {
      email: nextUser.email,
      name: nextUser.name,
      birthDate: nextUser.birthDate,
      gender: nextUser.gender,
      city: nextUser.city,
      about: nextUser.about,
    });
    setIsSaving(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form className={styles['profile-form']} onSubmit={handleSave}>
            <div className={styles.field}>
              <span className={styles.label}>Почта</span>
              <span className={styles['input-wrap']}>
                <input
                  type="email"
                  className={`${styles['input-control']} ${styles['input-with-icon']}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Не указано"
                />
                <img
                  className={styles['field-icon-edit']}
                  src={editIcon}
                  alt=""
                />
              </span>
            </div>

            <button type="button" className={styles['password-link']}>
              Изменить пароль
            </button>

            <div className={styles.field}>
              <span className={styles.label}>Имя</span>
              <span className={styles['input-wrap']}>
                <input
                  type="text"
                  className={`${styles['input-control']} ${styles['input-with-icon']}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Не указано"
                />
                <img
                  className={styles['field-icon-edit']}
                  src={editIcon}
                  alt=""
                />
              </span>
            </div>

            <div className={styles['field-row']}>
              <div className={styles.field}>
                <span className={styles.label}>Дата рождения</span>
                <span className={styles['input-wrap']}>
                  <input
                    type="text"
                    className={`${styles['input-control']} ${styles['input-with-icon']}`}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="ДД.ММ.ГГГГ"
                  />
                  <img
                    className={styles['field-icon-calendar']}
                    src={calendarIcon}
                    alt=""
                  />
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Пол</span>
                <span className={styles['select-wrap']}>
                  <select
                    className={styles['select-control']}
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as 'женский' | 'мужской')
                    }
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <img
                    className={styles['field-arrow']}
                    src={chevronDownIcon}
                    alt=""
                  />
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Город</span>
              <span className={styles['select-wrap']}>
                <select
                  className={styles['select-control']}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Не указано</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <img
                  className={styles['field-arrow']}
                  src={chevronDownIcon}
                  alt=""
                />
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>О себе</span>
              <span className={styles['input-wrap']}>
                <textarea
                  className={`${styles['textarea-control']} ${styles['input-with-icon']}`}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Не указано"
                  rows={4}
                />
                <img
                  className={styles['field-icon-edit']}
                  src={editIcon}
                  alt=""
                />
              </span>
              <div className={styles['char-counter']}>{about.length}/500</div>
            </div>

            <button
              type="submit"
              className={styles['save-button']}
              disabled={!hasChanges() || isSaving}
            >
              Сохранить
            </button>
          </form>
        );

      case 'skills':
        return (
          <div className={styles['skills-section']}>
            <div className={styles['skills-block']}>
              <h2 className={styles['skills-title']}>Может научить</h2>
              <div className={styles['skills-list']}>
                {user.skillCanTeach ? (
                  <TagUI
                    variant={getCategoryVariant(user.skillCanTeach.categoryId)}
                  >
                    {user.skillCanTeach.name}
                  </TagUI>
                ) : (
                  <p className={styles['skills-empty']}>Не указано</p>
                )}
              </div>
            </div>

            <div className={styles['skills-block']}>
              <h2 className={styles['skills-title']}>Хочет научиться</h2>
              <div className={styles['skills-list']}>
                {skillsToLearn.length > 0 ? (
                  skillsToLearn.map((skillId) => (
                    <TagUI key={skillId} variant="other">
                      {skillId}
                    </TagUI>
                  ))
                ) : (
                  <p className={styles['skills-empty']}>Не указано</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className={styles['requests-section']}>
            {userRequests.length === 0 ? (
              <p className={styles['requests-empty']}>
                У вас пока нет заявок на обмен
              </p>
            ) : (
              <div className={styles['requests-list']}>
                {userRequests.map((request) => (
                  <div key={request.id} className={styles['request-card']}>
                    <div className={styles['request-header']}>
                      <span className={styles['request-skill']}>
                        Навык: {request.skillId}
                      </span>
                      <span
                        className={`${styles['request-status']} ${styles[`request-status-${request.status}`]}`}
                      >
                        {requestStatusMap[request.status] || request.status}
                      </span>
                    </div>
                    <div className={styles['request-info']}>
                      <p>
                        {request.fromUserId === user.id
                          ? `Вы отправили заявку пользователю ${request.toUserId.slice(0, 8)}...`
                          : `Пользователь ${request.fromUserId.slice(0, 8)}... отправил вам заявку`}
                      </p>
                    </div>
                    <div className={styles['request-date']}>
                      {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'favorites': {
        if (isFavoritesLoading) {
          return (
            <div className={styles['favorites-content']}>
              <h2 className={styles['favorites-title']}>Избранное</h2>
              <p className={styles.loading}>Загрузка избранного...</p>
            </div>
          );
        }

        if (favoriteUsers.length === 0) {
          return (
            <div className={styles['favorites-content']}>
              <h2 className={styles['favorites-title']}>Избранное</h2>
              <p className={styles['favorites-empty']}>
                Вы еще не добавили карточки в избранное.
              </p>
            </div>
          );
        }

        return (
          <div className={styles['favorites-content']}>
            <h2 className={styles['favorites-title']}>Избранное</h2>
            <div className={styles['favorites-grid']}>
              {/* Здесь будут карточки избранных пользователей */}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={styles['profile-page']}>
      <aside className={styles['sidebar-shell']} aria-label="Навигация профиля">
        <div className={styles.sidebar}>
          <ul className={styles['sidebar-list']}>
            {profileTabs.map((tab) => (
              <li key={tab.label}>
                <button
                  type="button"
                  className={`${styles['sidebar-item']} ${activeTab === tab.key ? styles['sidebar-item-active'] : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <img
                    className={styles['sidebar-item-icon']}
                    src={tab.icon}
                    alt=""
                  />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className={styles.content}>
        {renderContent()}

        <div>
          <Avatar src={`/avatars/${user.avatar}`} name={user.name} size="lg" />
        </div>
      </div>
    </div>
  );
}
