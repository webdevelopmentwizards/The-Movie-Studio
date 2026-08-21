"use client";

import { THE_MOVIE_STUDIO_YOUTUBE_URL } from "@/constants/links";

import YouTubeIcon from "./YouTubeIcon";

interface BehindTheScenesButtonProps {
  compact?: boolean;
  className?: string;
}

export const behindTheScenesButtonClass = (compact: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border border-red-600/50 bg-red-600/10 font-semibold text-red-500 transition-colors hover:bg-red-600/20 hover:text-red-400 ${
    compact ? "px-3 py-1.5 text-xs" : "gap-2 px-6 py-3 text-sm"
  }`;

export const behindTheScenesLabel = (compact: boolean) =>
  compact ? "Live on Location" : "Live on Location / Behind the Scenes";

export default function BehindTheScenesButton({
  compact = false,
  className = "",
}: BehindTheScenesButtonProps) {
  return (
    <a
      href={THE_MOVIE_STUDIO_YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`${behindTheScenesButtonClass(compact)} ${className}`}
    >
      <YouTubeIcon compact={compact} />
      {behindTheScenesLabel(compact)}
    </a>
  );
}
