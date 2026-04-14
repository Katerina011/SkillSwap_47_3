export interface SkillFormData {
  skillName: string;
  description: string;
  category: string;
  subcategory: string;
  image?: File | null;
  tags?: string[];
}

export interface ValidationErrors {
  skillName?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  image?: string;
  tags?: string;
}

export const SKILL_VALIDATION_RULES = {
  skillName: {
    minLength: 3,
    maxLength: 50,
  },
  description: {
    maxLength: 500,
  },
  image: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png'] as const,
  },
  tags: {
    maxCount: 5,
  },
} as const;

// Тип для разрешенных MIME-типов
type AllowedMimeType = typeof SKILL_VALIDATION_RULES.image.allowedTypes[number];

// Функция проверки MIME-типа
function isAllowedMimeType(mimeType: string): mimeType is AllowedMimeType {
  return (SKILL_VALIDATION_RULES.image.allowedTypes as readonly string[]).includes(mimeType);
}

export function validateSkillForm(data: Partial<SkillFormData>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Валидация названия навыка
  if (data.skillName !== undefined) {
    const trimmedName = data.skillName.trim();
    if (trimmedName.length < SKILL_VALIDATION_RULES.skillName.minLength) {
      errors.skillName = `Название должно быть не менее ${SKILL_VALIDATION_RULES.skillName.minLength} символов`;
    } else if (trimmedName.length > SKILL_VALIDATION_RULES.skillName.maxLength) {
      errors.skillName = `Название должно быть не более ${SKILL_VALIDATION_RULES.skillName.maxLength} символов`;
    }
  }

  // Валидация описания
  if (data.description !== undefined) {
    if (data.description.trim().length > SKILL_VALIDATION_RULES.description.maxLength) {
      errors.description = `Описание должно быть не более ${SKILL_VALIDATION_RULES.description.maxLength} символов`;
    }
  }

  // Валидация категории
  if (data.category !== undefined && !data.category) {
    errors.category = 'Выберите категорию';
  }

  // Валидация подкатегории
  if (data.subcategory !== undefined && !data.subcategory) {
    errors.subcategory = 'Выберите подкатегорию';
  }

  // Валидация изображения
  if (data.image) {
    if (data.image.size > SKILL_VALIDATION_RULES.image.maxSize) {
      errors.image = 'Размер файла не должен превышать 2 МБ';
    } else if (!isAllowedMimeType(data.image.type)) {
      errors.image = 'Поддерживаются только JPEG и PNG';
    }
  }

  // Валидация тегов
  if (data.tags && data.tags.length > SKILL_VALIDATION_RULES.tags.maxCount) {
    errors.tags = `Максимум ${SKILL_VALIDATION_RULES.tags.maxCount} тегов`;
  }

  return errors;
}

export function isFormValid(errors: ValidationErrors): boolean {
  return !Object.values(errors).some(error => error !== undefined);
}