import { useEffect, useMemo, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { format, isValid, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  getAllUsers,
  updateUserProfileInMockDb,
} from '../../api/endpoints/usersApi';
import { fetchCities } from '../../api/endpoints/citiesApi';
import {
  getAllSkills,
  type SkillsResponse,
} from '../../api/endpoints/skillsApi';
import requestIcon from '../../assets/images/request.svg';
import messageIcon from '../../assets/images/message-text.svg';
import favoriteIcon from '../../assets/images/like.svg';
import skillsIcon from '../../assets/images/idea.svg';
import userIcon from '../../assets/images/user.svg';
import editIcon from '../../assets/images/edit.png';
import calendarIcon from '../../assets/images/calendar.svg';
import chevronDownIcon from '../../assets/images/chevron-down.svg';
import { useAuth } from '../../shared/hooks/useAuth';
import type { User } from '../../entities/user/model/types';
import type { CatalogItem } from '../../features/catalog/model/types';
import { buildCatalogItems } from '../../features/catalog/utils/buildCatalogItems';
import { useFavorites } from '../../features/favorites/hooks/useFavorites';
import { CatalogCard } from '../../widgets/CatalogCard';
import { UserProfileHeader } from '../../widgets/UserProfileHeader/UserProfileHeader';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';
import styles from './ProfilePage.module.css';

const profileTabs = [
  { key: 'requests', label: 'Заявки', icon: requestIcon },
  { key: 'exchanges', label: 'Мои обмены', icon: messageIcon },
  { key: 'favorites', label: 'Избранное', icon: favoriteIcon },
  { key: 'skills', label: 'Мои навыки', icon: skillsIcon },
  { key: 'profile', label: 'Личные данные', icon: userIcon },
] as const;

type ProfileTabKey = (typeof profileTabs)[number]['key'];

const DEFAULT_TEXT = 'Не указано';
const GENDER_OPTIONS = [
  { value: 'женский', label: 'Женский' },
  { value: 'мужской', label: 'Мужской' },
] as const;

type ProfileValidationErrors = {
  email?: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  city?: string;
  about?: string;
};

type ProfileFormData = {
  email: string;
  name: string;
  birthDate: string;
  gender: 'женский' | 'мужской';
  city: string;
  about: string;
};

function validateBirthDate(
  value: string | null | undefined,
): string | undefined {
  const normalizedValue = typeof value === 'string' ? value : '';
  if (!normalizedValue.trim()) return 'Укажите дату рождения';
  const match = normalizedValue.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return 'Формат даты: дд.мм.гггг';

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDate) return 'Укажите корректную дату';
  return undefined;
}

function parseBirthDateForPicker(value: string): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = parse(value, 'dd.MM.yyyy', new Date());
  return isValid(parsed) ? parsed : null;
}

function getClickCount(event: unknown): number {
  if (!event || typeof event !== 'object') return 0;
  const directDetail = (event as { detail?: unknown }).detail;
  if (typeof directDetail === 'number') return directDetail;
  const { nativeEvent } = event as { nativeEvent?: { detail?: unknown } };
  return typeof nativeEvent?.detail === 'number' ? nativeEvent.detail : 0;
}

type DatePickerInputEvent =
  | ReactMouseEvent<HTMLElement>
  | ReactKeyboardEvent<HTMLElement>;

function validateProfileForm(data: ProfileFormData): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Укажите email';
  }

  if (!data.name.trim()) {
    errors.name = 'Укажите имя';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Имя должно быть не короче 2 символов';
  }

  errors.birthDate = validateBirthDate(data.birthDate);

  if (!data.gender) {
    errors.gender = 'Укажите пол';
  }

  if (!data.city.trim()) {
    errors.city = 'Выберите город';
  }

  if (data.about.trim().length > 500) {
    errors.about = 'Описание должно быть не более 500 символов';
  }

  return errors;
}

function isProfileFormValid(errors: ProfileValidationErrors): boolean {
  return !Object.values(errors).some(Boolean);
}

export default function ProfilePage() {
  const { user, isAuth, isLoading, updateUser } = useAuth();
  const { getFavoritesFromItems, isLoading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('profile');
  const [cities, setCities] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<SkillsResponse | null>(null);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [isFavoritesSourcesLoading, setIsFavoritesSourcesLoading] =
    useState(false);
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
  const [birthDateDraft, setBirthDateDraft] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'женский' | 'мужской'>('женский');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] =
    useState<ProfileValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuth) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuth, isLoading, navigate, location]);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? '');
    setName(user.name ?? '');
    setBirthDate(user.birthDate ?? '');
    setGender(user.gender ?? 'женский');
    setCity(user.city ?? '');
    setAbout(user.about ?? '');
  }, [user]);

  useEffect(() => {
    const loadCities = async () => {
      const nextCities = await fetchCities();
      setCities(nextCities);
    };

    loadCities().catch(() => setCities([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadFavoritesSources = async () => {
      if (activeTab !== 'favorites') return;
      try {
        setIsFavoritesSourcesLoading(true);
        setFavoritesError(null);
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
          setFavoritesError(
            'Не удалось загрузить избранное. Попробуйте обновить страницу.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsFavoritesSourcesLoading(false);
        }
      }
    };

    loadFavoritesSources();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    const errors = validateProfileForm({
      email,
      name,
      birthDate,
      gender,
      city,
      about,
    });
    setValidationErrors(errors);
  }, [email, name, birthDate, gender, city, about]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      email.trim() !== (user.email ?? '') ||
      name.trim() !== (user.name ?? '') ||
      birthDate.trim() !== (user.birthDate ?? '') ||
      gender !== (user.gender ?? 'женский') ||
      city.trim() !== (user.city ?? '') ||
      about.trim() !== (user.about ?? '')
    );
  }, [email, name, birthDate, gender, city, about, user]);

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
      const author = usersById.get(item.authorId);
      if (!author) return;
      seen.add(item.authorId);
      out.push(author);
    });
    return out;
  }, [favoriteItems, usersById]);

  if (isLoading) {
    return <div className={styles['profile-state']}>Загрузка профиля...</div>;
  }

  if (!isAuth || !user) {
    return null;
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      email: true,
      name: true,
      birthDate: true,
      gender: true,
      city: true,
      about: true,
    });
    if (!hasChanges || isSaving || !isProfileFormValid(validationErrors))
      return;

    setIsSaving(true);

    const nextUser = {
      ...user,
      email: email.trim() || user.email,
      name: name.trim() || user.name,
      birthDate: birthDate.trim() || user.birthDate,
      gender,
      city: city.trim() || undefined,
      about: about.trim() || undefined,
    };

    updateUser(nextUser);
    updateUserProfileInMockDb(user.id, {
      email: nextUser.email,
      name: nextUser.name,
      birthDate: nextUser.birthDate,
      gender: nextUser.gender,
      city: nextUser.city,
      about: nextUser.about,
    });
    setIsSaving(false);
  };

  const isSaveDisabled =
    !hasChanges || isSaving || !isProfileFormValid(validationErrors);

  const handleBirthDatePickerOpen = () => {
    setBirthDateDraft(parseBirthDateForPicker(birthDate));
    setIsBirthDatePickerOpen(true);
  };

  const handleBirthDateCancel = () => {
    setBirthDateDraft(parseBirthDateForPicker(birthDate));
    setIsBirthDatePickerOpen(false);
  };

  const handleBirthDateApply = () => {
    setBirthDate(birthDateDraft ? format(birthDateDraft, 'dd.MM.yyyy') : '');
    setIsBirthDatePickerOpen(false);
    setTouched((prev) => ({ ...prev, birthDate: true }));
  };

  return (
    <div className={styles['profile-page']}>
      <aside className={styles['sidebar-shell']} aria-label="Навигация профиля">
        <div className={styles.sidebar}>
          <ul className={styles['sidebar-list']}>
            {profileTabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <li key={tab.label}>
                  <button
                    type="button"
                    className={`${styles['sidebar-item']} ${isActive ? styles['sidebar-item-active'] : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <img
                      className={styles['sidebar-item-icon']}
                      src={tab.icon}
                      alt=""
                      aria-hidden="true"
                    />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <section className={styles.content} aria-label="Личные данные">
        {activeTab === 'profile' ? (
          <>
            <form className={styles['profile-form']} onSubmit={handleSave}>
              <div className={styles.field}>
                <span className={styles.label}>Почта</span>
                <span className={styles['input-wrap']}>
                  <input
                    id="profile-email"
                    type="email"
                    className={`${styles['input-control']} ${styles['input-with-icon']} ${
                      touched.email && validationErrors.email
                        ? styles['input-error']
                        : ''
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, email: true }))
                    }
                    placeholder={DEFAULT_TEXT}
                  />
                  <img
                    className={styles['field-icon-edit']}
                    src={editIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                {touched.email && validationErrors.email && (
                  <div className={styles['error-message']}>
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <button type="button" className={styles['password-link']}>
                Изменить пароль
              </button>

              <div className={styles.field}>
                <span className={styles.label}>Имя</span>
                <span className={styles['input-wrap']}>
                  <input
                    id="profile-name"
                    type="text"
                    className={`${styles['input-control']} ${styles['input-with-icon']} ${
                      touched.name && validationErrors.name
                        ? styles['input-error']
                        : ''
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, name: true }))
                    }
                    placeholder={DEFAULT_TEXT}
                  />
                  <img
                    className={styles['field-icon-edit']}
                    src={editIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                {touched.name && validationErrors.name && (
                  <div className={styles['error-message']}>
                    {validationErrors.name}
                  </div>
                )}
              </div>

              <div className={styles['field-row']}>
                <div className={styles.field}>
                  <span className={styles.label}>Дата рождения</span>
                  <span className={styles['input-wrap']}>
                    <DatePicker
                      id="profile-birth-date"
                      className={`${styles['input-control']} ${styles['input-with-icon']} ${
                        touched.birthDate && validationErrors.birthDate
                          ? styles['input-error']
                          : ''
                      }`}
                      selected={
                        isBirthDatePickerOpen
                          ? birthDateDraft
                          : parseBirthDateForPicker(birthDate)
                      }
                      open={isBirthDatePickerOpen}
                      onInputClick={handleBirthDatePickerOpen}
                      onClickOutside={() => setIsBirthDatePickerOpen(false)}
                      onChange={(
                        date: Date | null,
                        event?: DatePickerInputEvent,
                      ) => {
                        setBirthDateDraft(date);
                        if (getClickCount(event) === 2) {
                          setBirthDate(date ? format(date, 'dd.MM.yyyy') : '');
                          setIsBirthDatePickerOpen(false);
                          setTouched((prev) => ({ ...prev, birthDate: true }));
                        }
                      }}
                      onChangeRaw={(event?: DatePickerInputEvent) => {
                        const nextValue =
                          event?.target instanceof HTMLInputElement
                            ? event.target.value
                            : '';
                        setBirthDate(nextValue);
                      }}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, birthDate: true }))
                      }
                      dateFormat="dd.MM.yyyy"
                      placeholderText={DEFAULT_TEXT}
                      locale={ru}
                      calendarClassName="ss-datepicker-calendar"
                      popperClassName="ss-datepicker-popper"
                      popperPlacement="bottom-start"
                      shouldCloseOnSelect={false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      yearDropdownItemNumber={90}
                      scrollableYearDropdown
                      // eslint-disable-next-line react/no-unstable-nested-components
                      calendarContainer={({ className, children }) => (
                        <div className={`${className} ss-datepicker-shell`}>
                          {children}
                          <div className="ss-datepicker-actions">
                            <button
                              type="button"
                              className="ss-datepicker-cancel"
                              onClick={handleBirthDateCancel}
                            >
                              Отменить
                            </button>
                            <button
                              type="button"
                              className="ss-datepicker-apply"
                              onClick={handleBirthDateApply}
                            >
                              Выбрать
                            </button>
                          </div>
                        </div>
                      )}
                      showPopperArrow={false}
                    />
                    <img
                      className={styles['field-icon-calendar']}
                      src={calendarIcon}
                      alt=""
                      aria-hidden="true"
                    />
                  </span>
                  {touched.birthDate && validationErrors.birthDate && (
                    <div className={styles['error-message']}>
                      {validationErrors.birthDate}
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Пол</span>
                  <span className={styles['select-wrap']}>
                    <select
                      id="profile-gender"
                      className={`${styles['select-control']} ${
                        touched.gender && validationErrors.gender
                          ? styles['input-error']
                          : ''
                      }`}
                      value={gender}
                      onChange={(e) =>
                        setGender(e.target.value as 'женский' | 'мужской')
                      }
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, gender: true }))
                      }
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <img
                      className={styles['field-arrow']}
                      src={chevronDownIcon}
                      alt=""
                      aria-hidden="true"
                    />
                  </span>
                  {touched.gender && validationErrors.gender && (
                    <div className={styles['error-message']}>
                      {validationErrors.gender}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Город</span>
                <span className={styles['select-wrap']}>
                  <select
                    id="profile-city"
                    className={`${styles['select-control']} ${
                      touched.city && validationErrors.city
                        ? styles['input-error']
                        : ''
                    }`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, city: true }))
                    }
                  >
                    <option value="">{DEFAULT_TEXT}</option>
                    {cities.map((cityOption) => (
                      <option key={cityOption} value={cityOption}>
                        {cityOption}
                      </option>
                    ))}
                  </select>
                  <img
                    className={styles['field-arrow']}
                    src={chevronDownIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                {touched.city && validationErrors.city && (
                  <div className={styles['error-message']}>
                    {validationErrors.city}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.label}>О себе</span>
                <span className={styles['input-wrap']}>
                  <textarea
                    id="profile-about"
                    className={`${styles['textarea-control']} ${styles['input-with-icon']} ${
                      touched.about && validationErrors.about
                        ? styles['input-error']
                        : ''
                    }`}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, about: true }))
                    }
                    placeholder={DEFAULT_TEXT}
                    rows={4}
                  />
                  <img
                    className={`${styles['field-icon-edit']} ${styles['field-icon-edit-textarea']}`}
                    src={editIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                <div className={styles['char-counter']}>{about.length}/500</div>
                {touched.about && validationErrors.about && (
                  <div className={styles['error-message']}>
                    {validationErrors.about}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={styles['save-button']}
                disabled={isSaveDisabled}
              >
                Сохранить
              </button>
            </form>

            <UserProfileHeader name={user.name || 'П'} />
          </>
        ) : null}

        {activeTab === 'favorites' ? (
          <div className={styles['favorites-content']}>
            <h2 className={styles['favorites-title']}>Избранное</h2>
            {isFavoritesSourcesLoading || favoritesLoading ? (
              <p className={styles.loading}>Загрузка избранного...</p>
            ) : null}
            {!isFavoritesSourcesLoading &&
            !favoritesLoading &&
            favoritesError ? (
              <p className={styles['favorites-error']}>{favoritesError}</p>
            ) : null}
            {!isFavoritesSourcesLoading &&
            !favoritesLoading &&
            !favoritesError &&
            favoriteUsers.length === 0 ? (
              <p className={styles['favorites-empty']}>
                Вы еще не добавили карточки в избранное.
              </p>
            ) : null}
            {!isFavoritesSourcesLoading &&
            !favoritesLoading &&
            !favoritesError &&
            favoriteUsers.length > 0 ? (
              <div className={styles['favorites-grid']}>
                {favoriteUsers.map((favoriteUser) => (
                  <CatalogCard
                    key={favoriteUser.id}
                    user={favoriteUser}
                    skills={skills}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab !== 'profile' && activeTab !== 'favorites' ? (
          <NotFoundPage />
        ) : null}
      </section>
    </div>
  );
}
