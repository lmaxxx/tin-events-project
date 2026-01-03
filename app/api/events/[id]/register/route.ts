import { NextRequest, NextResponse } from 'next/server';
import { db, events, eventVisitors } from '@/db';
import { eq, and, count } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { canRegisterForEvents } from '@/lib/auth/permissions';
import { NotFoundError, ForbiddenError, ConflictError, handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// POST /api/events/[id]/register - Register for event
export const POST = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id } = await context!.params;

      // Check if user can register for events
      if (!canRegisterForEvents(user)) {
        throw new ForbiddenError('You do not have permission to register for events');
      }

      // Fetch event
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!event) {
        throw new NotFoundError('Event not found');
      }

      // Check if event has already passed
      const eventDate = new Date(event.date);
      if (eventDate < new Date()) {
        throw new ForbiddenError('Cannot register for past events');
      }

      // Check if user is already registered
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

      if (existingRegistration) {
        throw new ConflictError('You are already registered for this event');
      }

      // Check event capacity and register atomically to prevent race conditions
      db.transaction((tx) => {
        // Count current visitors within transaction
        const [visitorCountResult] = tx
          .select({ count: count() })
          .from(eventVisitors)
          .where(eq(eventVisitors.eventId, id));

        const currentVisitors = visitorCountResult?.count || 0;

        // Check capacity
        if (currentVisitors >= event.capacity) {
          throw new ConflictError('Event is at full capacity');
        }

        // Register user for event (atomically)
        tx.insert(eventVisitors).values({
          eventId: id,
          userId: user.id,
        });
      });

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            message: 'Successfully registered for event',
            eventId: id,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['user', 'organizer', 'admin'] }
);
