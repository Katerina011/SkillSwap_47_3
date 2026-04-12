import { useEffect, useRef } from 'react';
import styles from './ExchangeModal.module.css';

export type ExchangeModalType = 'auth' | 'success' | 'request-sent';

interface ExchangeModalProps {
  isOpen: boolean;
  type: ExchangeModalType;
  onClose: () => void;
  onAction?: () => void;
  skillName?: string;
  userName?: string;
}

export function ExchangeModal({ isOpen, type, onClose, onAction, skillName, userName }: ExchangeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Фокусируемся на модалке для обработки клавиатуры
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getContent = () => {
    switch (type) {
      case 'auth':
        return {
          title: 'Требуется регистрация',
          message: 'Для предложения обмена необходимо зарегистрироваться',
          description: 'Зарегистрируйтесь или войдите в аккаунт, чтобы продолжить',
          buttonText: 'Зарегистрироваться',
          showFooter: true,
        };
      case 'success':
        return {
          title: 'Регистрация успешна!',
          message: 'Ваше предложение создано',
          description: skillName && userName
            ? `Вы предложили обмен навыком "${skillName}" пользователю ${userName}`
            : 'Теперь вы можете предлагать обмен',
          buttonText: 'Готово',
          showFooter: false,
        };
      case 'request-sent':
        return {
          title: 'Предложение отправлено',
          message: 'Вы предложили обмен',
          description: skillName && userName
            ? `Вы уже предложили обмен навыком "${skillName}" пользователю ${userName}. Дождитесь подтверждения`
            : 'Теперь дождитесь подтверждения. Вам придёт уведомление',
          buttonText: 'Готово',
          showFooter: false,
        };
      default:
        return {
          title: '',
          message: '',
          description: '',
          buttonText: '',
          showFooter: false,
        };
    }
  };

  const content = getContent();

  return (
    <div
      className={styles['modal-overlay']}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={styles['modal-container']}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className={styles['modal-header']}>
          <h2 id="modal-title" className={styles['modal-title']}>
            {content.title}
          </h2>
          <button
            type="button"
            className={styles['modal-close']}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles['modal-content']}>
          <div className={styles['modal-icon']}>
            {type === 'auth' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke="#1976d2"
                />
              </svg>
            )}
            {(type === 'success' || type === 'request-sent') && (
              <svg viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>

          <p className={styles['modal-message']}>{content.message}</p>
          <p className={styles['modal-description']}>{content.description}</p>

          <button
            type="button"
            className={styles['modal-button']}
            onClick={() => {
              if (onAction && content.showFooter === false) {
                onAction();
              }
              onClose();
            }}
          >
            {content.buttonText}
          </button>
        </div>

        {content.showFooter && (
          <div className={styles['modal-footer']}>
            <button
              type="button"
              className={`${styles['modal-footer-button']} ${styles['modal-footer-button-secondary']}`}
              onClick={onClose}
            >
              Закрыть
            </button>
            <button
              type="button"
              className={`${styles['modal-footer-button']} ${styles['modal-footer-button-primary']}`}
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
            >
              {content.buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}