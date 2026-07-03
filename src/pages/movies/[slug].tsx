import Head from "next/head";
import Image from "next/image";
import type { GetStaticPaths, GetStaticProps } from "next";

import MovieDetailActions from "@/components/MovieDetailActions";
import MovieDetailHero from "@/components/MovieDetailHero";
import MovieSwiper from "@/components/MovieSwiper";
import {
  getMovieBySlug,
  getRelatedMovies,
  movies,
} from "@/data/movies";
import type { Movie } from "@/types/movie";

interface Props {
  movie: Movie;
  related: Movie[];
}

export default function MovieDetail({ movie, related }: Props) {
  return (
    <>
      <Head>
        <title>{`${movie.title} — Movie Studio`}</title>
        <meta name="description" content={movie.synopsis} />
      </Head>

      <MovieDetailHero movie={movie} />

      <section className="relative bg-zinc-950 pb-12 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="-mt-20 flex flex-col gap-8 sm:-mt-24 sm:gap-10 lg:-mt-32 lg:flex-row">
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl border-2 border-zinc-800 shadow-2xl sm:max-w-[280px] lg:mx-0">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>

            <div className="min-w-0 flex-1 pt-2 sm:pt-4 lg:pt-16">
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="mt-3 text-2xl font-bold text-zinc-50 sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
                {movie.title}
              </h1>
              <p className="mt-2 text-base italic text-zinc-400 sm:text-lg">{movie.tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 sm:mt-6 sm:gap-6 sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-400">★</span>
                  <span className="font-semibold text-zinc-200">{movie.rating}</span>
                  /10
                </span>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                <span>Dir. {movie.director}</span>
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:mt-8 sm:text-base">
                {movie.synopsis}
              </p>

              {movie.cast.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    Cast
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {movie.cast.map((actor) => (
                      <span
                        key={actor}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <MovieDetailActions movie={movie} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <MovieSwiper
          eyebrow="More to watch"
          title="You May Also Like"
          movies={related}
        />
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: movies.map((movie) => ({ params: { slug: movie.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const movie = getMovieBySlug(slug);

  if (!movie) {
    return { notFound: true };
  }

  return {
    props: {
      movie,
      related: getRelatedMovies(movie),
    },
  };
};
