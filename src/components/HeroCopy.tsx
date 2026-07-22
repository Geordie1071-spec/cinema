import Link from "next/link";
import BuyTicketsLink from "./BuyTicketsLink";
import MovieMeta from "./MovieMeta";
import styles from "./HeroCopy.module.css";

interface HeroCopyProps {
  movieId: number | null;
  title: string;
  logoUrl: string | null;
  showRating: boolean;
  rating: number;
  year: string;
  runtimeLabel: string;
  genres: string;
}

export default function HeroCopy({
  movieId,
  title,
  logoUrl,
  showRating,
  rating,
  year,
  runtimeLabel,
  genres,
}: HeroCopyProps) {
  const detailHref = movieId ? `/movies/${movieId}` : "/";

  return (
    <main className={styles.main}>
      {logoUrl ? (
        <Link
          href={detailHref}
          aria-label={title}
          className={styles.logo}
          style={{ backgroundImage: `url(${logoUrl})` }}
        />
      ) : (
        <h1 className={styles.title}>
          <Link href={detailHref}>{title}</Link>
        </h1>
      )}
      <MovieMeta
        showRating={showRating}
        rating={rating}
        year={year}
        runtimeLabel={runtimeLabel}
        genres={genres}
      />
      <BuyTicketsLink href={detailHref} className={styles.cta} />
    </main>
  );
}
