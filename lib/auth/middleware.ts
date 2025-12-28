import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './session';

export interface AuthOptions {
  roles?: string[];
}

type RouteHandler = (
  req: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<Response>;

export function withAuth(
  handler: RouteHandler,
  options: AuthOptions = {}
): RouteHandler {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    // Check if specific roles are required
    if (options.roles && options.roles.length > 0) {
      const hasRequiredRole = options.roles.some((role) =>
        user.roles.includes(role)
      );

      if (!hasRequiredRole) {
        return NextResponse.json(
          { success: false, error: { message: 'Forbidden', code: 'FORBIDDEN' } },
          { status: 403 }
        );
      }
    }

    // Attach user to request (for use in handler)
    (req as any).user = user;

    return handler(req, context);
  };
}
