import MovieSwiper from "@/components/MovieSwiper";
import type { Movie } from "@/types/movie";

interface NewReleasesSwiperProps {
  movies: Movie[];
}

export default function NewReleasesSwiper({ movies }: NewReleasesSwiperProps) {
  return (
    <MovieSwiper
      eyebrow="Fresh Picks"
      title="New Releases"
      movies={movies}
    />
  );
}
