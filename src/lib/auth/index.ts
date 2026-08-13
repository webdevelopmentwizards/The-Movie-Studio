export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  PROTECTED_PREFIXES,
  GUEST_PATHS,
  LOGIN_PATH,
  SIGNUP_PATH,
  HOME_PATH,
  PLANS_PATH,
  DASHBOARD_PATH,
  MEMBERSHIP_REQUIRED_MESSAGE,
  MEMBERSHIP_REQUIRED_EVENT,
  isProtectedPath,
  isGuestPath,
  isPlanPath,
  safeNextPath,
} from "@/lib/auth/constants";
export {
  destinationAfterAuth,
  resolvePlanGate,
} from "@/lib/auth/routeAfterAuth";
export {
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
} from "@/lib/auth/tokenStorage";

export {
  withAuthSSR,
  requireAuth,
  requireMember,
  resolveSsrAuth,
} from "@/lib/auth/ssrAuth";
export type { SsrAuthProps } from "@/lib/auth/ssrAuth";
