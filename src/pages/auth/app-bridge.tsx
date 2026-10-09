import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Logo from "@/components/Logo";
import { isMembershipPlanId } from "@/lib/membershipPlans";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/services/axiosInstance";

/**
 * App handoff only. Web customers never land here; they keep /login and /dashboard/pay.
 */
export default function AppBridgePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;

    const rawCode = router.query.code;
    const code = (Array.isArray(rawCode) ? rawCode[0] : rawCode || "").trim();
    const rawPlan = router.query.plan;
    const planValue = Array.isArray(rawPlan) ? rawPlan[0] : rawPlan;
    const plan = isMembershipPlanId(planValue) ? planValue : "yearly";

    if (!code) {
      setError("This payment link is missing. Go back to the app and try again.");
      return;
    }

    void authService
      .consumeAppBridge(code)
      .then(() => {
        if (cancelled) return;
        window.location.replace(
          `/dashboard/pay?plan=${encodeURIComponent(plan)}&from=app`,
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          getApiErrorMessage(
            err,
            "This payment link has expired. Go back to the app and try again.",
          ),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.query.code, router.query.plan]);

  return (
    <>
      <Head>
        <title>Continue to payment — The Movie Studio</title>
      </Head>
      <section className="flex min-h-dvh items-center justify-center bg-zinc-950 px-5">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <Logo size="md" priority />
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            {error ? (
              <>
                <h1 className="text-xl font-bold text-zinc-50">
                  Couldn&apos;t open payment
                </h1>
                <p className="mt-3 text-sm text-zinc-400">{error}</p>
                <a
                  href="themoviestudio://membership/cancel"
                  className="mt-6 inline-block text-sm font-semibold text-amber-400"
                >
                  Return to the app
                </a>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-zinc-50">
                  Opening payment…
                </h1>
                <p className="mt-3 text-sm text-zinc-400">
                  Signing you in so you can pay on TheMovieStudio.com.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
