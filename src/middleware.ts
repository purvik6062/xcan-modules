import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Define protected routes that require both wallet and GitHub authentication
  const protectedRoutes = [
    "/challenges",
    "/learn-defi",
    "/learn-orbit",
    "/playground",
    "/profile",
    "/leaderboard",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Skip middleware for auth-related routes and API routes
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // For protected routes, let the client-side handle authentication
  // The WalletProtectedWrapper component will handle the auth flow
  if (isProtectedRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
