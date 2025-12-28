import { NextRequest, NextResponse } from 'next/server';
import { db, users, userRoles, roles } from '@/db';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/schemas';
import type { ApiResponse, AuthResponse } from '@/lib/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
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

    const { email, password } = validationResult.data;

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
          },
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
          },
        },
        { status: 401 }
      );
    }

    // Fetch user roles
    const userRolesList = await db
      .select({
        roleName: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    const roleNames = userRolesList.map((ur) => ur.roleName);

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      roles: roleNames,
    });

    // Set auth cookie
    await setAuthCookie(token);

    // Return user data
    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: roleNames,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
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
