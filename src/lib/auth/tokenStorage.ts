import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SEC,
  AUTH_STORAGE_KEYS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_SEC,
} from "@/lib/auth/constants";

function canUseDom() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readCookie(name: string): string | null {
  if (!canUseDom()) return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

function writeCookie(name: string, value: string, maxAge: number) {
  if (!canUseDom()) return;
  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (!canUseDom()) return;
  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function getStoredAccessToken(): string | null {
  if (!canUseDom()) return null;
  return (
    readCookie(ACCESS_TOKEN_COOKIE) ||
    window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  );
}

export function getStoredRefreshToken(): string | null {
  if (!canUseDom()) return null;
  return (
    readCookie(REFRESH_TOKEN_COOKIE) ||
    window.localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)
  );
}

export function setStoredTokens(tokens: {
  accessToken: string;
  refreshToken?: string;
}) {
  if (!canUseDom()) return;

  writeCookie(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    ACCESS_TOKEN_MAX_AGE_SEC,
  );
  window.localStorage.setItem(
    AUTH_STORAGE_KEYS.accessToken,
    tokens.accessToken,
  );

  if (tokens.refreshToken) {
    writeCookie(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      REFRESH_TOKEN_MAX_AGE_SEC,
    );
    window.localStorage.setItem(
      AUTH_STORAGE_KEYS.refreshToken,
      tokens.refreshToken,
    );
  }
}

export function clearStoredTokens() {
  if (!canUseDom()) return;
  clearCookie(ACCESS_TOKEN_COOKIE);
  clearCookie(REFRESH_TOKEN_COOKIE);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
}
