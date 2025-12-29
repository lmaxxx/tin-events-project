import { NextRequest, NextResponse } from 'next/server';
import { db, users, userRoles, roles } from '@/db';
import { withAuth } from '@/lib/auth/middleware';
import { handleApiError, NotFoundError } from '@/lib/errors';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { z } from 'zod';
import type { ApiResponse } from '@/lib/types/auth';

const updateUserRolesSchema = z.object({
  roles: z.array(z.string()).min(1, 'User must have at least one role'),
});

// PATCH /api/users/[id]/roles - Admin only, update user roles
export const PATCH = withAuth(
  async (req: NextRequest, context) => {
    try {
      const { id } = await context!.params;
      const body = await req.json();

      // Validate request body
      const validationResult = updateUserRolesSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              fields: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
            },
          },
          { status: 400 }
        );
      }

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      const requestedRoles = validationResult.data.roles;

      // Verify all requested roles exist
      const existingRoles = await db
        .select()
        .from(roles)
        .where(inArray(roles.name, requestedRoles));

      if (existingRoles.length !== requestedRoles.length) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              message: 'One or more invalid roles provided',
              code: 'VALIDATION_ERROR',
            },
          },
          { status: 400 }
        );
      }

      // Delete existing user roles
      await db.delete(userRoles).where(eq(userRoles.userId, id));

      // Insert new roles
      const roleIds = existingRoles.map((r) => r.id);
      await db.insert(userRoles).values(
        roleIds.map((roleId) => ({
          userId: id,
          roleId,
        }))
      );

      // Fetch updated user with roles
      const userRolesList = await db
        .select({
          roleName: roles.name,
        })
        .from(userRoles)
        .innerJoin(roles, sql`${userRoles.roleId} = ${roles.id}`)
        .where(sql`${userRoles.userId} = ${id}`);

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            user: {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              roles: userRolesList.map((r) => r.roleName),
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
