import { NextResponse } from 'next/server';

export async function middleware(req) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const accessExp = req.cookies.get('accessExp')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/refresh')) {
    return NextResponse.next();
  }

  const needsAuth =
    pathname.startsWith('/profile') || pathname.startsWith('/dashboard');
  const isTokenExpired = accessExp && Date.now() > parseInt(accessExp);

  if (needsAuth) {
    if (!accessToken || !role) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (isTokenExpired && refreshToken) {
      try {
        const refreshResponse = await fetch(`${new URL(req.url).origin}/api/refresh`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Cookie: req.headers.get('cookie') || ''
          },
        });

        if (refreshResponse.ok) {
          return NextResponse.next();
        } else {
          const response = NextResponse.redirect(new URL('/', req.url));
          response.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0, path: '/' });
          response.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0, path: '/' });
          response.cookies.set('accessExp', '', { maxAge: 0, path: '/' });
          response.cookies.set('role', '', { maxAge: 0, path: '/' });
          return response;
        }
      } catch (error) {
        const response = NextResponse.redirect(new URL('/', req.url));
        response.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0, path: '/' });
        response.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0, path: '/' });
        response.cookies.set('accessExp', '', { maxAge: 0, path: '/' });
        response.cookies.set('role', '', { maxAge: 0, path: '/' });
        return response;
      }
    }
    if (isTokenExpired && !refreshToken) {
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0, path: '/' });
      response.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0, path: '/' });
      response.cookies.set('accessExp', '', { maxAge: 0, path: '/' });
      response.cookies.set('role', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  if (pathname.startsWith('/dashboard') && role !== 'admin') {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  if (pathname === '/' && role && !isTokenExpired) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/dashboard' : '/profile', req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/profile/:path*',
    '/dashboard/:path*'
  ],
};
