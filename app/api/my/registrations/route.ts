import { NextRequest, NextResponse } from 'next/server';
import { db, events, users, eventCategories, eventVisitors } from '@/db';
import { eq, desc, like, or, and, gte, lte } from 'drizzle-orm';
import { withAuth } from '@/lib/auth/middleware';
import { handleApiError } from '@/lib/errors';
import type { ApiResponse } from '@/lib/types/auth';

// GET /api/my/registrations - Get events current user is registered for
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const date = searchParams.get('date');
    const categoryId = searchParams.get('categoryId');

    // Build filter conditions (always include user registration)
    const conditions = [eq(eventVisitors.userId, user.id)];

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

    // Fetch events user is registered for
    const registrations = await db
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
        registeredAt: eventVisitors.registeredAt,
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
      .from(eventVisitors)
      .innerJoin(events, eq(eventVisitors.eventId, events.id))
      .innerJoin(users, eq(events.creatorId, users.id))
      .innerJoin(eventCategories, eq(events.categoryId, eventCategories.id))
      .where(and(...conditions))
      .orderBy(desc(events.date));

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { events: registrations },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
