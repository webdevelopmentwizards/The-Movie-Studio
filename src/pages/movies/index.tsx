"use client";

import Head from "next/head";
import { useMemo, useState } from "react";

import MovieCard from "@/components/MovieCard";
import PageHero from "@/components/PageHero";
import { getAllGenres, movies } from "@/data/movies";

export default function MoviesPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const genres = ["All", ...getAllGenres()];

  const filtered = useMemo(() => {
    return movies.filter((movie) => {
      const matchesGenre = genre === "All" || movie.genre.includes(genre);
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.genre.some((g) => g.toLowerCase().includes(query));
      return matchesGenre && matchesSearch;
    });
  }, [search, genre]);

  return (
    <>
      <Head>
        <title>All Movies — Movie Studio</title>
        <meta
          name="description"
          content="Browse Movie Studio's complete catalog of original films."
        />
      </Head>

      <PageHero
        eyebrow="Catalog"
        title="All Movies"
        subtitle="Explore our full collection of original films — from festival darlings to crowd favorites."
      />

      <section className="bg-zinc-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, director, or genre..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition-colors focus:border-amber-500 sm:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    genre === g
                      ? "bg-amber-500 text-zinc-950"
                      : "border border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-zinc-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <>
              <p className="mb-8 text-sm text-zinc-500">
                Showing {filtered.length} of {movies.length} films
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {filtered.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-20 text-center">
              <p className="text-lg text-zinc-400">No movies found.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Try adjusting your search or filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
