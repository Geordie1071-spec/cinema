export interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  release_date: string;
}

export interface MovieDetail {
  id: number;
  runtime: number | null;
}

export interface MovieLogo {
  file_path: string;
  iso_639_1: string | null;
}

export interface MovieImages {
  logos: MovieLogo[];
}

export type GenreMap = Record<number, string>;

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
