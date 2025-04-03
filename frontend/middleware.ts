import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the path is protected
  const isProtectedPath = [
    '/dashboard',
    // Add other protected paths as needed
  ].some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isProtectedPath) {
    // Check for authentication token
    const token = request.cookies.get('token')?.value;
    console.log("Middleware checking for token:", token ? "Token found" : "No token");
    
    // If no token is found, redirect to login
    if (!token) {
      const url = new URL('/sign-in', request.url);
      url.searchParams.set('error', 'Please sign in to access this page');
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    // Add other protected paths as needed
  ],
};