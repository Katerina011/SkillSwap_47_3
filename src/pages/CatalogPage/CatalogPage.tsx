import { useState } from 'react';
import styles from './CatalogPage.module.css';
import chevronRight from '../../assets/images/chevron-right.svg';
import skillsData from '../../../public/db/skills.json';

const sections = ['Популярное', 'Новое', 'Рекомендуем'];
const cards = [1, 2, 3];

export default function CatalogPage() {
  const [filters, setFilters] = useState({
    categoryId: 'all',
    mode: 'all',
  });
  return (
    <div className={styles.catalogPage} aria-label="Страница каталога">
      <aside className={styles.filtersZone} aria-label="Фильтры каталога">
        <h1 className={styles.pageTitle}>Каркас</h1>
        <div className={styles.filtersCard}>
          <p className={styles.filtersTitle}>Фильтры</p>
          <div className={styles.filterGroup}>
            <label htmlFor="category-select" className={styles.filterLabel}>
              Категория
              <select
                id="category-select"
                className={styles.selectInput}
                value={filters.categoryId}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
              >
                <option value="all">Все категории</option>
                {skillsData.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel} id="mode-group-label">
              Режим
            </span>
            <div
              className={styles.radioGroup}
              role="radiogroup"
              aria-labelledby="mode-group-label"
            >
              <label htmlFor="mode-all" className={styles.radioLabel}>
                <input
                  id="mode-all"
                  type="radio"
                  name="mode"
                  value="all"
                  checked={filters.mode === 'all'}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mode: e.target.value }))
                  }
                />
                Все
              </label>
              <label htmlFor="mode-teach" className={styles.radioLabel}>
                <input
                  id="mode-teach"
                  type="radio"
                  name="mode"
                  value="teach"
                  checked={filters.mode === 'teach'}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mode: e.target.value }))
                  }
                />
                Учу
              </label>
              <label htmlFor="mode-learn" className={styles.radioLabel}>
                <input
                  id="mode-learn"
                  type="radio"
                  name="mode"
                  value="learn"
                  checked={filters.mode === 'learn'}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mode: e.target.value }))
                  }
                />
                Учусь
              </label>
            </div>
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
