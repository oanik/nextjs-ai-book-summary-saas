import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import { authConfig } from './lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: unknown }) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!isLoggedIn && !isAuthPage) {
    const loginURL = new URL('/login', req.nextUrl.origin);
    loginURL.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/favourites/:path*'],
};
