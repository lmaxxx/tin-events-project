import { NextRequest, NextResponse } from 'next/server';
import { db, users, roles, userRoles } from '@/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validation/schemas';
import type { ApiResponse, AuthResponse } from '@/lib/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
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

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: 'User with this email already exists',
            code: 'EMAIL_EXISTS',
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    // Assign 'user' role by default
    const [userRole] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, 'user'))
      .limit(1);

    if (userRole) {
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: userRole.id,
      });
    }

    // Generate JWT token
    const token = await generateToken({
      userId: newUser.id,
      email: newUser.email,
      roles: ['user'],
    });

    // Set auth cookie
    await setAuthCookie(token);

    // Return user data
    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            roles: ['user'],
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
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
