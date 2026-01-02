import { NextRequest, NextResponse } from 'next/server';
import { db, events, eventVisitors } from '@/db';
import { eq, and } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { canManageEventParticipants } from '@/lib/auth/permissions';
import { NotFoundError, ForbiddenError, handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// DELETE /api/events/[id]/participants/[userId] - Remove participant from event
export const DELETE = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id, userId } = await context!.params;

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
        throw new ForbiddenError('You do not have permission to manage participants for this event');
      }

      // 3. Check if participant is registered
      const [registration] = await db
        .select()
        .from(eventVisitors)
        .where(
          and(
            eq(eventVisitors.eventId, id),
            eq(eventVisitors.userId, userId)
          )
        )
        .limit(1);

      if (!registration) {
        throw new NotFoundError('Participant is not registered for this event');
      }

      // 4. Remove participant
      await db
        .delete(eventVisitors)
        .where(
          and(
            eq(eventVisitors.eventId, id),
            eq(eventVisitors.userId, userId)
          )
        );

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            message: 'Participant removed successfully',
            eventId: id,
            userId,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
