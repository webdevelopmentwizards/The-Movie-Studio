"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MEMBERSHIP_BENEFIT_SECTIONS } from "@/data/membershipBenefits";
import { memberInitials, type MemberSession } from "@/lib/memberSession";
import { MEMBERSHIP_PLANS } from "@/lib/membershipPlans";

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  ...MEMBERSHIP_BENEFIT_SECTIONS.map((section) => ({
    id: section.id,
    label: section.title,
  })),
];

type MemberDashboardProps = {
  session: MemberSession;
  onLogout: () => void;
};

export default function MemberDashboard({
  session,
  onLogout,
}: MemberDashboardProps) {
  const [activeId, setActiveId] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const plan = MEMBERSHIP_PLANS[session.planId];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    function apply() {
      if (mq.matches) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    }

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const scroller = contentRef.current;
    if (!scroller) return;

    function onScroll() {
      const container =
        window.matchMedia("(min-width: 1024px)").matches && scroller
          ? scroller
          : null;
      const marker = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: Number.POSITIVE_INFINITY };
        const offsetTop = container
          ? el.getBoundingClientRect().top -
            container.getBoundingClientRect().top -
            24
          : el.getBoundingClientRect().top - 120;
        return { id: item.id, top: Math.abs(offsetTop) };
      });
      marker.sort((a, b) => a.top - b.top);
      if (marker[0]) setActiveId(marker[0].id);
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function goTo(id: string) {
    setActiveId(id);
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    const scroller = contentRef.current;
    const useInnerScroll =
      window.matchMedia("(min-width: 1024px)").matches && scroller;

    if (useInnerScroll && scroller) {
      const top =
        el.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop -
        8;
      scroller.scrollTo({ top, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col bg-zinc-950 md:min-h-[calc(100dvh-6rem)] lg:h-[calc(100dvh-6rem)] lg:min-h-0 lg:overflow-hidden">
      <div className="shrink-0 border-b border-zinc-800 bg-zinc-950 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-zinc-500">Member dashboard</p>
            <p className="text-sm font-semibold text-zinc-100">{session.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-300"
          >
            {mobileNavOpen ? "Close" : "Menu"}
          </button>
        </div>
        {mobileNavOpen && (
          <nav className="max-h-56 overflow-y-auto border-t border-zinc-800 px-2 py-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm ${
                  activeId === item.id
                    ? "bg-amber-500/15 font-semibold text-amber-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex min-h-0 w-full flex-1 lg:overflow-hidden">
        <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex xl:w-72">
          <div className="shrink-0 border-b border-zinc-800 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-zinc-950">
                {memberInitials(session.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {session.name}
                </p>
                <p className="truncate text-xs text-zinc-500">{session.email}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Plan
              </p>
              <p className="mt-0.5 text-sm font-semibold text-amber-400">
                {plan.name} · {plan.priceLabel}
              </p>
            </div>
          </div>

          <nav className="thin-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Benefits
            </p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                className={`mb-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeId === item.id
                    ? "bg-amber-500/15 font-semibold text-amber-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="shrink-0 space-y-2 border-t border-zinc-800 p-4">
            <Link
              href="/movies"
              className="block rounded-lg bg-amber-500 px-3 py-2.5 text-center text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              Browse Movies
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="block w-full rounded-lg border border-zinc-700 px-3 py-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              Sign out
            </button>
          </div>
        </aside>

        <main
          ref={contentRef}
          className="thin-scroll min-h-0 min-w-0 flex-1 lg:overflow-y-auto lg:overscroll-contain"
        >
          <section
            id="overview"
            className="border-b border-zinc-800 px-4 py-8 sm:px-6 sm:py-10 lg:px-10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
              Welcome behind the velvet rope
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              Hi {session.name.split(" ")[0]}, your member hub
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              You&apos;re on the{" "}
              <span className="font-semibold text-zinc-200">{plan.name}</span>{" "}
              plan ({plan.priceLabel} {plan.period}). Member since{" "}
              {new Date(session.memberSince).toLocaleDateString()}. Use the
              sidebar to jump between benefits.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {MEMBERSHIP_BENEFIT_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => goTo(section.id)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left transition-colors hover:border-amber-500/40 hover:bg-zinc-900"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                    {section.eyebrow}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-100">
                    {section.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {section.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {MEMBERSHIP_BENEFIT_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="border-b border-zinc-800 px-4 py-8 sm:px-6 sm:py-10 lg:px-10"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                {section.eyebrow}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">
                {section.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                {section.subtitle}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
                  >
                    {item.image && (
                      <div className="relative aspect-[16/10] bg-zinc-900">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tag && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                            {item.tag}
                          </span>
                        )}
                        {item.meta && (
                          <span className="text-[11px] text-zinc-500">
                            {item.meta}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-zinc-100">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
