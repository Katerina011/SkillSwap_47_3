import { useState } from 'react';
import { LoginHeader } from '../LoginPage/LoginHeader';
import styles from './Step3Form.module.css';
import schoolBoardImage from './school-board.png';

function Step3Form() {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Шаг 3:', { skillName, category, subcategory, description });
  };

  const handleBack = () => {
    // eslint-disable-next-line no-console
    console.log('Назад');
  };

  return (
    <>
      <LoginHeader />
      <div className={styles.container}>
        <div className={styles['steps-indicator']}>
          <div className={styles['steps-text']}>Шаг 3 из 3</div>
          <div className={styles['steps-bar']}>
            <span className={`${styles['step-dot']} ${styles.completed}`} />
            <span className={`${styles['step-dot']} ${styles.completed}`} />
            <span className={`${styles['step-dot']} ${styles.active}`} />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles['form-column']}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <div className={styles.label}>Название навыка</div>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className={styles.input}
                  placeholder="Введите название вашего навыка"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Категория навыка</div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Выберите категорию</option>
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Подкатегория навыка</div>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Выберите подкатегорию</option>
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Описание</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="Коротко опишите, чему можете научить"
                  rows={4}
                />
              </div>

              <div className={styles['upload-area']}>
                <div className={styles['upload-container']}>
                  <div className={styles['upload-text']}>
                    Перетащите или выберите изображения навыка
                  </div>
                  <div className={styles['upload-button']}>
                    <img
                      src="/src/pages/RegisterPage3/gallery-add.png"
                      alt="Add"
                      className={styles['upload-icon']}
                    />
                    <span>Выбрать изображения</span>
                  </div>
                </div>
              </div>
            </form>

            <div className={styles['button-group']}>
              <button
                type="button"
                className={styles['button-secondary']}
                onClick={handleBack}
              >
                Назад
              </button>
              <button
                type="submit"
                className={styles['button-primary']}
                onClick={handleSubmit}
              >
                Продолжить
              </button>
            </div>
          </div>

          <div className={styles['image-column']}>
            <img
              src={schoolBoardImage}
              alt="School board"
              className={styles.image}
            />
            <div className={styles['text-block']}>
              <h2 className={styles['welcome-title']}>
                Укажите, чем вы готовы поделиться
              </h2>
              <p className={styles['welcome-text']}>
                Так другие люди смогут увидеть ваши предложения и предложить вам
                обмен!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Step3Form;
