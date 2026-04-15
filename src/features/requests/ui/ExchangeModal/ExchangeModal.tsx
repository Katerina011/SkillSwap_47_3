import { useEffect, useRef } from 'react';
import styles from './ExchangeModal.module.css';

export type ExchangeModalType = 'auth' | 'success' | 'request-sent' | 'error';

interface ExchangeModalProps {
  isOpen: boolean;
  type: ExchangeModalType;
  onClose: () => void;
  onAction?: () => void;
  skillName?: string;
  userName?: string;
}

export function ExchangeModal({
  isOpen,
  type,
  onClose,
  onAction,
  skillName,
  userName,
}: ExchangeModalProps) {
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
          description:
            'Зарегистрируйтесь или войдите в аккаунт, чтобы продолжить',
          buttonText: 'Зарегистрироваться',
          showFooter: true,
        };
      case 'success':
        return {
          title: 'Регистрация успешна!',
          message: 'Ваше предложение создано',
          description:
            skillName && userName
              ? `Вы предложили обмен навыком "${skillName}" пользователю ${userName}`
              : 'Теперь вы можете предлагать обмен',
          buttonText: 'Готово',
          showFooter: false,
        };
      case 'request-sent':
        return {
          title: 'Предложение отправлено',
          message: 'Вы предложили обмен',
          description:
            skillName && userName
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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles['modal-content']}>
          <div className={styles['modal-icon']}>
            {type === 'auth' && (
              <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M74.925 78.0196C72.0131 74.1654 68.2463 71.0397 63.9212 68.8887C59.596 66.7377 54.8305 65.62 50 65.6238C45.1695 65.62 40.404 66.7377 36.0788 68.8887C31.7537 71.0397 27.9869 74.1654 25.075 78.0196M74.925 78.0196C80.6063 72.9662 84.6171 66.3052 86.4258 58.92C88.2344 51.5347 87.7553 43.7741 85.0519 36.6674C82.3486 29.5607 77.5489 23.4437 71.2891 19.1275C65.0294 14.8113 57.6056 12.5 50.0021 12.5C42.3986 12.5 34.9747 14.8113 28.715 19.1275C22.4553 23.4437 17.6555 29.5607 14.9522 36.6674C12.2489 43.7741 11.7698 51.5347 13.5784 58.92C15.387 66.3052 19.3937 72.9662 25.075 78.0196M74.925 78.0196C68.0659 84.1357 59.1898 87.5103 50 87.4988C40.8087 87.5113 31.9351 84.1366 25.075 78.0196M62.5 40.6238C62.5 43.939 61.183 47.1184 58.8388 49.4626C56.4946 51.8068 53.3152 53.1238 50 53.1238C46.6848 53.1238 43.5054 51.8068 41.1612 49.4626C38.817 47.1184 37.5 43.939 37.5 40.6238C37.5 37.3086 38.817 34.1291 41.1612 31.7849C43.5054 29.4407 46.6848 28.1238 50 28.1238C53.3152 28.1238 56.4946 29.4407 58.8388 31.7849C61.183 34.1291 62.5 37.3086 62.5 40.6238Z"
                  stroke="#253017"
                />
              </svg>
            )}
            {(type === 'success' || type === 'request-sent') && (
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M87.5 50C87.5 70.7107 70.7107 87.5 50 87.5C29.2893 87.5 12.5 70.7107 12.5 50C12.5 29.2893 29.2893 12.5 50 12.5C70.7107 12.5 87.5 29.2893 87.5 50Z"
                  stroke="#253017"
                />
                <path
                  d="M36.8506 50.8401L43.356 57.3457C45.258 59.2477 48.3417 59.2477 50.2435 57.3456L64.6858 42.9023"
                  stroke="#253017"
                />
              </svg>
            )}
          </div>

          <p className={styles['modal-message']}>{content.message}</p>
          <p className={styles['modal-description']}>{content.description}</p>

          <button
            type="button"
            className={styles['modal-button']}
            onClick={() => {
              if (onAction && content) {
                onAction();
              }
              onClose();
            }}
          >
            {content.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
