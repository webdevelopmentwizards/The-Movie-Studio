"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import MoviePosterHover from "@/components/MovieCard/MoviePosterHover";
import type { Movie } from "@/types/movie";

import "swiper/css";

interface MovieSwiperProps {
  eyebrow?: string;
  title: string;
  movies: Movie[];
  bordered?: boolean;
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const navButtonClass =
  "absolute top-[38%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/90 text-amber-400 shadow-lg backdrop-blur-sm transition-all hover:border-amber-500/60 hover:bg-amber-500/15 hover:text-amber-300 disabled:pointer-events-none disabled:opacity-30 md:h-10 md:w-10";

function MovieSlide({ movie }: { movie: Movie }) {
  const href = `/movies/${movie.slug}`;

  return (
    <div className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition-all hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
      <MoviePosterHover
        movie={movie}
        href={href}
        sizes="(max-width: 768px) 45vw, (max-width: 1280px) 22vw, 20vw"
        showRating={false}
      />
      <Link href={href} className="block p-3">
        <h3 className="truncate text-sm font-semibold text-zinc-50 transition-colors group-hover:text-amber-400">
          {movie.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          {movie.year} · {movie.duration}
        </p>
      </Link>
    </div>
  );
}

export default function MovieSwiper({
  eyebrow,
  title,
  movies,
  bordered = true,
}: MovieSwiperProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const slideMovies = useMemo(() => {
    if (movies.length >= 12) return movies;
    return [...movies, ...movies];
  }, [movies]);

  return (
    <section
      className={`bg-zinc-950 py-12 md:py-16 ${bordered ? "border-b border-zinc-800" : ""}`}
    >
      <div className="mb-8 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-14">
        <div>
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-2xl font-bold text-zinc-50 md:text-3xl">
            {title}
          </h2>
        </div>
        <Link
          href="/movies"
          className="shrink-0 text-sm font-semibold text-zinc-400 transition-colors hover:text-amber-400"
        >
          View all →
        </Link>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-14">
          <button
            ref={prevRef}
            type="button"
            aria-label={`Previous ${title.toLowerCase()}`}
            className={`${navButtonClass} -left-1 sm:left-0`}
          >
            <ChevronLeft />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label={`Next ${title.toLowerCase()}`}
            className={`${navButtonClass} -right-1 sm:right-0`}
          >
            <ChevronRight />
          </button>

          <Swiper
            modules={[Navigation]}
            loop
            grabCursor
            watchOverflow={false}
            spaceBetween={20}
            slidesPerView={1.6}
            breakpoints={{
              360: { slidesPerView: 2, spaceBetween: 16 },
              480: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 22 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 24 },
              1536: { slidesPerView: 5, spaceBetween: 28 },
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            onInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            className="movie-swiper w-full overflow-hidden"
          >
            {slideMovies.map((movie, index) => (
              <SwiperSlide key={`${movie.id}-${index}`}>
                <MovieSlide movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
      </div>
    </section>
  );
}
