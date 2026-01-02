import { NextRequest, NextResponse } from 'next/server';
import { db, users, events, eventVisitors, userRoles, roles } from '@/db';
import { eq, like, or, sql } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { canManageEventParticipants } from '@/lib/auth/permissions';
import { NotFoundError, handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// GET /api/events/[id]/available-users?q=search - Search users available to add
export const GET = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id } = await context!.params;
      const searchParams = req.nextUrl.searchParams;
      const query = searchParams.get('q') || searchParams.get('search') || '';
      const limit = parseInt(searchParams.get('limit') || '20', 10);

      // 1. Fetch event to check ownership/permissions
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!event) {
        throw new NotFoundError('Event not found');
      }

      // 2. Check if user can manage participants
      if (!canManageEventParticipants(user, event)) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              message: 'You do not have permission to manage participants',
              code: 'FORBIDDEN',
            },
          },
          { status: 403 }
        );
      }

      // 3. Get list of already registered user IDs
      const registeredUsers = await db
        .select({ userId: eventVisitors.userId })
        .from(eventVisitors)
        .where(eq(eventVisitors.eventId, id));

      const registeredUserIds = registeredUsers.map(r => r.userId);

      // 4. Build where clause with search and exclusion
      let whereClause;

      if (query.trim()) {
        // Search by email or name, exclude registered users
        if (registeredUserIds.length > 0) {
          whereClause = sql`(${users.email} LIKE ${`%${query.trim()}%`} OR ${users.name} LIKE ${`%${query.trim()}%`}) AND ${users.id} NOT IN (${sql.join(registeredUserIds.map(id => sql`${id}`), sql`, `)})`;
        } else {
          whereClause = or(
            like(users.email, `%${query.trim()}%`),
            like(users.name, `%${query.trim()}%`)
          );
        }
      } else {
        // No search, just exclude registered users
        if (registeredUserIds.length > 0) {
          whereClause = sql`${users.id} NOT IN (${sql.join(registeredUserIds.map(id => sql`${id}`), sql`, `)})`;
        }
      }

      // 5. Search available users
      const availableUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(whereClause)
        .limit(limit);

      // 6. Fetch roles for each user (optional, for display purposes)
      const usersWithRoles = await Promise.all(
        availableUsers.map(async (user) => {
          const userRolesList = await db
            .select({ roleName: roles.name })
            .from(userRoles)
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .where(eq(userRoles.userId, user.id));

          return {
            ...user,
            roles: userRolesList.map((ur) => ur.roleName),
          };
        })
      );

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          users: usersWithRoles,
        },
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
