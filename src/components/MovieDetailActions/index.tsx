"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import WatchTrailerButton from "@/components/WatchTrailerButton";
import type { Movie } from "@/types/movie";

interface MovieDetailActionsProps {
  movie: Movie;
}

export default function MovieDetailActions({ movie }: MovieDetailActionsProps) {
  const router = useRouter();
  const [autoOpenTrailer, setAutoOpenTrailer] = useState(false);

  useEffect(() => {
    if (!router.isReady || router.query.trailer !== "1") return;

    setAutoOpenTrailer(true);
    void router.replace(`/movies/${router.query.slug as string}`, undefined, {
      shallow: true,
    });
  }, [router.isReady, router.query.trailer, router.query.slug, router]);

  return (
    <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
      {movie.trailer && (
        <WatchTrailerButton
          trailerUrl={movie.trailer}
          title={movie.title}
          autoOpen={autoOpenTrailer}
        />
      )}
      <Link
        href="/movies"
        className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-semibold text-zinc-200 transition-colors hover:border-amber-500 hover:text-amber-400"
      >
        ← Back to Movies
      </Link>
    </div>
  );
}
