"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useMemo, useState } from "react";

import Logo from "@/components/Logo";
import { useApi } from "@/context/ApiContext";
import { safeNextPath } from "@/lib/auth/constants";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuthError, login, selectAuth } from "@/store/apps/auth";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { toast } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nextPath = useMemo(
    () => safeNextPath(router.query.next, "/dashboard"),
    [router.query.next],
  );

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Already logged in → leave login (middleware also enforces this)
  useEffect(() => {
    if (auth.initialized && auth.user && !submitting) {
      void router.replace(nextPath);
    }
  }, [auth.initialized, auth.user, nextPath, router, submitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    setSubmitting(true);

    const result = await dispatch(login({ email, password }));
    setSubmitting(false);

    if (login.fulfilled.match(result)) {
      toast.success("Signed in successfully");
      void router.push(nextPath);
      return;
    }

    toast.error(
      (result.payload as string) || "Invalid email or password.",
    );
  }

  return (
    <>
      <Head>
        <title>Sign In — Movie Studio</title>
        <meta
          name="description"
          content="Sign in to your Movie Studio account to continue watching."
        />
      </Head>

      <section className="relative min-h-dvh overflow-x-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative grid min-h-dvh w-full grid-cols-1 items-stretch lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative hidden flex-col justify-center overflow-hidden border-r border-zinc-800/80 lg:flex lg:px-12 lg:py-12 xl:px-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative max-w-lg">
              <Logo size="md" priority />
              <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400">
                Welcome back
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-zinc-50 lg:text-3xl">
                Your front-row seat to unforgettable stories.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Sign in to open your member dashboard, unlock velvet-rope
                benefits, and pick up where you left off.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-7 lg:hidden">
                <Logo size="md" priority />
              </div>

              <div className="mb-7 sm:mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                  Sign in to your account
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={
                      nextPath === "/dashboard"
                        ? "/signup"
                        : `/signup?next=${encodeURIComponent(nextPath)}`
                    }
                    className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-xs font-medium text-amber-400 transition-colors hover:text-amber-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      disabled={submitting}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                      placeholder="••••••••"
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

                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-amber-500"
                  />
                  Remember me for 30 days
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
                >
                  {submitting ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-zinc-600">
                By continuing you agree to our{" "}
                <Link href="/terms" className="text-zinc-400 hover:text-amber-400">
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-zinc-400 hover:text-amber-400"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
