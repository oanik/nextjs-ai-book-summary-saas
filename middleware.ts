import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!isLoggedIn && !isAuthPage) {
    const loginURL = new URL('/login', req.nextUrl.origin);
    loginURL.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/favourites/:path*'],
};
