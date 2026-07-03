"use client";

import { useEffect, useState } from "react";

import TrailerModal from "@/components/TrailerModal";

interface WatchTrailerButtonProps {
  trailerUrl: string;
  title: string;
  compact?: boolean;
  className?: string;
  autoOpen?: boolean;
}

export const watchTrailerButtonClass = (compact: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/10 font-semibold text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300 ${
    compact ? "px-3 py-1.5 text-xs" : "gap-2 px-6 py-3 text-sm"
  }`;

export default function WatchTrailerButton({
  trailerUrl,
  title,
  compact = false,
  className = "",
  autoOpen = false,
}: WatchTrailerButtonProps) {
  const [open, setOpen] = useState(autoOpen);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
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
      </button>
      <TrailerModal
        trailerUrl={trailerUrl}
        title={title}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
