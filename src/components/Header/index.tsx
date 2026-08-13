"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Logo from "@/components/Logo";
import { useMemberSession } from "@/hooks/useMemberSession";
import { memberInitials } from "@/lib/memberSession";
import { markHeroAudioUnlocked } from "@/utils/heroAudio";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { session, isLoggedIn, logout } = useMemberSession();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setAccountOpen(false);
    setOpen(false);
    void router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <nav className="flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-14 md:h-24">
        <Logo priority />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onPointerDown={markHeroAudioUnlocked}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-amber-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/movies"
            onPointerDown={markHeroAudioUnlocked}
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
          >
            Browse Movies
          </Link>

          {isLoggedIn && session ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 py-1.5 pl-1.5 pr-3 transition-colors hover:border-amber-500/50"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-zinc-950">
                  {memberInitials(session.name)}
                </span>
                <span className="max-w-[120px] truncate text-sm font-medium text-zinc-200">
                  {session.name.split(" ")[0]}
                </span>
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/40"
                >
                  <div className="border-b border-zinc-800 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-zinc-100">
                      {session.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {session.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-amber-400"
                  >
                    Member Dashboard
                  </Link>
                  <Link
                    href="/membership"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-amber-400"
                  >
                    Manage Plan
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full border-t border-zinc-800 px-4 py-2.5 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              onPointerDown={markHeroAudioUnlocked}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-amber-400"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="animate-menu-in absolute inset-x-0 top-full z-50 border-t border-zinc-800 bg-zinc-950 px-4 py-4 shadow-xl shadow-black/40 sm:px-6 lg:px-10 xl:px-14 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onPointerDown={markHeroAudioUnlocked}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/movies"
              onPointerDown={markHeroAudioUnlocked}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-amber-500 px-5 py-2.5 text-center text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
            >
              Browse Movies
            </Link>

            {isLoggedIn && session ? (
              <>
                <div className="mt-2 rounded-lg border border-zinc-800 px-3 py-3">
                  <p className="text-sm font-semibold text-zinc-100">
                    {session.name}
                  </p>
                  <p className="text-xs text-zinc-500">{session.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-amber-400"
                >
                  Member Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-2 py-2 text-left text-sm font-medium text-zinc-400"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
