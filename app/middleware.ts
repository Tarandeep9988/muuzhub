
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protected API routes - require authentication
  const protectedApiRoutes = ['/api/streams', '/api/rooms'];
  const isProtectedApi = protectedApiRoutes.some(route => path.startsWith(route));

  if (isProtectedApi) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthenticated - Please log in' },
        { status: 401 }
      );
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Only run middleware on routes that need protection
    '/api/streams/:path*',
    '/api/rooms/:path*',
  ],
};