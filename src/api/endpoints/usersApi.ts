import type { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';

type UsersResponse = {
  users: User[];
};

export const getAllUsers = async (): Promise<User[]> => {
  const data = await loadJson<UsersResponse>('/db/users.json');
  return data.users;
};