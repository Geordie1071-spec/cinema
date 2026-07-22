import AppChrome from "@/components/AppChrome";
import HomeHero from "@/components/HomeHero";
import PageShell from "@/components/PageShell";
import {
  getExtrasMap,
  getGenreMap,
  getNowPlaying,
  getUpcoming,
} from "@/lib/movies";

export default async function HomePage() {
  const [genreMap, nowPlaying, upcoming] = await Promise.all([
    getGenreMap(),
    getNowPlaying(),
    getUpcoming(),
  ]);

  const extrasById = await getExtrasMap([...nowPlaying, ...upcoming]);

  return (
    <PageShell>
      <AppChrome>
        <HomeHero
          nowPlaying={nowPlaying}
          upcoming={upcoming}
          genreMap={genreMap}
          extrasById={extrasById}
        />
      </AppChrome>
    </PageShell>
  );
}
