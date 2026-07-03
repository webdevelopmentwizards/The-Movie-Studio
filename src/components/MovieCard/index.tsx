import Link from "next/link";

import type { Movie } from "@/types/movie";

import MoviePosterHover from "./MoviePosterHover";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const href = `/movies/${movie.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10">
      <MoviePosterHover
        movie={movie}
        href={href}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <Link href={href} className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-zinc-50 transition-colors group-hover:text-amber-400">
          {movie.title}
        </h3>
        <p className="text-sm text-zinc-400">
          {movie.year} · {movie.duration}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          {movie.genre.map((genre) => (
            <span
              key={genre}
              className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300"
            >
              {genre}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
