import styles from './CatalogPage.module.css';
import chevronRight from '../../assets/images/chevron-right.svg';
import { CatalogCard } from '../../widgets/CatalogCard';
import { catalogItemFixtures } from '../../features/catalog';
import { useCatalogSources } from '../../features/catalog/hooks/useCatalogSources'

const sections = ['Популярное', 'Новое', 'Рекомендуем'];

export default function CatalogPage() {
  const { users, skills, loading, error } = useCatalogSources();

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingState}>
          Загрузка...
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <p>Ошибка: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
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

  return (
    <div className={styles.catalogPage} aria-label="Страница каталога">
      <aside className={styles.filtersZone} aria-label="Фильтры каталога">
        <h1 className={styles.pageTitle}>Каркас</h1>
        <div className={styles.filtersCard}>
          <p className={styles.filtersTitle}>Фильтры</p>
          <div className={styles.filterRow}>
            <span>Категория</span>
            <span className={styles.filterPlaceholder}>Все</span>
          </div>
          <div className={styles.filterRow}>
            <span>Режим</span>
            <span className={styles.filterPlaceholder}>Все</span>
          </div>
          <div className={styles.filterRow}>
            <span>Поиск</span>
            <span className={styles.filterPlaceholder}>Искать навык</span>
          </div>
        </div>
      </aside>

      <div className={styles.contentZone}>
        {renderContent()}
      </div>
    </div>
  );
}
