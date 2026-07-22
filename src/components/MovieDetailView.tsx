import Link from "next/link";
import {
  backdropUrl,
  formatRuntime,
  getMoviePageData,
  getShowDates,
  posterUrl,
} from "@/lib/movies";
import BuyTicketsLink from "./BuyTicketsLink";
import RatingRing from "./RatingRing";
import styles from "./MovieDetailView.module.css";

type MoviePageData = Awaited<ReturnType<typeof getMoviePageData>>;
type ShowDates = ReturnType<typeof getShowDates>;

interface MovieDetailViewProps {
  data: MoviePageData;
  showtimes: ShowDates;
}

export default function MovieDetailView({
  data,
  showtimes,
}: MovieDetailViewProps) {
  const { detail, logoUrl, trailer } = data;
  const year = detail.release_date ? detail.release_date.slice(0, 4) : "";
  const genres = detail.genres.map((g) => g.name).join(", ");
  const bg = backdropUrl(detail.backdrop_path);
  const poster = posterUrl(detail.poster_path);

  return (
    <article className={styles.page}>
      <div
        className={styles.hero}
        style={bg ? { backgroundImage: `url(${bg})` } : undefined}
      >
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <Link href="/" className={styles.back}>
            ← Back to films
          </Link>

          <div className={styles.heroGrid}>
            {poster ? (
              <div
                className={styles.poster}
                style={{ backgroundImage: `url(${poster})` }}
                role="img"
                aria-label={`${detail.title} poster`}
              />
            ) : null}

            <div className={styles.heroCopy}>
              {logoUrl ? (
                <div
                  className={styles.logo}
                  style={{ backgroundImage: `url(${logoUrl})` }}
                  role="img"
                  aria-label={detail.title}
                />
              ) : (
                <h1 className={styles.title}>{detail.title}</h1>
              )}

              {detail.tagline ? (
                <p className={styles.tagline}>{detail.tagline}</p>
              ) : null}

              <div className={styles.meta}>
                {detail.vote_average > 0 ? (
                  <>
                    <RatingRing rating={detail.vote_average} />
                    <span className={styles.dot}>&middot;</span>
                  </>
                ) : null}
                {year ? <span>{year}</span> : null}
                {year ? <span className={styles.dot}>&middot;</span> : null}
                <span>{formatRuntime(detail.runtime)}</span>
                {genres ? (
                  <>
                    <span className={styles.dot}>&middot;</span>
                    <span>{genres}</span>
                  </>
                ) : null}
              </div>

              <BuyTicketsLink href="/" className={styles.cta} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <section className={styles.section}>
          <div className={styles.kickerRow}>
            <span>01</span>
            <span className={styles.kickerLine} />
            <span>Trailer</span>
          </div>
          {trailer ? (
            <div className={styles.trailerFrame}>
              <iframe
                title={`${detail.title} trailer`}
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.trailer}
              />
            </div>
          ) : (
            <p className={styles.empty}>Trailer coming soon.</p>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.kickerRow}>
            <span>02</span>
            <span className={styles.kickerLine} />
            <span>Showtimes</span>
          </div>
          <div className={styles.shows}>
            {showtimes.map((day) => (
              <div key={day.date} className={styles.showDay}>
                <h3 className={styles.showLabel}>{day.label}</h3>
                <div className={styles.times}>
                  {day.times.map((time) => (
                    <button key={time} type="button" className={styles.timeBtn}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.kickerRow}>
            <span>03</span>
            <span className={styles.kickerLine} />
            <span>About the film</span>
          </div>
          <h2 className={styles.infoHeading}>{detail.title}</h2>
          <p className={styles.overview}>
            {detail.overview || "Synopsis unavailable."}
          </p>
        </section>
      </div>
    </article>
  );
}
