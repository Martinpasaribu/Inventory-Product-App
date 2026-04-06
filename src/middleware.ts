import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Jika mencoba masuk ke /admin tapi tidak punya token
  if (pathname.startsWith('/admin') && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi mencoba ke halaman login lagi
  if (pathname === '/login' && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Hanya proteksi route /admin dan /login
export const config = {
  matcher: ['/admin/:path*', '/login'],
};