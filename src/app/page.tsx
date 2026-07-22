import AppChrome from "@/components/AppChrome";
import HomeHero from "@/components/HomeHero";
import PageShell from "@/components/PageShell";
import { getGenreMap, getMovieExtras, getNowPlaying, getUpcoming } from "@/lib/movies";

export default async function HomePage() {
  const [genreMap, nowPlaying, upcoming] = await Promise.all([
    getGenreMap(),
    getNowPlaying(),
    getUpcoming(),
  ]);

  const initialExtras = nowPlaying[0]
    ? await getMovieExtras(nowPlaying[0].id)
    : null;

  return (
    <PageShell>
      <AppChrome>
        <HomeHero
          nowPlaying={nowPlaying}
          upcoming={upcoming}
          genreMap={genreMap}
          initialExtras={initialExtras}
        />
      </AppChrome>
    </PageShell>
  );
}
