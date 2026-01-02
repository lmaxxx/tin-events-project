import { NextRequest, NextResponse } from 'next/server';
import { db, events, eventCategories, eventVisitors } from '@/db';
import { eq, desc, count, like, or, and, gte, lte } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// GET /api/my/events - Get current user's created events
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const date = searchParams.get('date');
    const categoryId = searchParams.get('categoryId');

    // Build filter conditions (always include user ownership)
    const conditions = [eq(events.creatorId, user.id)];

    if (categoryId) {
      conditions.push(eq(events.categoryId, categoryId));
    }

    if (search) {
      conditions.push(
        or(
          like(events.title, `%${search}%`),
          like(events.description, `%${search}%`)
        )!
      );
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      conditions.push(
        and(
          gte(events.date, startOfDay),
          lte(events.date, endOfDay)
        )!
      );
    }

    // Fetch user's created events
    const userEvents = await db
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
        category: {
          id: eventCategories.id,
          name: eventCategories.name,
          description: eventCategories.description,
        },
      })
      .from(events)
      .innerJoin(eventCategories, eq(events.categoryId, eventCategories.id))
      .where(and(...conditions))
      .orderBy(desc(events.date));

    // Get visitor counts for each event
    const eventsWithCounts = await Promise.all(
      userEvents.map(async (event) => {
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

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { events: eventsWithCounts },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
