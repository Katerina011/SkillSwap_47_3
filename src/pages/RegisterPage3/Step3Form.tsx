// src/pages/RegisterPage3/Step3Form.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginHeader } from '../LoginPage/LoginHeader';
import styles from './Step3Form.module.css';
import schoolBoardImage from './school-board.png';
import {
  fetchCategories,
  fetchSubcategories,
} from '../../api/endpoints/skillsApi';
import type { Subcategory } from '../../entities/skill/model/types';
import { registerMockUser } from '../../features/auth/api/registerMockUser';
import {
  clearRegisterDraft,
  readRegisterDraft,
  updateRegisterDraft,
} from '../../features/auth/lib/registerDraft';
import { useAuth } from '../../shared/hooks/useAuth';
import { resolvePostAuthRedirect } from '../../app/types/routes';
// Добавляем импорт валидации
import {
  validateSkillForm,
  isFormValid,
  type ValidationErrors,
} from '../../features/validation/skillFormValidation';

function Step3Form() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [draft] = useState(() => readRegisterDraft());

  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [submitError, setSubmitError] = useState('');

  // Добавляем состояние для ошибок валидации
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!draft?.email || !draft?.password) {
      navigate('/register', { replace: true, state: location.state });
      return;
    }

    setDescription(draft.about ?? '');
    setSkillName(draft.skillCanTeach?.name ?? '');
    setCategory(draft.skillCanTeach?.categoryId ?? '');
    setSubcategory(draft.skillCanTeach?.id ?? '');
  }, [draft, navigate, location.state]);

  useEffect(() => {
    const loadOptions = async () => {
      const [nextCategories, nextSubcategories] = await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
      ]);

      setCategories(nextCategories);
      setSubcategories(nextSubcategories);
    };

    loadOptions().catch(() => {
      setCategories([]);
      setSubcategories([]);
    });
  }, []);

  // Добавляем валидацию при изменении полей
  useEffect(() => {
    const errors = validateSkillForm({
      skillName,
      description,
      category,
      subcategory,
    });
    setValidationErrors(errors);
  }, [skillName, description, category, subcategory]);

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Отмечаем все поля как touched
    setTouched({
      skillName: true,
      description: true,
      category: true,
      subcategory: true,
    });

    // Проверяем валидацию
    const errors = validateSkillForm({
      skillName,
      description,
      category,
      subcategory,
    });
    setValidationErrors(errors);

    if (!isFormValid(errors)) {
      return; // Блокируем submit при наличии ошибок
    }

    if (!draft?.email || !draft?.password) {
      navigate('/register', { replace: true, state: location.state });
      return;
    }

    const selectedSubcategory = subcategories.find(
      (item) => item.id === subcategory,
    );
    const teachSkill = selectedSubcategory
      ? {
          id: selectedSubcategory.id,
          categoryId: selectedSubcategory.categoryId,
          name: skillName.trim() || selectedSubcategory.name,
          description: description.trim() || 'Пока не заполнено',
        }
      : undefined;

    updateRegisterDraft({
      skillCanTeach: teachSkill,
      about: description.trim() || undefined,
    });

    const result = await registerMockUser({
      email: draft.email,
      password: draft.password,
      name: draft.name,
      birthDate: draft.birthDate,
      gender: draft.gender,
      city: draft.city,
      skillToLearnId: draft.skillToLearnId,
      skillCanTeach: teachSkill,
      about: description.trim() || undefined,
    });

    if (!result.ok) {
      setSubmitError('Email уже используется');
      return;
    }

    const isLoggedIn = await login(draft.email, draft.password);
    if (!isLoggedIn) {
      setSubmitError('Не удалось выполнить автологин после регистрации');
      return;
    }

    clearRegisterDraft();
    navigate(
      resolvePostAuthRedirect(
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname,
      ),
      { replace: true },
    );
  };

  const handleBack = () => {
    const selectedSubcategory = subcategories.find(
      (item) => item.id === subcategory,
    );

    updateRegisterDraft({
      skillCanTeach: selectedSubcategory
        ? {
            id: selectedSubcategory.id,
            categoryId: selectedSubcategory.categoryId,
            name: skillName.trim() || selectedSubcategory.name,
            description: description.trim() || 'Пока не заполнено',
          }
        : undefined,
      about: description.trim() || undefined,
    });

    navigate('/register/step2', {
      state: location.state,
    });
  };

  const filteredSubcategories = subcategories.filter(
    (item) => item.categoryId === category,
  );

  // Проверяем, заблокирован ли submit
  const isSubmitDisabled = !isFormValid(validationErrors);

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
                <div className={styles.label}>Название навыка *</div>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  onBlur={() => handleFieldBlur('skillName')}
                  className={`${styles.input} ${
                    touched.skillName && validationErrors.skillName
                      ? styles['input-error']
                      : ''
                  }`}
                  placeholder="Введите название вашего навыка"
                />
                <div className={styles['char-counter']}>
                  {skillName.length}/50
                </div>
                {touched.skillName && validationErrors.skillName && (
                  <div className={styles['error-message']}>
                    {validationErrors.skillName}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Категория навыка *</div>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                  onBlur={() => handleFieldBlur('category')}
                  className={`${styles.select} ${
                    touched.category && validationErrors.category
                      ? styles['input-error']
                      : ''
                  }`}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((categoryOption) => (
                    <option key={categoryOption.id} value={categoryOption.id}>
                      {categoryOption.name}
                    </option>
                  ))}
                </select>
                {touched.category && validationErrors.category && (
                  <div className={styles['error-message']}>
                    {validationErrors.category}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Подкатегория навыка *</div>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  onBlur={() => handleFieldBlur('subcategory')}
                  className={`${styles.select} ${
                    touched.subcategory && validationErrors.subcategory
                      ? styles['input-error']
                      : ''
                  }`}
                >
                  <option value="">Выберите подкатегорию</option>
                  {filteredSubcategories.map((subcategoryOption) => (
                    <option
                      key={subcategoryOption.id}
                      value={subcategoryOption.id}
                    >
                      {subcategoryOption.name}
                    </option>
                  ))}
                </select>
                {touched.subcategory && validationErrors.subcategory && (
                  <div className={styles['error-message']}>
                    {validationErrors.subcategory}
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Описание</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleFieldBlur('description')}
                  className={`${styles.textarea} ${
                    touched.description && validationErrors.description
                      ? styles['input-error']
                      : ''
                  }`}
                  placeholder="Коротко опишите, чему можете научить"
                  rows={4}
                />
                <div className={styles['char-counter']}>
                  {description.length}/500
                </div>
                {touched.description && validationErrors.description && (
                  <div className={styles['error-message']}>
                    {validationErrors.description}
                  </div>
                )}
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

              {submitError && (
                <div className={styles['error-message']}>{submitError}</div>
              )}

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
                  disabled={isSubmitDisabled}
                >
                  Продолжить
                </button>
              </div>
            </form>
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
