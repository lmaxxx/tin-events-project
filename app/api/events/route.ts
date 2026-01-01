import { NextRequest, NextResponse } from 'next/server';
import { db, events, users, eventCategories, eventVisitors } from '@/db';
import { eq, desc, count, sql } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { eventSchema } from '@/lib/validation/schemas';
import { canCreateEvent } from '@/lib/auth/permissions';
import { ForbiddenError, handleApiError } from '@/lib/errors';
import type { ApiResponse, PaginatedResponse } from '@/lib/types/auth';

// GET /api/events - Public, paginated list of events
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const categoryId = searchParams.get('categoryId');

    const offset = (page - 1) * pageSize;

    // Build query
    let query = db
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
      .orderBy(desc(events.date))
      .limit(pageSize)
      .offset(offset);

    // Filter by category if provided
    if (categoryId) {
      query = query.where(eq(events.categoryId, categoryId)) as any;
    }

    const eventsList = await query;

    // Get visitor counts for each event
    const eventsWithCounts = await Promise.all(
      eventsList.map(async (event) => {
        const [visitorCount] = await db
          .select({ count: count() })
          .from(eventVisitors)
          .where(eq(eventVisitors.eventId, event.id));

        return {
          ...event,
          visitorCount: visitorCount?.count || 0,
        };
      })
    );

    // Get total count for pagination
    let countQuery = db.select({ count: count() }).from(events);
    if (categoryId) {
      countQuery = countQuery.where(eq(events.categoryId, categoryId)) as any;
    }
    const [totalResult] = await countQuery;
    const total = totalResult?.count || 0;

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json<PaginatedResponse<typeof eventsWithCounts[0]>>(
      {
        success: true,
        data: eventsWithCounts,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/events - Create new event (organizer or admin only)
export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const user = (req as any).user;

      // Check if user can create events
      if (!canCreateEvent(user)) {
        throw new ForbiddenError('Only organizers and admins can create events');
      }

      const body = await req.json();

      // Validate request body
      const validationResult = eventSchema.safeParse(body);
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

      const { title, description, date, imageUrl, capacity, location, categoryId } =
        validationResult.data;

      // Create event
      const [newEvent] = await db
        .insert(events)
        .values({
          title,
          description,
          date: new Date(date),
          imageUrl: imageUrl || null,
          capacity,
          location,
          categoryId,
          creatorId: user.id,
        })
        .returning();

      // Fetch event with relations
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
        .where(eq(events.id, newEvent.id))
        .limit(1);

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            event: {
              ...eventWithRelations,
              visitorCount: 0,
            },
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['organizer', 'admin'] }
);
