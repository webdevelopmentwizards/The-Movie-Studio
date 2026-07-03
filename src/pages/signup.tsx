"use client";

import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";

import Logo from "@/components/Logo";

const perks = [
  "Unlimited streaming in 4K HDR",
  "Personalized watchlists & recommendations",
  "New releases every single week",
  "Watch on any device, anywhere",
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
                Join the studio
              </p>
              <h2 className="mt-4 max-w-md text-2xl font-bold leading-tight text-zinc-50 lg:text-3xl xl:text-4xl">
                Lights. Camera. Your next favorite story.
              </h2>
              <ul className="mt-6 space-y-3">
                {perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
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

          {/* Form panel */}
          <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
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
                    href="/login"
                    className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {submitted && (
                <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  Creating your account… (demo — no backend connected yet)
                </div>
              )}

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
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500"
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
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500"
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
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500"
                      placeholder="At least 8 characters"
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

                <label className="flex items-start gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    name="terms"
                    required
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
                  className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                >
                  Create Account
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
