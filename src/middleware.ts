// src/middleware.ts
import { auth } from './auth.config';
import { NextResponse } from 'next/server';

export const middleware = auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/auth/login' && req.nextUrl.pathname !== '/auth/signup') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
