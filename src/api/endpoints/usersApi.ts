import type { User } from '../../entities/user/model/types';
import { loadJson } from './loadJson';

type UsersResponse = {
  users: User[];
};

const REGISTERED_USERS_STORAGE_KEY = 'skillswap_registered_users';

function readRegisteredUsers(): User[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as User[];
  } catch {
    localStorage.removeItem(REGISTERED_USERS_STORAGE_KEY);
    return [];
  }
}

function writeRegisteredUsers(users: User[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
}

export const getAllUsers = async (): Promise<User[]> => {
  const data = await loadJson<UsersResponse>('/db/users.json');
  return [...data.users, ...readRegisteredUsers()];
};

export const addRegisteredUser = (user: User): void => {
  const users = readRegisteredUsers();
  users.push(user);
  writeRegisteredUsers(users);
};
