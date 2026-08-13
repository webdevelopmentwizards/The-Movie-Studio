"use client";

import type { MemberSession } from "@/lib/memberSession";
import type { MembershipPlanId } from "@/lib/membershipPlans";
import {
  logout as logoutThunk,
  selectAuth,
  selectDisplayName,
} from "@/store/apps/auth";
import { useAppDispatch, useAppSelector } from "@/store";

/**
 * Bridge hook: keeps existing UI APIs while sourcing session from Redux/auth API.
 */
export function useMemberSession() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const name = useAppSelector(selectDisplayName);

  const session: MemberSession | null = auth.user
    ? {
        name: name || auth.user.email,
        email: auth.user.email,
        planId: (auth.membership?.planId as MembershipPlanId) || "monthly",
        memberSince:
          auth.membership?.startsAt ||
          auth.user.createdAt ||
          new Date().toISOString(),
      }
    : null;

  const isLoggedIn = Boolean(auth.user);
  const isMember = Boolean(auth.user && auth.isMember);
  const ready = auth.initialized;

  function logout() {
    void dispatch(logoutThunk());
  }

  return {
    session: isLoggedIn ? session : null,
    ready,
    logout,
    isLoggedIn,
    isMember,
    user: auth.user,
    authStatus: auth.status,
    error: auth.error,
  };
}
