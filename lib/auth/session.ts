import { cookies } from 'next/headers';
import { verifyToken, type JWTPayload } from './jwt';
import { db, users, userRoles, roles } from '@/db';
import { eq } from 'drizzle-orm';

const TOKEN_NAME = 'auth-token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(TOKEN_NAME);
  return cookie?.value || null;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function getCurrentUser(): Promise<UserWithRoles | null> {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  // Fetch user from database with roles
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (!user) {
    return null;
  }

  // Fetch user roles
  const userRolesList = await db
    .select({
      roleName: roles.name,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, user.id));

  const roleNames = userRolesList.map((ur) => ur.roleName);

  return {
    ...user,
    roles: roleNames,
  };
}
