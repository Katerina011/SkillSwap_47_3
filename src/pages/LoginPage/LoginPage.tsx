// src/pages/LoginPage/LoginPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginHeader } from './LoginHeader';
import styles from './LoginPage.module.css';
import lightBulbImage from './light-bulb.png';
import googleIcon from './Google.png';
import appleIcon from './Apple.png';
import eyeIcon from './eye.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== 'test@example.com' || password !== '123456') {
      setError(
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
      );
      return;
    }
    setError('');
    // eslint-disable-next-line no-console
    console.log('Вход:', { email, password });
  };

  return (
    <>
      <LoginHeader />
      <div className={styles.container}>
        <h1 className={styles['page-title']}>Вход</h1>
        <div className={styles.content}>
          <div className={styles['form-column']}>
            <div className={styles.block1}>
              <div className={styles['social-buttons']}>
                <button type="button" className={styles['social-button']}>
                  <img
                    src={googleIcon}
                    alt="Google"
                    className={styles['social-icon']}
                  />
                  <span className={styles['social-text']}>
                    Продолжить с Google
                  </span>
                </button>
                <button type="button" className={styles['social-button']}>
                  <img
                    src={appleIcon}
                    alt="Apple"
                    className={styles['social-icon']}
                  />
                  <span className={styles['social-text']}>
                    Продолжить с Apple
                  </span>
                </button>
              </div>

              <div className={styles.divider}>
                <span className={styles['divider-line']} />
                <span className={styles['divider-text']}>или</span>
                <span className={styles['divider-line']} />
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <div className={styles.label}>Email</div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`${styles.input} ${error ? styles['input-error'] : ''}`}
                    placeholder="Введите email"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <div className={styles.label}>Пароль</div>
                  <div className={styles['password-wrapper']}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className={`${styles['password-input']} ${error ? styles['input-error'] : ''}`}
                      placeholder="Введите ваш пароль"
                      required
                    />
                    <button
                      type="button"
                      className={styles['eye-button']}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Показать пароль"
                    >
                      <img
                        src={eyeIcon}
                        alt=""
                        className={styles['eye-icon']}
                      />
                    </button>
                  </div>
                </div>
                {error && (
                  <div className={styles['error-message']}>{error}</div>
                )}
              </form>
            </div>

            <div className={styles.block2}>
              <button
                type="submit"
                className={styles.button}
                onClick={handleSubmit}
              >
                Войти
              </button>
              <p className={styles.register}>
                <Link to="/register">Зарегистрироваться</Link>
              </p>
            </div>
          </div>

          <div className={styles['image-column']}>
            <img src={lightBulbImage} alt="Лампочка" className={styles.image} />
            <div className={styles['text-block']}>
              <h2 className={styles['welcome-title']}>
                С возвращением в SkillSwap!
              </h2>
              <p className={styles['welcome-text']}>
                Обменивайтесь знаниями и навыками с другими людьми
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { LoginPage };
