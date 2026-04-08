import type { User } from '../../../entities/user/model/types';
import {
  appendUserToMockDb,
  normalizeEmail,
} from '../../../api/endpoints/usersApi';

type RegisterMockUserInput = {
  email: string;
  password: string;
};

type RegisterMockUserResult =
  | {
      ok: true;
      user: User;
    }
  | {
      ok: false;
      error: 'EMAIL_TAKEN';
    };

function createMockUser({ email, password }: RegisterMockUserInput): User {
  const now = new Date();
  const normalizedEmail = email.trim().toLowerCase();
  const emailName = normalizedEmail.split('@')[0] || 'user';
  const displayName =
    emailName.charAt(0).toUpperCase() +
    emailName.slice(1).replace(/[._-]+/g, ' ');

  return {
    id: `user_mock_${crypto.randomUUID()}`,
    name: displayName,
    email: normalizedEmail,
    password,
    avatar: '1.jpg',
    birthDate: '2000-01-01',
    age: now.getFullYear() - 2000,
    gender: 'женский',
    createdAt: now.toISOString(),
    favorites: [],
    liked_me: [],
    skillCanTeach: {
      id: 'skill_mock_001',
      categoryId: '0',
      name: 'Новый навык',
      description: 'Пока не заполнено',
    },
    images: [],
    skills: [],
    about: '',
  };
}

export async function registerMockUser({
  email,
  password,
}: RegisterMockUserInput): Promise<RegisterMockUserResult> {
  const normalizedEmail = normalizeEmail(email);

  const user = createMockUser({
    email: normalizedEmail,
    password,
  });

  const appendResult = await appendUserToMockDb(user);
  if (!appendResult.ok) {
    return appendResult;
  }

  return {
    ok: true,
    user,
  };
}
