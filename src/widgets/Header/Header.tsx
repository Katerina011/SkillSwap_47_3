import styles from './Header.module.css';
import logo from '../../assets/image/logo.svg';

interface HeaderGuestUIProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onSearch?: (query: string) => void;
}

function HeaderGuestUI({ onLoginClick, onRegisterClick, onSearch }: HeaderGuestUIProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav__menu}>
        <div className={styles.logo}>
          <img src={logo} alt="логотип SkillSwap" />
          <h1 className={styles.h1}>SkillSwap</h1>
        </div>
        
        {/* ui блока ссылок */}
        <div className={styles.navLinksPlaceholder}>
          {/* TODO: Подключить компонент навигационных ссылок */}
        </div>
        
        {/* ui Input-Search */}
        <div className={styles.searchPlaceholder}>
          {/* TODO: Подключить компонент поиска */}
        </div>
        
        {/* ui переключение темы */}
        <div className={styles.themeTogglePlaceholder}>
          {/* TODO: Подключить компонент переключения темы */}
        </div>
        
        {/* ui Блок из двух кнопок Войти/Зарегистрироваться */}
        <div className={styles.authButtonsPlaceholder}>
          {/* TODO: Подключить компонент кнопок авторизации */}
        </div>
      </nav>
    </header>
  )
}

export function HeaderGuest({ onLoginClick, onRegisterClick, onSearch }: HeaderGuestUIProps) {
  return <HeaderGuestUI 
    onLoginClick={onLoginClick}
    onRegisterClick={onRegisterClick}
    onSearch={onSearch}
  />;
}