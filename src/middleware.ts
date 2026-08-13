import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  HOME_PATH,
  isGuestPath,
  isProtectedPath,
  LOGIN_PATH,
  safeNextPath,
} from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(token);

  // Private routes: /dashboard/** (includes pay) — must be logged in
  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${pathname}${search || ""}`);
    return NextResponse.redirect(loginUrl);
  }

  // Guest-only: /login, /signup — logged-in users leave these pages
  if (isGuestPath(pathname) && isAuthenticated) {
    const dest = request.nextUrl.clone();
    const next = safeNextPath(
      request.nextUrl.searchParams.get("next") || undefined,
      HOME_PATH,
    );
    try {
      const parsed = new URL(next, request.nextUrl.origin);
      dest.pathname = parsed.pathname;
      dest.search = parsed.search;
    } catch {
      dest.pathname = HOME_PATH;
      dest.search = "";
    }
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
