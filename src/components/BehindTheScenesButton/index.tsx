"use client";

import Link from "next/link";

interface BehindTheScenesButtonProps {
  compact?: boolean;
  className?: string;
}

export const behindTheScenesButtonClass = (compact: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-900/80 font-semibold text-zinc-100 transition-colors hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400 ${
    compact ? "px-3 py-1.5 text-xs" : "gap-2 px-6 py-3 text-sm"
  }`;

export const behindTheScenesLabel = (compact: boolean) =>
  compact ? "Live on Location" : "Live on Location / Behind the Scenes";

export default function BehindTheScenesButton({
  compact = false,
  className = "",
}: BehindTheScenesButtonProps) {
  return (
    <Link
      href="/signup"
      onClick={(e) => e.stopPropagation()}
      className={`${behindTheScenesButtonClass(compact)} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={compact ? "h-3 w-3" : "h-4 w-4"}
        aria-hidden
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
      </svg>
      {behindTheScenesLabel(compact)}
    </Link>
  );
}
