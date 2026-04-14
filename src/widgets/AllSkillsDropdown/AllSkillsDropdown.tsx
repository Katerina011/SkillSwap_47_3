import { useCallback, useEffect, useRef, useState } from 'react';
import type { CatalogFacetApply } from '../../app/catalogOutletContext';
import { getAllSkills } from '../../api/endpoints/skillsApi';
import {
  mapSkillsToPanelCategories,
  type AllSkillsPanelCategory,
} from '../../features/catalog/lib/mapSkillsToPanelCategories';
import { AllSkillsPanel } from './AllSkillsPanel';
import styles from './AllSkillsDropdown.module.css';

const CLOSE_ANIM_MS = 200;

export type AllSkillsDropdownProps = {
  onApplyCatalogFacet?: (facet: CatalogFacetApply) => void;
};

export function AllSkillsDropdown({
  onApplyCatalogFacet,
}: AllSkillsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AllSkillsPanelCategory[]>([]);
  const cacheRef = useRef<AllSkillsPanelCategory[] | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleClose = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, CLOSE_ANIM_MS);
  }, [isOpen, isClosing]);

  const handleToggle = () => {
    if (isOpen && !isClosing) {
      handleClose();
      return;
    }
    if (isClosing) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen || isClosing) return undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isClosing, handleClose]);

  useEffect(() => {
    if (!isOpen || isClosing) {
      return undefined;
    }
    if (cacheRef.current !== null) {
      setCategories(cacheRef.current);
      setError(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllSkills()
      .then((data) => {
        if (cancelled) return;
        const mapped = mapSkillsToPanelCategories(data);
        cacheRef.current = mapped;
        setCategories(mapped);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : 'Не удалось загрузить навыки',
        );
        setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, isClosing]);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [],
  );

  const open = isOpen && !isClosing;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles['trigger-open'] : ''}`}
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={styles['button-text']}>Все навыки</span>
        <svg
          className={`${styles.arrow} ${open ? styles['arrow-rotated'] : ''}`}
          width="16"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AllSkillsPanel
        isOpen={isOpen}
        isClosing={isClosing}
        onClose={handleClose}
        categories={categories}
        loading={loading}
        error={error}
        onApplyCatalogFacet={onApplyCatalogFacet}
      />
    </div>
  );
}
