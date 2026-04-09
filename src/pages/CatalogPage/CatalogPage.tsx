import styles from './CatalogPage.module.css';
import chevronRight from '../../assets/images/chevron-right.svg';

const sections = ['Популярное', 'Новое', 'Рекомендуем'];
const cards = [1, 2, 3];

export default function CatalogPage() {
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
        {sections.map((section) => (
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
                {cards.map((card) => (
                  <article
                    key={`${section}-${card}`}
                    className={styles.mockCard}
                  >
                    <div className={styles.mockImage} />
                    <h3 className={styles.mockTitle}>Карточка навыка</h3>
                    <p className={styles.mockText}>
                      Временный контент для вёрстки V-01
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
