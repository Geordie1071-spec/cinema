import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppChrome from "@/components/AppChrome";
import MovieDetailView from "@/components/MovieDetailView";
import PageShell from "@/components/PageShell";
import { getMoviePageData, getShowDates } from "@/lib/movies";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Film — Citadel Cinema" };
  try {
    const { detail } = await getMoviePageData(Number(id));
    return {
      title: `${detail.title} — Citadel Cinema`,
      description: detail.overview || `Showtimes for ${detail.title} at Citadel Cinema.`,
    };
  } catch {
    return { title: "Film — Citadel Cinema" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let data;
  try {
    data = await getMoviePageData(Number(id));
  } catch {
    notFound();
  }

  const showtimes = getShowDates(data.detail.id, data.detail.release_date);

  return (
    <PageShell scrollable>
      <AppChrome>
        <MovieDetailView data={data} showtimes={showtimes} />
      </AppChrome>
    </PageShell>
  );
}
