"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import PageHero from "@/components/PageHero";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  MEMBERSHIP_PLANS,
  type MembershipPlanId,
} from "@/lib/membershipPlans";

const PLAN_ORDER: MembershipPlanId[] = ["monthly", "yearly"];

export default function MembershipPage() {
  const [selected, setSelected] = useState<MembershipPlanId>("yearly");
  const { isLoggedIn, isMember } = useMemberSession();

  return (
    <>
      <Head>
        <title>Membership — The Movie Studio</title>
        <meta
          name="description"
          content="Become a Movie Studio Member and receive valuable access behind the velvet rope."
        />
      </Head>

      <PageHero
        eyebrow="Behind the velvet rope"
        title="Movie Studio Membership"
        subtitle="Unlock behind-the-scenes footage, live set access, first looks, ad-free premieres, VIP events, and exclusive merchandise."
      />

      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              Choose your access
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Monthly or yearly — both plans open the velvet rope. Yearly members
              get the full merch drop on top.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            {PLAN_ORDER.map((id) => {
              const plan = MEMBERSHIP_PLANS[id];
              const isSelected = selected === id;
              const isYearly = id === "yearly";

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  className={`relative rounded-2xl border p-6 text-left transition-colors sm:p-7 ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                  }`}
                >
                  {"badge" in plan && plan.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
                      {plan.badge}
                    </span>
                  )}
                  <p className="text-sm font-semibold text-zinc-200">
                    {plan.name}
                  </p>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-zinc-50">
                      {plan.priceLabel}
                    </span>
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {plan.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {plan.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300 sm:text-sm"
                      >
                        <span className="mt-0.5 text-amber-400" aria-hidden>
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                    {isYearly && (
                      <>
                        <li className="pt-2 text-xs font-semibold text-amber-300 sm:text-sm">
                          Yearly extras — Movie Studio merchandise, including:
                        </li>
                        {MEMBERSHIP_PLANS.yearly.merchItems.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 pl-4 text-xs leading-relaxed text-amber-200/90 sm:text-sm"
                          >
                            <span className="mt-0.5 text-amber-400" aria-hidden>
                              +
                            </span>
                            {item}
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            {isMember ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                >
                  Open Member Dashboard
                </Link>
                <p className="text-xs text-zinc-500">
                  You&apos;re already a member — manage benefits from your hub.
                </p>
              </>
            ) : (
              <>
                <Link
                  href={
                    isLoggedIn
                      ? `/dashboard/pay?plan=${selected}`
                      : `/signup?next=${encodeURIComponent(`/dashboard/pay?plan=${selected}`)}`
                  }
                  className="inline-flex rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                >
                  Become a Member — {MEMBERSHIP_PLANS[selected].priceLabel}
                </Link>
                <p className="text-xs text-zinc-500">
                  {isLoggedIn
                    ? "Complete payment to unlock membership access."
                    : (
                      <>
                        Create an account or{" "}
                        <Link
                          href={`/login?next=${encodeURIComponent(`/dashboard/pay?plan=${selected}`)}`}
                          className="font-medium text-amber-400 hover:text-amber-300"
                        >
                          sign in
                        </Link>
                        , then complete payment.
                      </>
                    )}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
