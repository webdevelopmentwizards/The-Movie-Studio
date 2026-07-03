"use client";

import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";

import Logo from "@/components/Logo";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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

      <section className="relative min-h-dvh overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto grid min-h-dvh max-w-7xl grid-cols-1 items-stretch lg:grid-cols-2">
          {/* Visual / brand panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden border-r border-zinc-800/80 lg:flex lg:p-8 xl:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative">
              <Logo size="lg" priority />
            </div>

            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                Welcome back
              </p>
              <h2 className="mt-4 max-w-md text-2xl font-bold leading-tight text-zinc-50 lg:text-3xl xl:text-4xl">
                Your front-row seat to unforgettable stories.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
                Sign in to pick up where you left off, build your watchlist, and
                discover new releases every week.
              </p>
            </div>
          </div>

          {/* Form panel */}
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
                    href="/signup"
                    className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              {submitted && (
                <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  Signing you in… (demo — no backend connected yet)
                </div>
              )}

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
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500"
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
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 transition-colors hover:text-amber-400"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                  className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                >
                  Sign In
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
