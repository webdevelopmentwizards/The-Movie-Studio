export interface Movie {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  trailer?: string;
  /** External full-movie link (e.g. Vimeo) */
  fullMovieUrl?: string;
  /** Password for the full-movie link, if protected */
  fullMoviePassword?: string;
  genre: string[];
  director: string;
  cast: string[];
  year: number;
  duration: string;
  rating: number;
  featured?: boolean;
}
