import RatingRing from "./RatingRing";
import styles from "./MovieMeta.module.css";

interface MovieMetaProps {
  showRating: boolean;
  rating: number;
  year: string;
  runtimeLabel: string;
  genres: string;
}

export default function MovieMeta({
  showRating,
  rating,
  year,
  runtimeLabel,
  genres,
}: MovieMetaProps) {
  return (
    <>
      <div className={styles.row}>
        {showRating ? (
          <>
            <RatingRing rating={rating} />
            <span className={styles.dot}>&middot;</span>
          </>
        ) : null}
        {year ? <span>{year}</span> : null}
        {year ? <span className={styles.dot}>&middot;</span> : null}
        <span>{runtimeLabel}</span>
        {genres ? (
          <>
            <span className={`${styles.dot} ${styles.desktopOnly}`}>
              &middot;
            </span>
            <span className={styles.desktopOnly}>{genres}</span>
          </>
        ) : null}
      </div>
      {genres ? <p className={styles.genresMobile}>{genres}</p> : null}
    </>
  );
}
