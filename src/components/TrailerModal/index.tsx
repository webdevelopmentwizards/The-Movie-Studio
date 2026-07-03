"use client";

import { useEffect, useRef } from "react";

interface TrailerModalProps {
  trailerUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({
  trailerUrl,
  title,
  isOpen,
  onClose,
}: TrailerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      videoRef.current?.play().catch(() => undefined);
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="min-w-0 truncate text-base font-semibold text-zinc-50 sm:text-lg">
            {title} — Trailer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-500 hover:text-amber-400"
            aria-label="Close trailer"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video bg-black">
          <video
            ref={videoRef}
            src={trailerUrl}
            controls
            playsInline
            className="h-full w-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
