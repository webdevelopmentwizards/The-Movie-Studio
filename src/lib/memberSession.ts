import type { MembershipPlanId } from "@/lib/membershipPlans";

/** Pending membership plan handoff between signup → pay (session only). */
export const MEMBER_PENDING_KEY = "tms_member_pending";

export type MemberSession = {
  name: string;
  email: string;
  planId: MembershipPlanId;
  memberSince: string;
};

export type MemberPending = {
  name: string;
  email: string;
  planId: MembershipPlanId;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function setMemberPending(pending: MemberPending) {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(MEMBER_PENDING_KEY, JSON.stringify(pending));
}

export function getMemberPending(): MemberPending | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.sessionStorage.getItem(MEMBER_PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MemberPending;
  } catch {
    return null;
  }
}

export function clearMemberPending() {
  if (!canUseStorage()) return;
  window.sessionStorage.removeItem(MEMBER_PENDING_KEY);
}

export function memberInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
