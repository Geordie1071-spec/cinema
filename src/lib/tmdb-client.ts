import type { GenreMap, Movie, MovieDetail, MovieImages } from "./types";
import { cleanMovies, pickLogoUrl } from "./movies";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${url}`);
  return res.json() as Promise<T>;
}

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  return getJson<MovieDetail>(`/api/tmdb/movies/${id}`);
}

export async function fetchMovieImages(id: number): Promise<MovieImages> {
  return getJson<MovieImages>(`/api/tmdb/movies/${id}/images`);
}

export async function fetchMovieExtras(id: number) {
  const [detail, images] = await Promise.all([
    fetchMovieDetail(id),
    fetchMovieImages(id),
  ]);
  return {
    runtime: detail.runtime,
    logoUrl: pickLogoUrl(images),
  };
}

export async function fetchGenreMap(): Promise<GenreMap> {
  const data = await getJson<{ genres: { id: number; name: string }[] }>(
    "/api/tmdb/genres"
  );
  const map: GenreMap = {};
  for (const g of data.genres || []) map[g.id] = g.name;
  return map;
}

export async function fetchNowPlaying(): Promise<Movie[]> {
  const data = await getJson<{ results: Movie[] }>(
    "/api/tmdb/movies/now-playing"
  );
  return cleanMovies(data.results);
}

export async function fetchUpcoming(): Promise<Movie[]> {
  const data = await getJson<{ results: Movie[] }>(
    "/api/tmdb/movies/upcoming"
  );
  return cleanMovies(data.results);
}
