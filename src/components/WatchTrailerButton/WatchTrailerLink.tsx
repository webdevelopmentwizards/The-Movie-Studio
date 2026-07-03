"use client";

import Link from "next/link";

import { watchTrailerButtonClass } from "@/components/WatchTrailerButton";

interface WatchTrailerLinkProps {
  href: string;
  compact?: boolean;
  className?: string;
}

export default function WatchTrailerLink({
  href,
  compact = false,
  className = "",
}: WatchTrailerLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={`${watchTrailerButtonClass(compact)} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={compact ? "h-3 w-3" : "h-4 w-4"}
        aria-hidden
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      Watch Trailer
    </Link>
  );
}
