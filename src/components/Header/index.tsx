"use client";

import Link from "next/link";
import { useState } from "react";

import Logo from "@/components/Logo";
import { markHeroAudioUnlocked } from "@/utils/heroAudio";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
          </div>
        </div>
      )}
    </header>
  );
}
