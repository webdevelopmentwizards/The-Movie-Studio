"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useMemo, useState } from "react";

import Logo from "@/components/Logo";
import { useApi } from "@/context/ApiContext";
import { PLANS_PATH, safeNextPath } from "@/lib/auth/constants";
import { destinationAfterAuth } from "@/lib/auth/routeAfterAuth";
import { setMemberPending } from "@/lib/memberSession";
import {
  isMembershipPlanId,
  type MembershipPlanId,
} from "@/lib/membershipPlans";
import { useAppDispatch, useAppSelector } from "@/store";
import { register, selectAuth } from "@/store/apps/auth";

const perks = [
  "Unlimited streaming in 4K HDR",
  "Personalized watchlists & recommendations",
  "New releases every single week",
  "Watch on any device, anywhere",
  "Networking Opportunities",
  "Premium access to new releases",
  "Includes t-shirts, hats, posters and more.",
  "Custom access to the Movie Studio private channel",
  "Email access to the producers and directors",
];

function planIdFromNext(nextPath: string): MembershipPlanId | null {
  try {
    const url = new URL(nextPath, "http://local");
    if (!url.pathname.startsWith("/dashboard/pay")) return null;
    const plan = url.searchParams.get("plan");
    return isMembershipPlanId(plan) ? plan : "yearly";
  } catch {
    return null;
  }
}

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { toast } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nextPath = useMemo(
    () => safeNextPath(router.query.next, PLANS_PATH),
    [router.query.next],
  );

  const loginHref = useMemo(() => {
    if (nextPath === PLANS_PATH || nextPath === "/membership") return "/login";
    return `/login?next=${encodeURIComponent(nextPath)}`;
  }, [nextPath]);

  useEffect(() => {
    if (auth.initialized && auth.user && !submitting) {
      void router.replace(
        destinationAfterAuth(
          { requiresPlan: auth.requiresPlan },
          nextPath,
        ),
      );
    }
  }, [auth.initialized, auth.user, auth.requiresPlan, nextPath, router, submitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const fullName = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || fullName;
    const lastName = parts.slice(1).join(" ") || undefined;

    setSubmitting(true);

    const result = await dispatch(
      register({ email, password, firstName, lastName }),
    );
    setSubmitting(false);

    if (register.fulfilled.match(result)) {
      const planId = planIdFromNext(nextPath);
      if (planId) {
        setMemberPending({ name: fullName, email, planId });
      }
      toast.success("Account created successfully");
      void router.replace(
        destinationAfterAuth(
          { requiresPlan: result.payload.requiresPlan },
          nextPath,
        ),
      );
      return;
    }

    toast.error(
      (result.payload as string) || "Unable to create your account.",
    );
  }

  return (
    <>
      <Head>
        <title>Create Account — Movie Studio</title>
        <meta
          name="description"
          content="Create your Movie Studio account and start streaming today."
        />
      </Head>

      <section className="relative h-dvh overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative grid h-full grid-cols-1 lg:grid-cols-2">
          <div className="relative hidden h-full overflow-hidden border-r border-zinc-800/80 bg-zinc-950 lg:flex lg:flex-col lg:justify-center lg:gap-10 lg:px-10 lg:py-12 xl:gap-12 xl:px-16 2xl:px-24">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative">
              <Logo size="lg" priority />
            </div>
            <div className="relative max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400">
                Join the studio
              </p>
              <h2 className="mt-3 text-xl font-bold leading-tight text-zinc-50 lg:text-2xl xl:text-3xl">
                Lights. Camera. Your next favorite story.
              </h2>
              <ul className="mt-4 space-y-2">
                {perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2.5 text-xs text-zinc-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3 w-3"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex h-full items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">
              <div className="mb-6 lg:hidden">
                <Logo size="md" priority />
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Already have an account?{" "}
                  <Link
                    href={loginHref}
                    className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      disabled={submitting}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 transition-colors hover:text-amber-400"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    disabled={submitting}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-amber-500"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-amber-400 hover:text-amber-300"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-amber-400 hover:text-amber-300"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
                >
                  {submitting ? "Creating account…" : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
