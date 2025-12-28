import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

const publicPaths = ['/', '/login', '/register'];
const authPaths = ['/my-events', '/events/create'];
const adminPaths = ['/admin'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some((p) => path === p) || path.startsWith('/events/')) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const requiresAuth = authPaths.some((p) => path.startsWith(p));
  const requiresAdmin = adminPaths.some((p) => path.startsWith(p));

  if (requiresAuth || requiresAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check admin role for admin paths
    if (requiresAdmin && !payload.roles.includes('admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
