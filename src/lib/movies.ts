import { NOW_PLAYING_IDS, UPCOMING_IDS } from "./catalogue";
import type {
  ExtrasMap,
  GenreMap,
  Movie,
  MovieDetail,
  MovieImages,
  MovieVideo,
} from "./types";
import { TMDB_IMAGE_BASE } from "./types";
import { tmdbFetch } from "./tmdb-server";

export function cleanMovies(
  list: Movie[] | undefined,
  limit?: number
): Movie[] {
  const cleaned = (list || []).filter((m) => m.backdrop_path && m.poster_path);
  return limit == null ? cleaned : cleaned.slice(0, limit);
}

function toMovie(data: Record<string, unknown>): Movie {
  const genres = (data.genres as { id: number }[] | undefined) || [];
  return {
    id: data.id as number,
    title: (data.title as string) || "",
    overview: (data.overview as string) || "",
    backdrop_path: (data.backdrop_path as string | null) ?? null,
    poster_path: (data.poster_path as string | null) ?? null,
    genre_ids:
      (data.genre_ids as number[] | undefined) ||
      genres.map((g) => g.id),
    vote_average: (data.vote_average as number) ?? 0,
    release_date: (data.release_date as string) || "",
  };
}

export async function getMoviesByIds(ids: readonly number[]): Promise<Movie[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const data = await tmdbFetch(`/movie/${id}?language=en-US`);
        return toMovie(data);
      } catch (err) {
        console.error(`Failed to load movie ${id}`, err);
        return null;
      }
    })
  );
  return cleanMovies(results.filter((m): m is Movie => m != null));
}

export function pickLogoUrl(images: MovieImages): string | null {
  const logos = (images.logos || []).filter((l) => l.file_path);
  const en = logos.find((l) => l.iso_639_1 === "en") || logos[0];
  return en ? `${TMDB_IMAGE_BASE}w500${en.file_path}` : null;
}

export function pickTrailer(videos: MovieVideo[]): MovieVideo | null {
  const yt = videos.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ||
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    yt[0] ||
    null
  );
}

export function backdropUrl(path: string | null, size = "w1280") {
  return path ? `${TMDB_IMAGE_BASE}${size}${path}` : "";
}

export function posterUrl(path: string | null, size = "w500") {
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
  return getMoviesByIds(NOW_PLAYING_IDS);
}

export async function getUpcoming(): Promise<Movie[]> {
  return getMoviesByIds(UPCOMING_IDS);
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const data = await tmdbFetch(`/movie/${id}?language=en-US`);
  return {
    id: data.id,
    title: data.title,
    overview: data.overview || "",
    runtime: data.runtime ?? null,
    release_date: data.release_date || "",
    vote_average: data.vote_average ?? 0,
    backdrop_path: data.backdrop_path,
    poster_path: data.poster_path,
    genres: data.genres || [],
    tagline: data.tagline || "",
  };
}

export async function getMovieImages(id: number): Promise<MovieImages> {
  const data = await tmdbFetch(
    `/movie/${id}/images?include_image_language=en,null`
  );
  return { logos: data.logos || [] };
}

export async function getMovieVideos(id: number): Promise<MovieVideo[]> {
  const data = await tmdbFetch(`/movie/${id}/videos?language=en-US`);
  return data.results || [];
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

export async function getExtrasMap(movies: Movie[]): Promise<ExtrasMap> {
  const unique = Array.from(new Map(movies.map((m) => [m.id, m])).values());
  const entries = await Promise.all(
    unique.map(async (m) => [m.id, await getMovieExtras(m.id)] as const)
  );
  return Object.fromEntries(entries);
}

export async function getMoviePageData(id: number) {
  const [detail, images, videos] = await Promise.all([
    getMovieDetail(id),
    getMovieImages(id),
    getMovieVideos(id),
  ]);
  return {
    detail,
    logoUrl: pickLogoUrl(images),
    trailer: pickTrailer(videos),
  };
}

/** Deterministic cinema showtimes for demo (TMDB has no showtimes). */
export function getShowDates(movieId: number, releaseDate: string) {
  const seed = movieId % 7;
  const start = releaseDate ? new Date(`${releaseDate}T20:30:00`) : new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let cursor = start < today ? new Date(today) : new Date(start);
  cursor.setHours(0, 0, 0, 0);

  const days: { date: string; label: string; times: string[] }[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() + i);
    const weekday = d.getDay();
    const times =
      weekday === 0 || weekday === 6
        ? ["17:00", "20:30"]
        : seed % 2 === i % 2
          ? ["20:30"]
          : ["18:15", "20:30"];
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      times,
    });
  }
  return days;
}
