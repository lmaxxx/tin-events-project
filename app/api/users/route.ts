import { NextRequest, NextResponse } from 'next/server';
import { db, users, userRoles, roles } from '@/db';
import { withAuth } from '@/lib/auth/middleware';
import { handleApiError } from '@/lib/errors';
import { sql, count } from 'drizzle-orm';
import type { ApiResponse } from '@/lib/types/auth';

// GET /api/users - Admin only, get paginated users list with roles
export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const pageSize = parseInt(searchParams.get('pageSize') || '20');
      const offset = (page - 1) * pageSize;

      // Get total count
      const [totalResult] = await db.select({ count: count() }).from(users);
      const total = totalResult?.count || 0;

      // Get users with their roles
      const usersWithRoles = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .limit(pageSize)
        .offset(offset);

      // Fetch roles for each user
      const usersWithRolesList = await Promise.all(
        usersWithRoles.map(async (user) => {
          const userRolesList = await db
            .select({
              roleName: roles.name,
            })
            .from(userRoles)
            .innerJoin(roles, sql`${userRoles.roleId} = ${roles.id}`)
            .where(sql`${userRoles.userId} = ${user.id}`);

          return {
            ...user,
            roles: userRolesList.map((r) => r.roleName),
          };
        })
      );

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            users: usersWithRolesList,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize),
            },
          },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['admin'] }
);
