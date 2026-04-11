import styles from './CatalogPage.module.css';
import chevronRight from '../../assets/images/chevron-right.svg';
import { CatalogCard } from '../../widgets/CatalogCard';
import { useCatalogSources } from '../../features/catalog/hooks/useCatalogSources';
import chevronDown from '../../assets/images/chevron-down.svg';
import { CatalogFiltersPanel } from './CatalogFiltersPanel';

const sections = ['Популярное', 'Новое', 'Рекомендуем'];

export default function CatalogPage() {
  const { users, skills, loading, error } = useCatalogSources();

  const renderContent = () => {
    if (loading) {
      return <div className={styles.loadingState}>Загрузка...</div>;
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <p>Ошибка: {error}</p>
        </div>
      );
    }

    return sections.map((section) => (
      <section key={section} className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{section}</h2>
          <button className={styles.viewAllButton} type="button">
            Смотреть все
            <img src={chevronRight} alt="" aria-hidden="true" />
          </button>
        </div>
        <div className={styles.horizontalScroll}>
          <div className={styles.cardsContainer}>
            {users?.map((item) => (
              <CatalogCard key={item.id} user={item} skills={skills} />
            ))}
          </div>
        </div>
      </section>
    ));
  };
  // TODO(F-3.3-2): Добавить состояние для фильтрации
  // const [filters, setFilters] = useState<FilterState>({});

  // TODO(F-3.3-2): Добавить обработчики для onChange фильтров
  // const handleFilterChange = (key: string, value: any) => { ... };

  return (
    <div className={styles.catalogPage} aria-label="Страница каталога">
      <aside className={styles.sidebar} aria-label="Фильтры каталога">
        <CatalogFiltersPanel>
          {/* TODO(F-3.3-2): Здесь будут подключены готовые контролы фильтра:
              - RadioGroup для "Всё / Хочу научиться / Могу научить"
              - CheckboxGroup для "Навыки"
              - RadioGroup для "Пол автора"
              - CheckboxGroup для "Город"
              
              Пример интеграции:
              <FiltersComponent 
                filters={filters}
                onChange={handleFilterChange}
              />
          */}
          <div className={styles.filtersPlaceholder}>
            <h2 className={styles.filtersTitle}>Фильтры</h2>
            <div className={styles.filtersCard}>
              <div className={styles.filterRow}>
                {/* компонент radio Всё / Хочу научиться / Могу научить */}
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Навыки</h3>
                {/* список чекбоксов с навыками */}
                <a href="#0" className={styles.toggleLink}>
                  Все категории
                  <img src={chevronDown} alt="" aria-hidden="true" />
                </a>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Пол автора</h3>
                {/* компонент radio Не имеет значения / Мужской / Женский */}
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Город</h3>
                {/* список чекбоксов с городами */}
                <a href="#0" className={styles.toggleLink}>
                  Все категории
                  <img src={chevronDown} alt="" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </CatalogFiltersPanel>
      </aside>

      <div className={styles.contentZone}>{renderContent()}</div>
    </div>
  );
}
