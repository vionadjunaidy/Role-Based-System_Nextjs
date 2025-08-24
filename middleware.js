import { NextResponse } from 'next/server';

export function middleware(req) {
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

  const needsAuth =
    pathname.startsWith('/profile') || pathname.startsWith('/dashboard');

  if (needsAuth && !role) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/dashboard') && role !== 'admin') {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  if (pathname === '/' && role) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/dashboard' : '/profile', req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile/:path*', '/dashboard/:path*'],
};
