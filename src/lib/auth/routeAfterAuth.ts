import { DASHBOARD_PATH, PLANS_PATH } from "@/lib/auth/constants";

export function destinationAfterAuth(
  data: { requiresPlan: boolean },
  next?: string,
): string {
  if (data.requiresPlan) {
    if (next && next.startsWith("/dashboard/pay")) {
      return next;
    }
    return PLANS_PATH;
  }
  return DASHBOARD_PATH;
}

export function resolvePlanGate(data: {
  requiresPlan?: boolean;
  isMember?: boolean;
}): { requiresPlan: boolean; isMember: boolean } {
  if (data.requiresPlan === true) {
    return { requiresPlan: true, isMember: false };
  }
  if (data.requiresPlan === false) {
    return { requiresPlan: false, isMember: true };
  }
  if (typeof data.isMember === "boolean") {
    return { requiresPlan: !data.isMember, isMember: data.isMember };
  }
  return { requiresPlan: true, isMember: false };
}
