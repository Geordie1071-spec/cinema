const TMDB_BASE = "https://api.themoviedb.org/3";

export function tmdbAuthHeaders(): HeadersInit {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    throw new Error(
      "TMDB_API_TOKEN is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  return { Authorization: `Bearer ${token}`, accept: "application/json" };
}

export async function tmdbFetch(path: string) {
  const res = await fetch(`${TMDB_BASE}${path}`, {
    headers: tmdbAuthHeaders(),
    next: { revalidate: 60 * 30 },
  });
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
