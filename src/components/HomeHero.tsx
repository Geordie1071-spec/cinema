"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchGenreMap,
  fetchMovieDetail,
  fetchMovieImages,
  fetchNowPlaying,
  fetchUpcoming,
} from "@/lib/tmdb-client";
import { TMDB_IMAGE_BASE, type GenreMap, type Movie } from "@/lib/types";
import styles from "./HomeHero.module.css";

type Tab = "now" | "upcoming";

export default function HomeHero() {
  const [tab, setTab] = useState<Tab>("now");
  const [now, setNow] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [genreMap, setGenreMap] = useState<GenreMap>({});
  const [active, setActiveMovie] = useState<Movie | null>(null);
  const [runtime, setRuntime] = useState<number | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [baseBg, setBaseBg] = useState("");
  const [incomingBg, setIncomingBg] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [switching, setSwitching] = useState(false);

  const revealTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<number | null>(null);

  const list = tab === "now" ? now : upcoming;

  const setActive = useCallback((movie: Movie | null, instant = false) => {
    if (!movie) return;
    if (!instant && activeIdRef.current === movie.id) return;
    activeIdRef.current = movie.id;
    const backdrop = `${TMDB_IMAGE_BASE}original${movie.backdrop_path}`;
    setActiveMovie(movie);
    setRuntime(null);
    setLogoUrl(null);

    if (revealTimeout.current) clearTimeout(revealTimeout.current);

    if (instant) {
      setBaseBg(backdrop);
      setIncomingBg(null);
      setRevealing(false);
    } else {
      setIncomingBg(backdrop);
      setRevealing(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setRevealing(true))
      );
      revealTimeout.current = setTimeout(() => {
        setBaseBg(backdrop);
        setIncomingBg(null);
        setRevealing(false);
      }, 880);
    }

    Promise.all([fetchMovieDetail(movie.id), fetchMovieImages(movie.id)])
      .then(([detail, images]) => {
        if (activeIdRef.current !== movie.id) return;
        const logos = (images.logos || []).filter((l) => l.file_path);
        const en = logos.find((l) => l.iso_639_1 === "en") || logos[0];
        setRuntime(detail.runtime ?? null);
        setLogoUrl(en ? `${TMDB_IMAGE_BASE}original${en.file_path}` : null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [genres, nowList, upList] = await Promise.all([
          fetchGenreMap(),
          fetchNowPlaying(),
          fetchUpcoming(),
        ]);
        if (cancelled) return;
        setGenreMap(genres);
        setNow(nowList);
        setUpcoming(upList);
        if (nowList[0]) setActive(nowList[0], true);
      } catch (err) {
        console.error("TMDB fetch failed", err);
      }
    })();
    return () => {
      cancelled = true;
      if (revealTimeout.current) clearTimeout(revealTimeout.current);
    };
  }, [setActive]);

  const goTo = (i: number) => {
    const n = list.length;
    if (!n) return;
    const idx = ((i % n) + n) % n;
    setIndex(idx);
    setActive(list[idx]);
  };

  const selectTab = (nextTab: Tab) => {
    if (nextTab === tab || switching) return;
    setSwitching(true);
    setTimeout(() => {
      const nextList = nextTab === "now" ? now : upcoming;
      setTab(nextTab);
      setIndex(0);
      setSwitching(false);
      if (nextList[0]) setActive(nextList[0], true);
    }, 340);
  };

  const genres = active
    ? (active.genre_ids || [])
        .map((id) => genreMap[id])
        .filter(Boolean)
        .slice(0, 3)
        .join(", ")
    : "";
  const rating = active ? active.vote_average.toFixed(1) : "";
  const pct = active ? Math.round(active.vote_average * 10) : 0;
  const year = active?.release_date ? active.release_date.slice(0, 4) : "";
  const runtimeLabel = runtime
    ? `${Math.floor(runtime / 60)} h ${runtime % 60} min`
    : "—";
  const heroTitle = active ? active.title : "Loading";

  return (
    <>
      <div
        className={styles.bgLayer}
        style={baseBg ? { backgroundImage: `url(${baseBg})` } : undefined}
      />
      <div
        className={`${styles.bgLayer} ${styles.bgIncoming} ${
          revealing ? styles.bgIncomingRevealing : ""
        }`}
        style={
          incomingBg ? { backgroundImage: `url(${incomingBg})` } : { opacity: 0 }
        }
      />
      <div className={styles.gradientH} />
      <div className={styles.gradientV} />

      <main className={styles.main}>
        {logoUrl ? (
          <div
            role="img"
            aria-label={heroTitle}
            className={styles.heroLogo}
            style={{ backgroundImage: `url(${logoUrl})` }}
          />
        ) : (
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
        )}
        <div className={styles.metaRow}>
          <div
            className={styles.ratingRing}
            style={{
              background: `conic-gradient(oklch(0.78 0.17 155) ${pct}%, rgba(243,241,236,0.15) ${pct}% 100%)`,
            }}
          >
            <div className={styles.ratingRingInner}>{rating}</div>
          </div>
          <span className={styles.metaDot}>&middot;</span>
          <span>{year}</span>
          <span className={styles.metaDot}>&middot;</span>
          <span>{runtimeLabel}</span>
          <span className={styles.metaDot}>&middot;</span>
          <span>{genres}</span>
        </div>
        <a href="#" className={styles.buyTickets}>
          Buy tickets <span className={styles.buyArrow}>&#8599;</span>
        </a>
      </main>

      <section className={styles.carouselSection}>
        <div className={styles.stripWrap}>
          <div
            className={`${styles.strip} ${
              switching ? styles.stripSwitching : ""
            }`}
          >
            {list.map((movie, i) => (
              <button
                key={movie.id}
                type="button"
                title={movie.title}
                aria-label={movie.title}
                onClick={() => goTo(i)}
                className={`${styles.card} ${
                  i === index ? styles.cardActive : ""
                }`}
                style={
                  movie.poster_path
                    ? {
                        backgroundImage: `url(${TMDB_IMAGE_BASE}w500${movie.poster_path})`,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => selectTab("now")}
            className={`${styles.tab} ${tab === "now" ? styles.tabActive : ""}`}
          >
            NOW PLAYING
          </button>
          <button
            type="button"
            onClick={() => selectTab("upcoming")}
            className={`${styles.tab} ${
              tab === "upcoming" ? styles.tabActive : ""
            }`}
          >
            UPCOMING
          </button>
        </div>
      </section>
    </>
  );
}
