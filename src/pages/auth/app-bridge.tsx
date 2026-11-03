"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Logo from "@/components/Logo";
import { useApi } from "@/context/ApiContext";
import {
  isMembershipPlanId,
  type MembershipPlanId,
} from "@/lib/membershipPlans";
import {
  authService,
  getApiErrorMessage,
} from "@/services";
import { useAppDispatch } from "@/store";
import { bootstrapAuth } from "@/store/apps/auth";

const APP_CANCEL_URI = "themoviestudio://membership/cancel";

function planFromQuery(value: string | string[] | undefined): MembershipPlanId {
  const raw = Array.isArray(value) ? value[0] : value;
  return isMembershipPlanId(raw) ? raw : "yearly";
}

export default function AppBridgePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useApi();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || started.current) return;
    started.current = true;

    const codeRaw = router.query.code;
    const code = String(Array.isArray(codeRaw) ? codeRaw[0] : codeRaw || "").trim();
    const planId = planFromQuery(router.query.plan);

    if (!code) {
      setError("This payment link is missing. Go back to the app and try again.");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        await authService.consumeAppBridge(code);
        if (cancelled) return;
        await dispatch(bootstrapAuth());
        if (cancelled) return;
        void router.replace(
          `/dashboard/pay?plan=${encodeURIComponent(planId)}&from=app`,
        );
      } catch (err) {
        if (cancelled) return;
        const message = getApiErrorMessage(
          err,
          "This payment link has expired. Go back to the app and try again.",
        );
        setError(message);
        toast.error(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, router, toast]);

  return (
    <>
      <Head>
        <title>Opening payment — Movie Studio</title>
      </Head>

      <section className="relative flex min-h-dvh items-center justify-center overflow-x-hidden bg-zinc-950 px-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950" />
        <div className="relative w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <Logo size="md" priority />
          </div>

          {error ? (
            <>
              <h1 className="text-xl font-bold text-zinc-50">
                Unable to open payment
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {error}
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={APP_CANCEL_URI}
                  className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                >
                  Return to app
                </a>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-amber-400 hover:text-amber-300"
                >
                  Sign in on the website
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400" />
              <h1 className="mt-6 text-xl font-bold text-zinc-50">
                Opening payment…
              </h1>
              <p className="mt-3 text-sm text-zinc-400">
                Signing you in securely from the app.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
