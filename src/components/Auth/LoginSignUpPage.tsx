"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, type ReactNode } from "react";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "./icons";

import { CDN_ASSETS_BASE } from "@/constants/cdn";

const LOGO_SRC = `${CDN_ASSETS_BASE}/PRO_Movie_Studio_Logo_WHT2021-1769728410816.png`;

const TRUST_POINTS = [
  "Exclusive independent films & series",
  "Stream on any device, anywhere",
  "Private · Secure · No subscription required",
];

const MOBILE_TRUST_CHIPS = [
  "Exclusive films",
  "Any device",
  "Free to join",
];

const SOCIAL_AVATARS = ["JD", "SM", "RK", "PL", "TA"];

type AuthMode = "login" | "signup";

function ModeToggle({
  mode,
  onChange,
  className = "",
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex rounded-xl border-[1.5px] border-[#5DB9BF]/15 bg-white p-0.5 lg:rounded-2xl lg:p-1 ${className}`}
    >
      {(["login", "signup"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-1 cursor-pointer rounded-[10px] border-none px-2 py-2 text-xs font-extrabold transition-all lg:rounded-[13px] lg:py-[11px] lg:text-[15px] ${
            mode === m
              ? "bg-gradient-to-br from-[#5DB9BF] to-[#3E9AA0] text-white"
              : "bg-transparent text-[#5F9090]"
          }`}
        >
          {m === "login" ? "Log In" : "Create Account"}
        </button>
      ))}
    </div>
  );
}

function SocialButtons({ compact = false }: { compact?: boolean }) {
  const providers = [
    { label: compact ? "Google" : "Continue with Google", icon: "G", color: "#4285F4" },
    { label: compact ? "Apple" : "Continue with Apple", icon: "🍎", color: undefined },
  ];

  return (
    <div className="flex gap-2 lg:gap-2.5">
      {providers.map((provider) => (
        <button
          key={provider.label}
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-[#5DB9BF]/20 bg-white px-2 py-2 text-xs font-bold text-[#0F3A3A] lg:gap-2 lg:rounded-xl lg:py-3 lg:text-[13px]"
        >
          <span
            className="text-xs font-black lg:text-sm"
            style={{ color: provider.color }}
          >
            {provider.icon}
          </span>
          {provider.label}
        </button>
      ))}
    </div>
  );
}

function Divider({ label }: { label: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="h-px flex-1 bg-[#5DB9BF]/15" />
      <span className="text-[11px] font-semibold text-[#5F9090] sm:text-xs lg:text-xs">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#5DB9BF]/15" />
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-bold text-[#5F9090] sm:mb-[5px] lg:mb-1.5"
    >
      {children}
    </label>
  );
}

function InputShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border-[1.5px] border-[#5DB9BF]/22 bg-[#F8FAFA] px-3 py-2.5 lg:rounded-xl lg:border-[#5DB9BF]/25 lg:bg-white lg:px-4 lg:py-3">
      {children}
    </div>
  );
}

function SocialProof({ compact = false }: { compact?: boolean }) {
  const avatars = compact ? SOCIAL_AVATARS.slice(0, 4) : SOCIAL_AVATARS;

  return (
    <div
      className={
        compact
          ? "mt-5 flex items-center gap-3 rounded-xl bg-[#F4FBFB] px-4 py-3.5 lg:hidden"
          : "mt-11 border-t border-white/8 pt-8"
      }
    >
      <div className="flex">
        {avatars.map((initial, index) => (
          <div
            key={initial}
            className={`flex items-center justify-center rounded-full border-2 font-extrabold text-white ${
              compact
                ? "h-[26px] w-[26px] border-white text-[9px]"
                : "h-[34px] w-[34px] border-[#133838] text-[11px]"
            } ${index > 0 ? "-ml-2" : ""}`}
            style={{ background: `hsl(${170 + index * 25}, 60%, 45%)` }}
          >
            {initial}
          </div>
        ))}
      </div>
      <p
        className={`font-medium leading-snug ${
          compact
            ? "text-[11px] leading-[1.4] text-[#5F9090]"
            : "mt-2.5 text-[13px] text-white/50"
        }`}
      >
        Joined by{" "}
        <strong className={compact ? "text-[#0F3A3A]" : "text-white/75"}>
          12,400+
        </strong>{" "}
        members this month
      </p>
    </div>
  );
}

export default function LoginSignUpPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white lg:flex-row lg:bg-[#F7FAFA]">
      {/* Desktop left panel */}
      <div className="relative hidden min-h-0 w-[min(480px,38%)] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0D2A2A] to-[#133838] px-10 py-10 xl:w-[min(520px,40%)] xl:px-14 xl:py-12 lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border border-[#5DB9BF]/10" />
        <div className="pointer-events-none absolute -bottom-[120px] -left-[60px] h-[400px] w-[400px] rounded-full border border-[#5DB9BF]/7" />

        <div className="relative flex min-h-0 flex-1 flex-col justify-center">
          <div className="mb-8 flex items-center gap-2.5 xl:mb-10">
            <Image
              src={LOGO_SRC}
              alt="The Movie Studio"
              width={144}
              height={36}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <h2 className="mb-3 text-3xl font-black leading-[1.15] text-white xl:text-4xl">
            Real stories,
            <br />
            <span className="text-[#5DB9BF]">when you want them.</span>
          </h2>
          <p className="mb-8 text-sm font-medium leading-relaxed text-white/60 xl:mb-9 xl:text-[15px] xl:leading-[1.8]">
            Stream independent motion pictures from The Movie Studio — award-winning
            films, new releases, and exclusive premieres on any device.
          </p>

          <div className="flex flex-col gap-3.5">
            {TRUST_POINTS.map((point) => (
              <div key={point} className="flex items-center gap-2.5">
                <CheckCircleIcon className="h-4 w-4 shrink-0 text-[#5DB9BF]" />
                <span className="text-sm font-semibold text-white/75">
                  {point}
                </span>
              </div>
            ))}
          </div>

          <SocialProof />
        </div>
      </div>

      {/* Mobile header */}
      <div className="shrink-0 bg-gradient-to-br from-[#0D2A2A] to-[#133838] px-5 pb-5 pt-5 lg:hidden">
        <div className="mb-3 flex items-center gap-2">
          <Image
            src={LOGO_SRC}
            alt="The Movie Studio"
            width={120}
            height={28}
            priority
            className="h-7 w-auto object-contain"
          />
        </div>
        <h1 className="mb-1.5 text-2xl font-black leading-tight text-white">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-[13px] font-medium text-white/55">
          {mode === "login"
            ? "Log in to continue watching."
            : "Free to join. Start streaming today."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOBILE_TRUST_CHIPS.map((chip) => (
            <div key={chip} className="flex items-center gap-1">
              <CheckCircleIcon className="h-[11px] w-[11px] text-[#5DB9BF]" />
              <span className="text-[11px] font-semibold text-white/65">
                {chip}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form area */}
      <div className="min-h-0 flex-1 overflow-y-auto lg:flex lg:items-start lg:justify-center lg:px-8 lg:py-8 xl:px-10 xl:py-10">
        <div className="px-5 py-4 lg:w-full lg:max-w-[460px] lg:px-0 lg:py-0">
          <div className="w-full">
            <ModeToggle
              mode={mode}
              onChange={setMode}
              className="mb-4 bg-[#F0F6F6] lg:mb-6 lg:bg-white"
            />

            <div className="mb-5 hidden lg:block">
              <h1 className="mb-1.5 text-[26px] font-black text-[#0F3A3A]">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm font-medium text-[#5F9090]">
                {mode === "login"
                  ? "Log in to continue your watchlist."
                  : "Free to join. Pay only when you rent or buy."}
              </p>
            </div>

            {submitted && (
              <div className="mb-5 rounded-xl border border-[#5DB9BF]/30 bg-[#5DB9BF]/10 px-4 py-3 text-sm font-medium text-[#3E9AA0]">
                {mode === "login"
                  ? "Signing you in… (demo — no backend connected yet)"
                  : "Creating your account… (demo — no backend connected yet)"}
              </div>
            )}

            <div className="mb-4 lg:hidden">
              <SocialButtons compact />
            </div>
            <div className="mb-4 hidden lg:block">
              <SocialButtons />
            </div>

            <Divider
              label={
                <>
                  <span className="lg:hidden">or with email</span>
                  <span className="hidden lg:inline">or continue with email</span>
                </>
              }
            />

            <form
              onSubmit={handleSubmit}
              className="mt-4 flex flex-col gap-3 sm:gap-3 lg:mt-6 lg:gap-3.5"
            >
              {mode === "signup" && (
                <div>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <InputShell>
                    <UserIcon className="h-4 w-4 shrink-0 text-[#5F9090]" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      placeholder="Your first name"
                      className="flex-1 border-none bg-transparent text-sm text-[#0F3A3A] outline-none placeholder:text-[#5F9090]/60"
                    />
                  </InputShell>
                </div>
              )}

              <div>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <InputShell>
                  <MailIcon className="h-4 w-4 shrink-0 text-[#5F9090]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your@email.com"
                    className="flex-1 border-none bg-transparent text-sm text-[#0F3A3A] outline-none placeholder:text-[#5F9090]/60"
                  />
                </InputShell>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="cursor-pointer border-none bg-transparent p-0 text-[11px] font-bold text-[#5DB9BF] lg:text-xs"
                    >
                      <span className="lg:hidden">Forgot?</span>
                      <span className="hidden lg:inline">Forgot password?</span>
                    </button>
                  )}
                </div>
                <InputShell>
                  <LockIcon className="h-4 w-4 shrink-0 text-[#5F9090]" />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    required
                    minLength={mode === "signup" ? 8 : undefined}
                    placeholder={
                      mode === "signup"
                        ? "At least 8 characters"
                        : "Your password"
                    }
                    className="flex-1 border-none bg-transparent text-sm text-[#0F3A3A] outline-none placeholder:text-[#5F9090]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    className="flex cursor-pointer border-none bg-transparent p-0 text-[#5F9090]"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </InputShell>
              </div>

              {mode === "signup" && (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#5DB9BF]/15 bg-[#5DB9BF]/5 px-3 py-2.5 sm:px-3 sm:py-2.5 lg:px-3.5 lg:py-3">
                  <button
                    type="button"
                    onClick={() => setAgreed((value) => !value)}
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] border-2 lg:h-5 lg:w-5 lg:rounded-md ${
                      agreed
                        ? "border-[#5DB9BF] bg-[#5DB9BF]"
                        : "border-[#5DB9BF]/40 bg-white"
                    }`}
                    aria-pressed={agreed}
                    aria-label="Agree to terms"
                  >
                    {agreed && (
                      <CheckCircleIcon className="h-[11px] w-[11px] text-white lg:h-3 lg:w-3" />
                    )}
                  </button>
                  <p className="text-[11px] font-medium leading-relaxed text-[#5F9090] sm:text-[11px] lg:text-xs lg:leading-[1.6]">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-bold text-[#5DB9BF] hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-bold text-[#5DB9BF] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    . I understand The Movie Studio is for entertainment purposes
                    only.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={mode === "signup" && !agreed}
                className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-none bg-gradient-to-br from-[#5DB9BF] to-[#3E9AA0] px-3 py-2.5 text-sm font-extrabold text-white shadow-[0_6px_20px_-8px_#5DB9BF] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 lg:mt-2 lg:gap-2 lg:rounded-[14px] lg:px-4 lg:py-3.5 lg:text-[15px] lg:shadow-[0_8px_24px_-8px_#5DB9BF]"
              >
                {mode === "login" ? "Log In" : "Create My Account"}
                <ArrowRightIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </button>
            </form>

            <p className="mt-3 text-center text-xs font-medium text-[#5F9090] lg:mt-5 lg:text-[13px]">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="cursor-pointer border-none bg-transparent text-xs font-extrabold text-[#5DB9BF] lg:text-[13px]"
              >
                {mode === "login" ? "Sign up free" : "Log in"}
              </button>
            </p>

            <SocialProof compact />
          </div>
        </div>
      </div>
    </div>
  );
}
