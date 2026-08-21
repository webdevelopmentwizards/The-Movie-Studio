"use client";

interface WatchMovieButtonProps {
  compact?: boolean;
  className?: string;
}

export const watchMovieButtonClass = (compact: boolean) =>
  `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-500 bg-amber-500 font-semibold text-zinc-950 ${
    compact ? "px-3 py-1.5 text-xs" : "gap-2 px-6 py-3 text-sm"
  }`;

export default function WatchMovieButton({
  compact = false,
  className = "",
}: WatchMovieButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`${watchMovieButtonClass(compact)} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={compact ? "h-3 w-3" : "h-4 w-4"}
        aria-hidden
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      Watch the movie
    </button>
  );
}
