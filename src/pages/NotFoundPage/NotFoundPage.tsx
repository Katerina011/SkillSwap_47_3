import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
import errorImage from './error 404.png';

export const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Картинка */}
        <div className={styles.imageWrapper}>
          <img 
            src={errorImage} 
            alt="404 error" 
            className={styles.errorImage}
          />
        </div>
        
        {/* Текстовый блок */}
        <div className={styles.textBlock}>
          <h2 className={styles.subtitle}>Страница не найдена</h2>
          <p className={styles.description}>
            К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже.
          </p>
        </div>
        
        {/* Блок с кнопками */}
        <div className={styles.buttons}>
          <button className={styles.buttonSecondary}>
            Сообщить об ошибке
          </button>
          <Link to="/" className={styles.buttonPrimary}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
};