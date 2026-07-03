import Head from "next/head";
import Link from "next/link";

import HeroBanner from "@/components/HeroBanner";
import HomeAboutSection from "@/components/HomeAboutSection";
import HomeContactSection from "@/components/HomeContactSection";
import MovieSwiper from "@/components/MovieSwiper";
import NewReleasesSwiper from "@/components/NewReleasesSwiper";
import { heroSlides } from "@/data/heroSlides";
import {
  getFeaturedMovies,
  getMoviesByGenres,
  getTrendingMovies,
  movies,
} from "@/data/movies";

export default function Home() {
  const featured = getFeaturedMovies();

  return (
    <>
      <Head>
        <title>Movie Studio — Stories That Move the World</title>
        <meta
          name="description"
          content="Discover original films, award-winning stories, and cinematic experiences from Movie Studio."
        />
      </Head>

      <HeroBanner slides={heroSlides} />

      <HomeContactSection />

      <NewReleasesSwiper movies={movies} />

      <MovieSwiper
        title="Featured Films"
        movies={featured}
        bordered={false}
      />

      <MovieSwiper
        title="Trending Now"
        movies={getTrendingMovies()}
        bordered={false}
      />


      <MovieSwiper
        eyebrow="Chills & Thrills"
        title="Horror & Thriller"
        movies={getMoviesByGenres(["Horror", "Thriller"])}
        bordered={false}
      />

      <MovieSwiper
        eyebrow="Heart & Soul"
        title="Drama Picks"
        movies={getMoviesByGenres(["Drama"])}
        bordered={false}
      />
      <HomeAboutSection />

      <section className="border-t border-zinc-800 bg-zinc-900/30 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:rounded-3xl sm:p-10 md:p-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-zinc-50 sm:text-3xl md:text-4xl">
                Ready to discover your next favorite film?
              </h2>
              <p className="mt-4 text-zinc-400 md:text-lg">
                Browse our complete catalog of originals, exclusives, and
                festival favorites.
              </p>
              <Link
                href="/movies"
                className="mt-8 inline-block rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400"
              >
                Browse All Movies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
