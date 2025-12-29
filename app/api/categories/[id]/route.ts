import { NextRequest, NextResponse } from 'next/server';
import { db, eventCategories, events } from '@/db';
import { withAuth } from '@/lib/auth/middleware';
import { categorySchema } from '@/lib/validation/schemas';
import { handleApiError, NotFoundError, ConflictError } from '@/lib/errors';
import { eq, count } from 'drizzle-orm';
import type { ApiResponse } from '@/lib/types/auth';

// PATCH /api/categories/[id] - Admin only, update category
export const PATCH = withAuth(
  async (req: NextRequest, context) => {
    try {
      const { id } = await context!.params;
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

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(eventCategories)
        .where(eq(eventCategories.id, id))
        .limit(1);

      if (!existingCategory) {
        throw new NotFoundError('Category not found');
      }

      const { name, description } = validationResult.data;

      // Check if another category with the same name exists (excluding current category)
      if (name && name !== existingCategory.name) {
        const [duplicateCategory] = await db
          .select()
          .from(eventCategories)
          .where(eq(eventCategories.name, name))
          .limit(1);

        if (duplicateCategory) {
          throw new ConflictError('A category with this name already exists');
        }
      }

      // Update category
      const [updatedCategory] = await db
        .update(eventCategories)
        .set({
          name: name || existingCategory.name,
          description: description !== undefined ? description || null : existingCategory.description,
        })
        .where(eq(eventCategories.id, id))
        .returning();

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { category: updatedCategory },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['admin'] }
);

// DELETE /api/categories/[id] - Admin only, delete category
export const DELETE = withAuth(
  async (req: NextRequest, context) => {
    try {
      const { id } = await context!.params;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(eventCategories)
        .where(eq(eventCategories.id, id))
        .limit(1);

      if (!existingCategory) {
        throw new NotFoundError('Category not found');
      }

      // Check if category is being used by any events
      const [eventCountResult] = await db
        .select({ count: count() })
        .from(events)
        .where(eq(events.categoryId, id));

      const eventCount = eventCountResult?.count || 0;

      if (eventCount > 0) {
        throw new ConflictError(
          `Cannot delete category. It is currently used by ${eventCount} event(s). Please reassign or delete those events first.`
        );
      }

      // Delete category
      await db.delete(eventCategories).where(eq(eventCategories.id, id));

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: { message: 'Category deleted successfully' },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleApiError(error);
    }
  },
  { roles: ['admin'] }
);
