import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const protectedRoutes = ['/modules', '/module/create'];

  if (!token && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }

  if (token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/modules', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/modules/:path*',
    '/module/create'
  ],
};