import type { GetServerSideProps, GetServerSidePropsContext } from "next";

import { ACCESS_TOKEN_COOKIE, LOGIN_PATH } from "@/lib/auth/constants";
import type { MemberSession } from "@/lib/memberSession";
import type { MembershipPlanId } from "@/lib/membershipPlans";
import type { AuthUser } from "@/services/auth.service";
import type { MembershipRecord } from "@/services/membership.service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

type ApiSuccess<T> = {
  statusCode: string;
  message: string;
  data: T;
};

export type SsrAuthProps = {
  accessToken: string;
  user: AuthUser;
  membership: MembershipRecord | null;
  isMember: boolean;
  session: MemberSession | null;
};

type RequireAuthOptions = {
  requireMember?: boolean;
};

function getTokenFromContext(ctx: GetServerSidePropsContext): string | null {
  const raw = ctx.req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (!raw || typeof raw !== "string") return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function loginRedirect(ctx: GetServerSidePropsContext) {
  const path = ctx.resolvedUrl || ctx.req.url || "/";
  const next = encodeURIComponent(path);
  return {
    redirect: {
      destination: `${LOGIN_PATH}?next=${next}`,
      permanent: false as const,
    },
  };
}

async function apiGet<T>(
  path: string,
  accessToken: string,
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as ApiSuccess<T>;
    return json.data;
  } catch {
    return null;
  }
}

function toSession(
  user: AuthUser,
  membership: MembershipRecord | null,
): MemberSession {
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Member";

  return {
    name,
    email: user.email,
    planId: (membership?.planId as MembershipPlanId) || "monthly",
    memberSince:
      membership?.startsAt || user.createdAt || new Date().toISOString(),
  };
}

export async function resolveSsrAuth(
  ctx: GetServerSidePropsContext,
): Promise<SsrAuthProps | null> {
  const accessToken = getTokenFromContext(ctx);
  if (!accessToken) return null;

  const me = await apiGet<{ user: AuthUser }>("/auth/me", accessToken);
  if (!me?.user) return null;

  const membershipData = await apiGet<{
    membership: MembershipRecord | null;
    isMember: boolean;
  }>("/membership/me", accessToken);

  const membership = membershipData?.membership ?? null;
  const isMember = Boolean(membershipData?.isMember);

  return {
    accessToken,
    user: me.user,
    membership,
    isMember,
    session: toSession(me.user, membership),
  };
}

/**
 * SSR auth guard for Pages Router.
 * Validates cookie token against backend `/auth/me`.
 */
export function withAuthSSR(
  options: RequireAuthOptions = {},
): GetServerSideProps<SsrAuthProps> {
  return async (ctx) => {
    const auth = await resolveSsrAuth(ctx);
    if (!auth) {
      return loginRedirect(ctx);
    }

    if (options.requireMember && !auth.isMember) {
      return {
        redirect: {
          destination: "/membership",
          permanent: false as const,
        },
      };
    }

    return {
      props: {
        accessToken: auth.accessToken,
        user: auth.user,
        membership: auth.membership,
        isMember: auth.isMember,
        session: auth.session,
      },
    };
  };
}

export const requireAuth: GetServerSideProps<SsrAuthProps> = withAuthSSR();
export const requireMember: GetServerSideProps<SsrAuthProps> = withAuthSSR({
  requireMember: true,
});
