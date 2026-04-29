import { NextResponse } from 'next/server';

import { auth } from './lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!isLoggedIn && !isAuthPage) {
    const loginURL = new URL('/login', req.nextUrl.origin);
    loginURL.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginURL);
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/user/:path*', '/favourites/:path*'],
};
