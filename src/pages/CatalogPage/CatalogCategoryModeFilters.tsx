import { useEffect, useState } from 'react';
import type { CatalogFilters, CatalogFilterMode } from '../../features/catalog';
import type { Category } from '../../entities/skill/model/types';
import chevronDown from '../../assets/images/chevron-down.svg';
import styles from './CatalogPage.module.css';

type Props = {
  categories: Category[];
  filters: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
};

const MODE_OPTIONS: { value: CatalogFilterMode; label: string }[] = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
];

const CATEGORIES_COLLAPSED_COUNT = 5;

export function CatalogCategoryModeFilters({
  categories,
  filters,
  onChange,
}: Props) {
  const [categoriesListExpanded, setCategoriesListExpanded] = useState(false);

  useEffect(() => {
    if (filters.categoryId === 'all') return;
    const idx = categories.findIndex((c) => c.id === filters.categoryId);
    if (idx >= CATEGORIES_COLLAPSED_COUNT) {
      setCategoriesListExpanded(true);
    }
  }, [filters.categoryId, categories]);

  const visibleCategoryCount = categoriesListExpanded
    ? categories.length
    : Math.min(CATEGORIES_COLLAPSED_COUNT, categories.length);
  const visibleCategories = categories.slice(0, visibleCategoryCount);
  const hasMoreCategories = categories.length > CATEGORIES_COLLAPSED_COUNT;

  return (
    <>
      <div className={styles.filterBlock}>
        <fieldset className={styles.modeFieldset}>
          <legend className={styles.filterLegend}>Режим</legend>
          <div className={styles.radioGroup}>
            {MODE_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className={styles.radioLabel}
                htmlFor={`catalog-mode-${value}`}
              >
                <input
                  id={`catalog-mode-${value}`}
                  type="radio"
                  name="catalog-skill-mode"
                  value={value}
                  checked={filters.mode === value}
                  onChange={() => onChange({ ...filters, mode: value })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.filterBlock}>
        <h3 className={styles.filterBlockTitle}>Навыки</h3>
        <div className={styles.filterCheckboxList}>
          {visibleCategories.map((cat) => (
            <div key={cat.id} className={styles.categoryFilterBlock}>
              <label
                className={styles.filterCheckboxRow}
                htmlFor={`catalog-category-${cat.id}`}
              >
                <input
                  id={`catalog-category-${cat.id}`}
                  className={styles.filterInputVisuallyHidden}
                  type="checkbox"
                  checked={filters.categoryId === cat.id}
                  onChange={() =>
                    onChange(
                      filters.categoryId === cat.id
                        ? {
                            ...filters,
                            categoryId: 'all',
                            subcategoryId: 'all',
                          }
                        : {
                            ...filters,
                            categoryId: cat.id,
                            subcategoryId: 'all',
                          },
                    )
                  }
                />
                <span
                  className={`${styles.filterSkillMark} ${styles.filterMarkCategory}`}
                  aria-hidden
                />
                <span>{cat.name}</span>
              </label>
              {filters.categoryId === cat.id && cat.subcategory.length > 0 ? (
                <div
                  className={styles.subcategoryNested}
                  role="group"
                  aria-label={`Подкатегории: ${cat.name}`}
                >
                  <label
                    className={styles.filterCheckboxRow}
                    htmlFor={`catalog-subcat-all-${cat.id}`}
                  >
                    <input
                      id={`catalog-subcat-all-${cat.id}`}
                      className={styles.filterInputVisuallyHidden}
                      type="radio"
                      name="catalog-subcategory-filter"
                      checked={filters.subcategoryId === 'all'}
                      onChange={() =>
                        onChange({
                          ...filters,
                          categoryId: cat.id,
                          subcategoryId: 'all',
                        })
                      }
                    />
                    <span
                      className={`${styles.filterSkillMark} ${styles.filterMarkSubcategory}`}
                      aria-hidden
                    />
                    <span>Вся категория</span>
                  </label>
                  {cat.subcategory.map((sub) => (
                    <label
                      key={sub.id}
                      className={styles.filterCheckboxRow}
                      htmlFor={`catalog-subcat-${sub.id}`}
                    >
                      <input
                        id={`catalog-subcat-${sub.id}`}
                        className={styles.filterInputVisuallyHidden}
                        type="radio"
                        name="catalog-subcategory-filter"
                        checked={filters.subcategoryId === sub.id}
                        onChange={() =>
                          onChange({
                            ...filters,
                            categoryId: cat.id,
                            subcategoryId: sub.id,
                          })
                        }
                      />
                      <span
                        className={`${styles.filterSkillMark} ${styles.filterMarkSubcategory}`}
                        aria-hidden
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {hasMoreCategories ? (
          <button
            type="button"
            className={styles.cityClearButton}
            aria-expanded={categoriesListExpanded}
            aria-label={
              categoriesListExpanded
                ? 'Свернуть список категорий'
                : 'Показать все категории'
            }
            onClick={() => setCategoriesListExpanded((expanded) => !expanded)}
          >
            Все категории
            <img
              src={chevronDown}
              alt=""
              aria-hidden="true"
              className={
                categoriesListExpanded
                  ? styles.cityToggleChevronExpanded
                  : undefined
              }
            />
          </button>
        ) : null}
      </div>
    </>
  );
}
