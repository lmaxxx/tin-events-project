import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/session';
import type { ApiResponse } from '@/lib/types/auth';

export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { message: 'Logged out successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
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
