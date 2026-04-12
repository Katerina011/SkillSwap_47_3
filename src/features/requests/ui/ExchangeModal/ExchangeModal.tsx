// src/shared/ui/Modal/ExchangeModal.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExchangeModal.module.css';
import { useAuth } from '../../../auth/AuthProvider';
import Modal from '../../../../shared/ui/Modal/Modal';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  userName: string;
}

type ModalState = 'check-auth' | 'register' | 'success' | 'pending';

export function ExchangeModal({
  isOpen,
  onClose,
  skillName,
  userName,
}: ExchangeModalProps) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<ModalState>('check-auth');

  useEffect(() => {
    if (isOpen) {
      if (isAuth) {
        setModalState('pending');
      } else {
        setModalState('register');
      }
    }
  }, [isOpen, isAuth]);

  const handleRegister = () => {
    onClose();
    navigate('/register', {
      state: { from: { pathname: window.location.pathname } },
    });
  };

  const handleSuccess = () => {
    onClose();
    setModalState('check-auth');
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const renderContent = () => {
    switch (modalState) {
      case 'register':
        return (
          <div className={styles['modal-content']}>
            <div className={styles['modal-icon']}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Регистрация"
              >
                <path
                  d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8ZM22 14V26H30V22H26V14H22Z"
                  fill="#1976D2"
                />
              </svg>
            </div>
            <h3 className={styles['modal-title']}>
              Предложить обмен навыком &quot;{skillName}&quot;
            </h3>
            <p className={styles['modal-text']}>
              Чтобы предложить обмен, необходимо зарегистрироваться или войти в
              аккаунт.
            </p>
            <div className={styles['modal-buttons']}>
              <button
                type="button"
                className={styles['button-secondary']}
                onClick={onClose}
                onKeyDown={(e) => handleKeyDown(e, onClose)}
              >
                Отмена
              </button>
              <button
                type="button"
                className={styles['button-primary']}
                onClick={handleRegister}
                onKeyDown={(e) => handleKeyDown(e, handleRegister)}
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className={styles['modal-content']}>
            <div className={styles['modal-icon']}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Предложение отправлено"
              >
                <path
                  d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8ZM22 14V26H30V22H26V14H22Z"
                  fill="#FF9800"
                />
              </svg>
            </div>
            <h3 className={styles['modal-title']}>Предложение отправлено!</h3>
            <p className={styles['modal-text']}>
              Вы предложили обмен навыком &quot;{skillName}&quot; пользователю {userName}.
              Теперь дождитесь подтверждения. Вам придёт уведомление.
            </p>
            <div className={styles['modal-buttons']}>
              <button
                type="button"
                className={styles['button-primary']}
                onClick={handleSuccess}
                onKeyDown={(e) => handleKeyDown(e, handleSuccess)}
              >
                Готово
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className={styles['modal-content']}>
            <div className={styles['modal-icon']}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Успех"
              >
                <path
                  d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8ZM20 30.6L13.4 24L10 27.4L20 37.4L38 19.4L34.6 16L20 30.6Z"
                  fill="#4CAF50"
                />
              </svg>
            </div>
            <h3 className={styles['modal-title']}>Ваше предложение создано!</h3>
            <p className={styles['modal-text']}>
              Теперь вы можете предложить обмен навыком &quot;{skillName}&quot;.
            </p>
            <div className={styles['modal-buttons']}>
              <button
                type="button"
                className={styles['button-primary']}
                onClick={handleSuccess}
                onKeyDown={(e) => handleKeyDown(e, handleSuccess)}
              >
                Готово
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
}