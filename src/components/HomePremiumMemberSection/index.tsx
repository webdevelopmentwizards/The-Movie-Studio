import Link from "next/link";

import { MEMBERSHIP_PLANS } from "@/lib/membershipPlans";

const HIGHLIGHTS = [
  {
    title: "Behind-the-scenes",
    text: "Watch how scenes were shot, directed, and cut — past the final frame.",
  },
  {
    title: "Live on location",
    text: "Member set visits, livestream walkthroughs, and on-set access windows.",
  },
  {
    title: "First looks",
    text: "See upcoming projects before the public, plus ad-free new releases.",
  },
  {
    title: "VIP & merch",
    text: "Parties, step-and-repeat events, studio gear, and member-only drops.",
  },
] as const;

export default function HomePremiumMemberSection() {
  const monthly = MEMBERSHIP_PLANS.monthly;
  const yearly = MEMBERSHIP_PLANS.yearly;

  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgba(245,158,11,0.14),transparent)]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl md:text-5xl">
              Become A Premium Member
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Get valuable access the public never sees — behind-the-scenes
              footage, live set visits, first looks, ad-free premieres, VIP
              events, and exclusive merchandise.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
              >
                Become A Premium Member
              </Link>
              <p className="text-xs text-zinc-500 sm:pl-1">
                From {monthly.priceLabel}/mo · or {yearly.priceLabel}/year
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-amber-500/35 bg-zinc-900/70 p-6 shadow-[0_0_60px_-20px_rgba(245,158,11,0.45)] sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400">
              Member Pass
            </p>
            <p className="mt-2 text-xl font-bold text-zinc-50">
              The Movie Studio
            </p>
            <p className="mt-1 text-sm text-zinc-500">Premium access card</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {monthly.name}
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-50">
                  {monthly.priceLabel}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{monthly.period}</p>
              </div>
              <div className="relative rounded-2xl border border-amber-500 bg-amber-500/10 p-4">
                <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-950">
                  {yearly.badge}
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-400">
                  {yearly.name}
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-50">
                  {yearly.priceLabel}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{yearly.period}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
            >
              <h3 className="text-sm font-semibold text-zinc-100">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
