/** Keep in sync with backend ACCESS_TOKEN_VALIDITY_DAYS (default 30). */
export const ACCESS_TOKEN_COOKIE = "tms_access_token";
export const REFRESH_TOKEN_COOKIE = "tms_refresh_token";

export const ACCESS_TOKEN_MAX_AGE_SEC = 30 * 24 * 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SEC = 30 * 24 * 60 * 60;

export const AUTH_STORAGE_KEYS = {
  accessToken: "tms_access_token",
  refreshToken: "tms_refresh_token",
} as const;

/**
 * Route policy
 * -----------
 * PUBLIC  — everything else (home, movies, membership plans, login, signup, …)
 * PRIVATE — `/dashboard` and all nested routes (including `/dashboard/pay`)
 *
 * - Unauthenticated users cannot open private routes → redirected to login
 * - Authenticated users can browse the whole app
 * - Authenticated users hitting login/signup → redirected away (home)
 */

/** Auth required — `pages/dashboard/**` (pay included) */
export const PROTECTED_PREFIXES = ["/dashboard"] as const;

/** Auth pages only for logged-out users */
export const GUEST_PATHS = ["/login", "/signup"] as const;

export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const HOME_PATH = "/";

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isProtectedPath(pathname: string): boolean {
  return matchesPrefix(pathname, PROTECTED_PREFIXES);
}

export function isGuestPath(pathname: string): boolean {
  return (GUEST_PATHS as readonly string[]).includes(pathname);
}

/** Safe in-app redirect target (blocks open redirects). */
export function safeNextPath(
  value: string | string[] | undefined,
  fallback = HOME_PATH,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (isGuestPath(raw)) return fallback;
  return raw;
}
