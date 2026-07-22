export interface Movie {
  id: number;
  title: string;
  overview?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  release_date: string;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  runtime: number | null;
  release_date: string;
  vote_average: number;
  backdrop_path: string | null;
  poster_path: string | null;
  genres: MovieGenre[];
  tagline?: string;
}

export interface MovieLogo {
  file_path: string;
  iso_639_1: string | null;
}

export interface MovieImages {
  logos: MovieLogo[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieExtras {
  runtime: number | null;
  logoUrl: string | null;
}

export type GenreMap = Record<number, string>;
export type ExtrasMap = Record<number, MovieExtras>;

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
