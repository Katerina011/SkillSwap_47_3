import type { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';

type UsersResponse = {
  users: User[];
};

export const getAllUsers = async (): Promise<User[]> => {
  const data = await loadJson<UsersResponse>('/db/users.json');
  return data.users;
};

// Получить пользователя по ID навыка
export const getUserBySkillId = async (
  skillId: string,
): Promise<User | null> => {
  const users = await getAllUsers();
  const user = users.find((u) => u.skillCanTeach?.id === skillId);
  return user || null;
};

// Получить всех пользователей с таким же навыком (исключая указанного)
export const getUsersBySkillId = async (
  skillId: string,
  excludeUserId?: string,
): Promise<User[]> => {
  const users = await getAllUsers();
  return users.filter(
    (u) => u.skillCanTeach?.id === skillId && u.id !== excludeUserId,
  );
};
