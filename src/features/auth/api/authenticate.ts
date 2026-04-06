import { getAllUsers } from '../../../api/endpoints/usersApi';
import { AuthUser } from '../model/types';

export async function loginWithUsersJson(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const users = await getAllUsers();
  const found = users.find(
    (u) => u.email.trim() === email.trim() && u.password === password,
  );
  if (!found) {
    return null;
  }
  const { password: removedPassword, ...session } = found;
  return session as AuthUser;
}
