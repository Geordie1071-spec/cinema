import BuyTicketsLink from "./BuyTicketsLink";
import MovieMeta from "./MovieMeta";
import styles from "./HeroCopy.module.css";

interface HeroCopyProps {
  title: string;
  logoUrl: string | null;
  showRating: boolean;
  rating: number;
  year: string;
  runtimeLabel: string;
  genres: string;
}

export default function HeroCopy({
  title,
  logoUrl,
  showRating,
  rating,
  year,
  runtimeLabel,
  genres,
}: HeroCopyProps) {
  return (
    <main className={styles.main}>
      {logoUrl ? (
        <div
          role="img"
          aria-label={title}
          className={styles.logo}
          style={{ backgroundImage: `url(${logoUrl})` }}
        />
      ) : (
        <h1 className={styles.title}>{title}</h1>
      )}
      <MovieMeta
        showRating={showRating}
        rating={rating}
        year={year}
        runtimeLabel={runtimeLabel}
        genres={genres}
      />
      <BuyTicketsLink className={styles.cta} />
    </main>
  );
}
