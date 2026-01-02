import { NextRequest, NextResponse } from 'next/server';
import { db, events, eventVisitors, users } from '@/db';
import { eq, and, sql } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { canManageEventParticipants } from '@/lib/auth/permissions';
import { NotFoundError, ForbiddenError, ConflictError, handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';
import { z } from 'zod';

const addParticipantSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

// POST /api/events/[id]/participants - Add participant to event
export const POST = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id } = await context!.params;
      const body = await req.json();

      // 1. Validate request body
      const validationResult = addParticipantSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              message: 'Validation error',
              code: 'VALIDATION_ERROR',
              fields: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
            },
          },
          { status: 400 }
        );
      }

      const { userId } = validationResult.data;

      // 2. Fetch event to check ownership/permissions
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!event) {
        throw new NotFoundError('Event not found');
      }

      // 3. Check if user can manage participants
      if (!canManageEventParticipants(user, event)) {
        throw new ForbiddenError('You do not have permission to manage participants for this event');
      }

      // 4. Verify target user exists
      const [targetUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!targetUser) {
        throw new NotFoundError('User not found');
      }

      // 5. Check if already registered
      const [existingRegistration] = await db
        .select()
        .from(eventVisitors)
        .where(
          and(
            eq(eventVisitors.eventId, id),
            eq(eventVisitors.userId, userId)
          )
        )
        .limit(1);

      if (existingRegistration) {
        throw new ConflictError('User is already registered for this event');
      }

      // 6. Check event capacity
      const [visitorCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(eventVisitors)
        .where(eq(eventVisitors.eventId, id));

      if (visitorCount.count >= event.capacity) {
        throw new ConflictError('Event is at full capacity');
      }

      // 7. Add participant
      await db.insert(eventVisitors).values({
        eventId: id,
        userId,
      });

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            message: 'Participant added successfully',
            eventId: id,
            userId,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
