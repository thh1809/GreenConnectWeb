import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const authToken = cookies.get('authToken')?.value;
  const isLoginPage = nextUrl.pathname === '/admin/login';
  const isProtectedAdminRoute =
    nextUrl.pathname.startsWith('/admin') && !isLoginPage;

  if (isProtectedAdminRoute && !authToken) {
    const loginUrl = new URL('/admin/login', nextUrl);
    loginUrl.searchParams.set('redirect', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && authToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
