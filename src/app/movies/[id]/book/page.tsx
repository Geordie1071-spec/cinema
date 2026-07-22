import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AppChrome from "@/components/AppChrome";
import BookingFlow from "@/components/BookingFlow";
import PageShell from "@/components/PageShell";
import { formatRuntime, getMovieDetail, getShowDates } from "@/lib/movies";
import { getOccupiedSeats, type SeatId } from "@/lib/seating";

interface BookPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return { title: "Book — Citadel Cinema" };
  try {
    const detail = await getMovieDetail(Number(id));
    return {
      title: `Book ${detail.title} — Citadel Cinema`,
      description: `Select seats and checkout for ${detail.title}.`,
    };
  } catch {
    return { title: "Book — Citadel Cinema" };
  }
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const { id } = await params;
  const { date, time } = await searchParams;

  if (!/^\d+$/.test(id)) notFound();
  if (!date || !time) {
    redirect(`/movies/${id}`);
  }

  let detail;
  try {
    detail = await getMovieDetail(Number(id));
  } catch {
    notFound();
  }

  const showtimes = getShowDates(detail.id, detail.release_date);
  const day = showtimes.find((d) => d.date === date);
  if (!day || !day.times.includes(time)) {
    redirect(`/movies/${id}`);
  }

  const occupied = Array.from(
    getOccupiedSeats(detail.id, date, time)
  ) as SeatId[];

  return (
    <PageShell scrollable>
      <AppChrome>
        <BookingFlow
          movie={{
            id: detail.id,
            title: detail.title,
            poster_path: detail.poster_path,
            runtimeLabel: formatRuntime(detail.runtime),
          }}
          date={date}
          dateLabel={day.label}
          time={time}
          occupied={occupied}
        />
      </AppChrome>
    </PageShell>
  );
}
