import type { GenreMap, Movie, MovieDetail, MovieImages } from "./types";
import { TMDB_IMAGE_BASE } from "./types";
import { tmdbFetch } from "./tmdb-server";

export function cleanMovies(
  list: Movie[] | undefined,
  limit: number
): Movie[] {
  return (list || [])
    .filter((m) => m.backdrop_path && m.poster_path)
    .slice(0, limit);
}

export function pickLogoUrl(images: MovieImages): string | null {
  const logos = (images.logos || []).filter((l) => l.file_path);
  const en = logos.find((l) => l.iso_639_1 === "en") || logos[0];
  return en ? `${TMDB_IMAGE_BASE}w500${en.file_path}` : null;
}

export function backdropUrl(path: string | null, size = "w1280") {
  return path ? `${TMDB_IMAGE_BASE}${size}${path}` : "";
}

export function posterUrl(path: string | null, size = "w342") {
  return path ? `${TMDB_IMAGE_BASE}${size}${path}` : "";
}

export function formatRuntime(runtime: number | null | undefined) {
  if (runtime == null) return "—";
  return `${Math.floor(runtime / 60)} h ${runtime % 60} min`;
}

export async function getGenreMap(): Promise<GenreMap> {
  const data = await tmdbFetch("/genre/movie/list?language=en-US");
  const map: GenreMap = {};
  for (const g of data.genres || []) map[g.id] = g.name;
  return map;
}

export async function getNowPlaying(): Promise<Movie[]> {
  const data = await tmdbFetch("/movie/now_playing?language=en-US&page=1");
  return cleanMovies(data.results, 4);
}

export async function getUpcoming(): Promise<Movie[]> {
  const data = await tmdbFetch("/movie/upcoming?language=en-US&page=1");
  return cleanMovies(data.results, 6);
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const data = await tmdbFetch(`/movie/${id}?language=en-US`);
  return { id: data.id, runtime: data.runtime ?? null };
}

export async function getMovieImages(id: number): Promise<MovieImages> {
  const data = await tmdbFetch(
    `/movie/${id}/images?include_image_language=en,null`
  );
  return { logos: data.logos || [] };
}

export async function getMovieExtras(id: number) {
  const [detail, images] = await Promise.all([
    getMovieDetail(id),
    getMovieImages(id),
  ]);
  return {
    runtime: detail.runtime,
    logoUrl: pickLogoUrl(images),
  };
}
