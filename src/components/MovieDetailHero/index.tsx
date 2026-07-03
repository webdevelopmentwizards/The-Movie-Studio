"use client";

import { getHeroBackdropForMovie } from "@/data/heroSlides";
import type { Movie } from "@/types/movie";

interface MovieDetailHeroProps {
  movie: Movie;
}

export default function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const backdrop = getHeroBackdropForMovie(movie.slug, movie.backdrop);

  return (
    <section className="relative h-[45vh] overflow-hidden bg-zinc-950 sm:h-[55vh] md:h-[60vh]">
      {/* Blurred fill so the full banner can sit on top without empty bars */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backdrop}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-40 blur-2xl"
      />

      {/* Full banner image (entire image visible) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backdrop}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-contain object-center"
      />

      {/* Black transparent gradient rising from the bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
    </section>
  );
}
