import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import type { ApiResponse } from '@/lib/types/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: 'Not authenticated',
            code: 'UNAUTHORIZED',
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
