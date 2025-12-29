import { NextRequest, NextResponse } from 'next/server';
import { db, users, userRoles, roles } from '@/db';
import { withAuth } from '@/lib/auth/middleware';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import type { ApiResponse } from '@/lib/types/auth';

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

// GET /api/users/[id] - Admin only, get user details with roles
export const GET = withAuth(
  async (req: NextRequest, context) => {
    try {
      const { id } = await context!.params;

      // Get user
      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Get user roles
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
              ...user,
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

// PATCH /api/users/[id] - Admin only, update user details
export const PATCH = withAuth(
  async (req: NextRequest, context) => {
    try {
      const { id } = await context!.params;
      const body = await req.json();

      // Validate request body
      const validationResult = updateUserSchema.safeParse(body);
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

      const updateData = validationResult.data;

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { user: updatedUser },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['admin'] }
);

// DELETE /api/users/[id] - Admin only, delete user
export const DELETE = withAuth(
  async (req: NextRequest, context) => {
    try {
      const currentUser = (req as any).user;
      const { id } = await context!.params;

      // Prevent admin from deleting themselves
      if (currentUser.id === id) {
        throw new ForbiddenError('You cannot delete your own account');
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

      // Delete user (cascade will handle roles and event visitors)
      await db.delete(users).where(eq(users.id, id));

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { message: 'User deleted successfully' },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['admin'] }
);
