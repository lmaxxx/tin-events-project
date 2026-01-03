import { NextRequest, NextResponse } from 'next/server';
import { db, events, users, eventCategories, eventVisitors } from '@/db';
import { eq, count } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { updateEventSchema } from '@/lib/validation/schemas';
import { canManageEvent } from '@/lib/auth/permissions';
import { NotFoundError, ForbiddenError, ConflictError, handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// GET /api/events/[id] - Public, get single event with full details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch event with relations
    const [event] = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        imageUrl: events.imageUrl,
        capacity: events.capacity,
        location: events.location,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        creator: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        category: {
          id: eventCategories.id,
          name: eventCategories.name,
          description: eventCategories.description,
        },
      })
      .from(events)
      .innerJoin(users, eq(events.creatorId, users.id))
      .innerJoin(eventCategories, eq(events.categoryId, eventCategories.id))
      .where(eq(events.id, id))
      .limit(1);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    // Get visitor count
    const [visitorCountResult] = await db
      .select({ count: count() })
      .from(eventVisitors)
      .where(eq(eventVisitors.eventId, id));

    // Get visitors list
    const visitors = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(eventVisitors)
      .innerJoin(users, eq(eventVisitors.userId, users.id))
      .where(eq(eventVisitors.eventId, id));

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          event: {
            ...event,
            visitorCount: visitorCountResult?.count || 0,
            visitors,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/events/[id] - Update event (owner or admin only)
export const PATCH = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id } = await context!.params;

      // Fetch event to check ownership
      const [existingEvent] = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!existingEvent) {
        throw new NotFoundError('Event not found');
      }

      // Check if user can manage this event
      if (!canManageEvent(user, existingEvent)) {
        throw new ForbiddenError('You do not have permission to edit this event');
      }

      const body = await req.json();

      // Validate request body
      const validationResult = updateEventSchema.safeParse(body);
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

      const updateData = validationResult.data;

      // Validate capacity reduction if capacity is being changed
      if (updateData.capacity !== undefined && updateData.capacity !== existingEvent.capacity) {
        // Fetch current visitor count
        const [visitorCountResult] = await db
          .select({ count: count() })
          .from(eventVisitors)
          .where(eq(eventVisitors.eventId, id));

        const currentVisitors = visitorCountResult?.count || 0;

        // Validate: new capacity must be >= current registrations
        if (currentVisitors > updateData.capacity) {
          throw new ConflictError(
            `Cannot reduce capacity below current registrations (${currentVisitors} registered)`
          );
        }
      }

      // Update event
      const [updatedEvent] = await db
        .update(events)
        .set({
          ...updateData,
          date: updateData.date ? new Date(updateData.date) : undefined,
          imageUrl: updateData.imageUrl || null,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id))
        .returning();

      // Fetch updated event with relations
      const [eventWithRelations] = await db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          date: events.date,
          imageUrl: events.imageUrl,
          capacity: events.capacity,
          location: events.location,
          createdAt: events.createdAt,
          updatedAt: events.updatedAt,
          creator: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
          category: {
            id: eventCategories.id,
            name: eventCategories.name,
            description: eventCategories.description,
          },
        })
        .from(events)
        .innerJoin(users, eq(events.creatorId, users.id))
        .innerJoin(eventCategories, eq(events.categoryId, eventCategories.id))
        .where(eq(events.id, id))
        .limit(1);

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { event: eventWithRelations },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// DELETE /api/events/[id] - Delete event (owner or admin only)
export const DELETE = withAuth(
  async (req: NextRequest, context) => {
    try {
      const user = (req as any).user;
      const { id } = await context!.params;

      // Fetch event to check ownership
      const [existingEvent] = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!existingEvent) {
        throw new NotFoundError('Event not found');
      }

      // Check if user can manage this event
      if (!canManageEvent(user, existingEvent)) {
        throw new ForbiddenError('You do not have permission to delete this event');
      }

      // Delete event (cascade will handle visitors)
      await db.delete(events).where(eq(events.id, id));

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { message: 'Event deleted successfully' },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  }
);
