import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import type { CatalogFacetApply } from '../../app/catalogOutletContext';
import type { AllSkillsPanelCategory } from '../../features/catalog/lib/mapSkillsToPanelCategories';
import styles from './AllSkillsPanel.module.css';

export type AllSkillsPanelProps = {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  categories: AllSkillsPanelCategory[];
  loading: boolean;
  error: string | null;
  onApplyCatalogFacet?: (facet: CatalogFacetApply) => void;
};

export function AllSkillsPanel({
  isOpen,
  isClosing,
  onClose,
  categories,
  loading,
  error,
  onApplyCatalogFacet,
}: AllSkillsPanelProps) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const applyFacet = (facet: CatalogFacetApply) => {
    onApplyCatalogFacet?.(facet);
    onClose();
  };

  return createPortal(
    <div
      className={`${styles.root} ${isClosing ? styles['root-closing'] : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть панель навыков"
        onClick={onClose}
      />
      <div
        className={`${styles.panel} ${isClosing ? styles['panel-closing'] : ''}`}
        role="dialog"
        aria-label="Все навыки по категориям"
      >
        {loading && (
          <div className={styles.loader}>
            <div className={styles.spinner} aria-hidden />
            <p className={styles['loader-text']}>Идёт загрузка навыков…</p>
          </div>
        )}

        {!loading && error && (
          <p className={styles.error}>Ошибка загрузки: {error}</p>
        )}

        {!loading && !error && (
          <div className={styles.categories}>
            {categories.map((category) => (
              <div key={category.categoryId} className={styles.category}>
                <button
                  type="button"
                  className={styles['category-select']}
                  aria-label={`Фильтр каталога: категория «${category.title}», все подкатегории`}
                  onClick={() =>
                    applyFacet({
                      categoryId: category.categoryId,
                      subcategoryId: 'all',
                    })
                  }
                >
                  <span className={styles['category-icon']} aria-hidden>
                    {category.iconLabel}
                  </span>
                  <span className={styles['category-title']}>
                    {category.title}
                  </span>
                </button>
                <ul className={styles['skills-list']}>
                  <li className={styles['skill-row']}>
                    <button
                      type="button"
                      className={styles['skill-select']}
                      aria-label={`Фильтр: ${category.title}, вся категория`}
                      onClick={() =>
                        applyFacet({
                          categoryId: category.categoryId,
                          subcategoryId: 'all',
                        })
                      }
                    >
                      Вся категория
                    </button>
                  </li>
                  {category.subcategories.map((s) => (
                    <li key={s.id} className={styles['skill-row']}>
                      <button
                        type="button"
                        className={styles['skill-select']}
                        aria-label={`Фильтр: ${category.title}, ${s.name}`}
                        onClick={() =>
                          applyFacet({
                            categoryId: category.categoryId,
                            subcategoryId: s.id,
                          })
                        }
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
