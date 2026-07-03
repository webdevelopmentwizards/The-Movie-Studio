"use client";

import Image from "next/image";
import Link from "next/link";

import WatchTrailerLink from "@/components/WatchTrailerButton/WatchTrailerLink";
import type { Movie } from "@/types/movie";

interface MoviePosterHoverProps {
  movie: Movie;
  href: string;
  sizes: string;
  showRating?: boolean;
}

export default function MoviePosterHover({
  movie,
  href,
  sizes,
  showRating = true,
}: MoviePosterHoverProps) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden">
      <Link href={href} className="absolute inset-0 z-0 block" tabIndex={-1}>
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={sizes}
        />
      </Link>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {movie.trailer && <WatchTrailerLink href={`${href}?trailer=1`} compact />}
      </div>

      {showRating && (
        <span className="absolute right-3 top-3 z-40 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-zinc-950">
          ★ {movie.rating}
        </span>
      )}
    </div>
  );
}
