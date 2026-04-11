import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './CatalogPage.module.css';
import chevronRight from '../../assets/images/chevron-right.svg';
import chevronDown from '../../assets/images/chevron-down.svg';
import { CatalogCategoryModeFilters } from './CatalogCategoryModeFilters';
import {
  useCatalogSources,
  filterCatalogItems,
  type CatalogFilters,
} from '../../features/catalog';
import { buildCatalogItems } from '../../features/catalog/utils/buildCatalogItems';
import type { CatalogItem } from '../../features/catalog/model/types';
import type { User } from '../../entities/user/model/types';
import type { CatalogOutletContext } from '../../app/catalogOutletContext';
import { CatalogCard } from '../../widgets/CatalogCard';
import { useOnScreen } from '../../shared/hooks/useOnScreen';

const CATALOG_LOAD_LIMIT = 20;

const SECTION_SPECS: {
  title: string;
  getRow: (authors: User[]) => User[];
}[] = [
  { title: 'Популярное', getRow: (a) => a.slice(0, 3) },
  { title: 'Новое', getRow: (a) => a.slice(3, 6) },
  { title: 'Рекомендуем', getRow: (a) => a.slice(6) },
];

const defaultFilters: CatalogFilters = {
  search: '',
  categoryId: 'all',
  subcategoryId: 'all',
  mode: 'all',
};

const CITIES_COLLAPSED_COUNT = 5;

type GenderFilter = 'any' | 'мужской' | 'женский';

function orderedUsersFromItems(items: CatalogItem[], userList: User[]): User[] {
  const map = new Map(userList.map((u) => [u.id, u]));
  const seen = new Set<string>();
  const out: User[] = [];
  items.forEach((it) => {
    if (seen.has(it.authorId)) return;
    seen.add(it.authorId);
    const u = map.get(it.authorId);
    if (u) out.push(u);
  });
  return out;
}

export default function CatalogPage() {
  const catalogCtx = useOutletContext<CatalogOutletContext | undefined>();
  const catalogSearch = catalogCtx?.catalogSearch ?? '';
  const { users, skills, loading, error } = useCatalogSources();
  const [filters, setFilters] = useState<CatalogFilters>(defaultFilters);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('any');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [citiesListExpanded, setCitiesListExpanded] = useState(false);
  const [authorDisplayLimit, setAuthorDisplayLimit] =
    useState(CATALOG_LOAD_LIMIT);
  const [setLoadSentinel, isLoadSentinelVisible] = useOnScreen();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: catalogSearch }));
  }, [catalogSearch]);

  const cityOptions = useMemo(() => {
    if (!users) return [];
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.city && u.city.trim()) set.add(u.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [users]);

  const usersFiltered = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      if (genderFilter !== 'any' && u.gender !== genderFilter) return false;
      if (
        selectedCities.length > 0 &&
        (!u.city || !selectedCities.includes(u.city))
      )
        return false;
      return true;
    });
  }, [users, genderFilter, selectedCities]);

  const allItems = useMemo(() => {
    if (!usersFiltered.length || !skills) return [];
    return buildCatalogItems(usersFiltered, skills);
  }, [usersFiltered, skills]);

  const visibleItems = useMemo(
    () => filterCatalogItems(allItems, filters),
    [allItems, filters],
  );

  const orderedAuthors = useMemo(
    () => orderedUsersFromItems(visibleItems, users ?? []),
    [visibleItems, users],
  );

  useEffect(() => {
    setAuthorDisplayLimit(Math.min(CATALOG_LOAD_LIMIT, orderedAuthors.length));
  }, [orderedAuthors]);

  const displayedAuthors = useMemo(
    () => orderedAuthors.slice(0, authorDisplayLimit),
    [orderedAuthors, authorDisplayLimit],
  );

  const hasMoreAuthors = authorDisplayLimit < orderedAuthors.length;

  useEffect(() => {
    if (!isLoadSentinelVisible || !hasMoreAuthors) return;
    setAuthorDisplayLimit((n) =>
      Math.min(n + CATALOG_LOAD_LIMIT, orderedAuthors.length),
    );
  }, [isLoadSentinelVisible, hasMoreAuthors, orderedAuthors.length]);

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  };

  const visibleCityCount = citiesListExpanded
    ? cityOptions.length
    : Math.min(CITIES_COLLAPSED_COUNT, cityOptions.length);
  const visibleCities = cityOptions.slice(0, visibleCityCount);
  const hasMoreCities = cityOptions.length > CITIES_COLLAPSED_COUNT;

  let catalogMain: ReactNode;
  if (loading) {
    catalogMain = <div className={styles.loadingState}>Загрузка...</div>;
  } else if (error) {
    catalogMain = (
      <div className={styles.errorState}>
        <p className={styles.errorText} role="alert">
          Не удалось загрузить каталог. Попробуйте обновить страницу.
        </p>
      </div>
    );
  } else {
    catalogMain = (
      <>
        {SECTION_SPECS.map(({ title, getRow }) => {
          const rowUsers = getRow(displayedAuthors);
          return (
            <section key={title} className={styles.catalogSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <button className={styles.viewAllButton} type="button">
                  Смотреть все
                  <img src={chevronRight} alt="" aria-hidden="true" />
                </button>
              </div>
              <div className={styles.horizontalScroll}>
                <div className={styles.cardsContainer}>
                  {rowUsers.length === 0 ? (
                    <p className={styles.mockText}>
                      Нет карточек по текущим фильтрам.
                    </p>
                  ) : (
                    rowUsers.map((user) => (
                      <CatalogCard
                        key={`${title}-${user.id}`}
                        user={user}
                        skills={skills}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>
          );
        })}
        <div
          ref={setLoadSentinel}
          className={styles.loadMoreSentinel}
          aria-hidden="true"
        />
      </>
    );
  }

  return (
    <div className={styles.catalogPage} aria-label="Страница каталога">
      <aside className={styles.sidebar} aria-label="Фильтры каталога">
        <div className={styles.filtersPanel}>
          <div className={styles.filtersPlaceholder}>
            <h2 className={styles.filtersTitle}>Фильтры</h2>
            <div className={styles.filtersCard}>
              {loading ? (
                <p className={styles.filterHint}>Загрузка данных…</p>
              ) : null}
              {error ? (
                <p className={styles.filterHint} role="alert">
                  Не удалось загрузить каталог. Попробуйте обновить страницу.
                </p>
              ) : null}

              {!loading && !error && skills ? (
                <CatalogCategoryModeFilters
                  categories={skills.categories}
                  filters={filters}
                  onChange={setFilters}
                />
              ) : null}

              <div className={styles.filterBlock}>
                <fieldset className={styles.modeFieldset}>
                  <legend className={styles.filterLegend}>Пол автора</legend>
                  <div className={styles.radioGroup}>
                    {(
                      [
                        ['any', 'Не имеет значения'],
                        ['мужской', 'Мужской'],
                        ['женский', 'Женский'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={styles.radioLabel}
                        htmlFor={`catalog-gender-${value}`}
                      >
                        <input
                          id={`catalog-gender-${value}`}
                          type="radio"
                          name="catalog-author-gender"
                          checked={genderFilter === value}
                          onChange={() => setGenderFilter(value)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className={styles.filterBlock}>
                <h3 className={styles.filterBlockTitle}>Город</h3>
                <div className={styles.filterCheckboxList}>
                  {visibleCities.map((city, idx) => {
                    const cityInputId = `catalog-city-${idx}`;
                    return (
                      <label
                        key={city}
                        className={styles.filterCheckboxRow}
                        htmlFor={cityInputId}
                      >
                        <input
                          id={cityInputId}
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={() => toggleCity(city)}
                        />
                        <span>{city}</span>
                      </label>
                    );
                  })}
                </div>
                {hasMoreCities ? (
                  <button
                    type="button"
                    className={styles.cityClearButton}
                    aria-expanded={citiesListExpanded}
                    aria-label={
                      citiesListExpanded
                        ? 'Свернуть список городов'
                        : 'Показать все города'
                    }
                    onClick={() =>
                      setCitiesListExpanded((expanded) => !expanded)
                    }
                  >
                    Все города
                    <img
                      src={chevronDown}
                      alt=""
                      aria-hidden="true"
                      className={
                        citiesListExpanded
                          ? styles.cityToggleChevronExpanded
                          : undefined
                      }
                    />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.contentZone}>{catalogMain}</div>
    </div>
  );
}
