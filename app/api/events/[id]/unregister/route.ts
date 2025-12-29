import { NextRequest, NextResponse } from 'next/server';
import { db, eventVisitors } from '@/db';
import { eq, and } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { NotFoundError, handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// DELETE /api/events/[id]/unregister - Unregister from event
export const DELETE = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id } = await context!.params;

      // Check if user is registered
      const [existingRegistration] = await db
        .select()
        .from(eventVisitors)
        .where(
          and(
            eq(eventVisitors.eventId, id),
            eq(eventVisitors.userId, user.id)
          )
        )
        .limit(1);

      if (!existingRegistration) {
        throw new NotFoundError('You are not registered for this event');
      }

      // Unregister user from event
      await db
        .delete(eventVisitors)
        .where(
          and(
            eq(eventVisitors.eventId, id),
            eq(eventVisitors.userId, user.id)
          )
        );

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            message: 'Successfully unregistered from event',
            eventId: id,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
