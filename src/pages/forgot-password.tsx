"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import Logo from "@/components/Logo";
import { useApi } from "@/context/ApiContext";
import { LOGIN_PATH } from "@/lib/auth/constants";
import { destinationAfterAuth } from "@/lib/auth/routeAfterAuth";
import {
  authService,
  getApiErrorMessage,
} from "@/services";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/store/apps/auth";

type Step = "email" | "reset";

export default function ForgotPassword() {
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const { toast } = useApi();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth.initialized && auth.user && !submitting) {
      void router.replace(
        destinationAfterAuth({ requiresPlan: auth.requiresPlan }),
      );
    }
  }, [auth.initialized, auth.user, auth.requiresPlan, router, submitting]);

  async function sendCode(targetEmail: string) {
    await authService.forgotPassword({ email: targetEmail });
    toast.success("If that email is registered, a code is on the way.");
    setStep("reset");
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter the email for your account.");
      return;
    }

    setSubmitting(true);
    try {
      await sendCode(trimmed);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to send reset code."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
      });
      toast.success("Password updated. Sign in with your new password.");
      void router.replace(LOGIN_PATH);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reset password."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (submitting || !email.trim()) return;
    setSubmitting(true);
    try {
      await sendCode(email.trim());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to resend code."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Forgot Password — Movie Studio</title>
        <meta
          name="description"
          content="Reset your Movie Studio account password."
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
                Account recovery
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-zinc-50 lg:text-3xl">
                Get back to your front-row seat.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                We&apos;ll email a 6-digit code so you can set a new password and
                pick up where you left off.
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
                  {step === "email" ? "Forgot password" : "Reset password"}
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  {step === "email" ? (
                    <>
                      Remembered it?{" "}
                      <Link
                        href={LOGIN_PATH}
                        className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
                      >
                        Sign in
                      </Link>
                    </>
                  ) : (
                    <>
                      Enter the code sent to{" "}
                      <span className="font-medium text-zinc-200">
                        {email.trim()}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>

              {step === "email" ? (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
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
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send reset code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Reset code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      disabled={submitting}
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 tracking-[0.35em] text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 placeholder:tracking-normal focus:border-amber-500 disabled:opacity-60"
                      placeholder="6-digit code"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      New password
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
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                        placeholder="At least 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 transition-colors hover:text-amber-400"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      disabled={submitting}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-amber-500 disabled:opacity-60"
                      placeholder="Repeat new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
                  >
                    {submitting ? "Updating…" : "Update password"}
                  </button>

                  <p className="text-center text-sm text-zinc-400">
                    Didn&apos;t get a code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={submitting}
                      className="font-semibold text-amber-400 transition-colors hover:text-amber-300 disabled:opacity-60"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              )}

              {step === "reset" && (
                <p className="mt-6 text-center text-sm text-zinc-400">
                  <Link
                    href={LOGIN_PATH}
                    className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
                  >
                    Back to sign in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
