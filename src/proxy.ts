import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.id) {
    return NextResponse.redirect(new URL(`/404`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/modules/:path*',
    '/module/create'
  ],
};