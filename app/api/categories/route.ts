import { NextRequest, NextResponse } from 'next/server';
import { db, eventCategories } from '@/db';
import { withAuth } from '@/lib/auth/middleware';
import { categorySchema } from '@/lib/validation/schemas';
import { handleApiError, ConflictError } from '@/lib/errors';
import { eq } from 'drizzle-orm';
import type { ApiResponse } from '@/lib/types/auth';

// GET /api/categories - Public, return all categories
export async function GET() {
  try {
    const categories = await db.select().from(eventCategories);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - Admin only, create category
export const POST = withAuth(
  async (req: NextRequest) => {
    try {
      const body = await req.json();

      // Validate request body
      const validationResult = categorySchema.safeParse(body);
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

      const { name, description } = validationResult.data;

      // Check if category with same name already exists
      const [existingCategory] = await db
        .select()
        .from(eventCategories)
        .where(eq(eventCategories.name, name))
        .limit(1);

      if (existingCategory) {
        throw new ConflictError('A category with this name already exists');
      }

      // Create category
      const [newCategory] = await db
        .insert(eventCategories)
        .values({
          name,
          description: description || null,
        })
        .returning();

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { category: newCategory },
        },
        { status: 201 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['admin'] }
);
