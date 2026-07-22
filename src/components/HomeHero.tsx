"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovieExtras } from "@/lib/tmdb-client";
import { backdropUrl, formatRuntime } from "@/lib/movies";
import type { ExtrasMap, GenreMap, Movie, MovieExtras } from "@/lib/types";
import HeroBackdrop from "./HeroBackdrop";
import HeroCopy from "./HeroCopy";
import MovieCarousel, { type MovieTab } from "./MovieCarousel";

const FADE_MS = 500;
const TAB_SWITCH_MS = 160;

interface HomeHeroProps {
  nowPlaying: Movie[];
  upcoming: Movie[];
  genreMap: GenreMap;
  extrasById: ExtrasMap;
}

export default function HomeHero({
  nowPlaying,
  upcoming,
  genreMap,
  extrasById,
}: HomeHeroProps) {
  const [tab, setTab] = useState<MovieTab>("now");
  const [extras, setExtras] = useState<ExtrasMap>(extrasById);
  const [active, setActiveMovie] = useState<Movie | null>(
    nowPlaying[0] ?? null
  );
  const [index, setIndex] = useState(0);
  const [baseBg, setBaseBg] = useState(() =>
    backdropUrl(nowPlaying[0]?.backdrop_path ?? null)
  );
  const [overlayBg, setOverlayBg] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayInstant, setOverlayInstant] = useState(false);
  const [switching, setSwitching] = useState(false);

  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<number | null>(nowPlaying[0]?.id ?? null);
  const baseBgRef = useRef(baseBg);
  const overlayBgRef = useRef<string | null>(null);
  const overlayVisibleRef = useRef(false);
  const genRef = useRef(0);
  const extrasRef = useRef(extras);

  const list = tab === "now" ? nowPlaying : upcoming;
  const activeExtras: MovieExtras | null = active
    ? extras[active.id] ?? null
    : null;

  useEffect(() => {
    extrasRef.current = extras;
  }, [extras]);

  const ensureExtras = useCallback((movieId: number) => {
    if (extrasRef.current[movieId]) return;
    fetchMovieExtras(movieId)
      .then((next) => {
        setExtras((prev) =>
          prev[movieId] ? prev : { ...prev, [movieId]: next }
        );
      })
      .catch(() => {});
  }, []);

  const commitOverlayToBase = useCallback((url: string) => {
    baseBgRef.current = url;
    setBaseBg(url);
    // Hide overlay instantly (no fade-out) so the image doesn't flash.
    setOverlayInstant(true);
    overlayVisibleRef.current = false;
    overlayBgRef.current = null;
    setOverlayVisible(false);
    setOverlayBg(null);
    requestAnimationFrame(() => {
      setOverlayInstant(false);
    });
  }, []);

  const setActive = useCallback(
    (movie: Movie | null, instant = false) => {
      if (!movie) return;
      if (!instant && activeIdRef.current === movie.id) return;
      activeIdRef.current = movie.id;
      const gen = ++genRef.current;
      const nextBg = backdropUrl(movie.backdrop_path);

      setActiveMovie(movie);
      ensureExtras(movie.id);

      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);

      if (instant || !nextBg || nextBg === baseBgRef.current) {
        if (overlayVisibleRef.current && overlayBgRef.current) {
          commitOverlayToBase(overlayBgRef.current);
        }
        baseBgRef.current = nextBg;
        setBaseBg(nextBg);
        setOverlayInstant(true);
        overlayVisibleRef.current = false;
        overlayBgRef.current = null;
        setOverlayVisible(false);
        setOverlayBg(null);
        requestAnimationFrame(() => setOverlayInstant(false));
        return;
      }

      // If a fade is mid-flight, lock the visible overlay onto the base first.
      if (overlayBgRef.current && overlayVisibleRef.current) {
        commitOverlayToBase(overlayBgRef.current);
      }

      // Arm the next backdrop at opacity 0 without animating, then fade in.
      overlayBgRef.current = nextBg;
      setOverlayInstant(true);
      setOverlayBg(nextBg);
      setOverlayVisible(false);
      overlayVisibleRef.current = false;

      requestAnimationFrame(() => {
        if (gen !== genRef.current) return;
        setOverlayInstant(false);
        requestAnimationFrame(() => {
          if (gen !== genRef.current) return;
          overlayVisibleRef.current = true;
          setOverlayVisible(true);
          fadeTimeout.current = setTimeout(() => {
            if (gen !== genRef.current) return;
            commitOverlayToBase(nextBg);
          }, FADE_MS);
        });
      });
    },
    [commitOverlayToBase, ensureExtras]
  );

  useEffect(() => {
    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
      if (tabTimeout.current) clearTimeout(tabTimeout.current);
    };
  }, []);

  const goTo = (i: number) => {
    const n = list.length;
    if (!n) return;
    const idx = ((i % n) + n) % n;
    setIndex(idx);
    setActive(list[idx]);
  };

  const selectTab = (nextTab: MovieTab) => {
    if (nextTab === tab || switching) return;
    setSwitching(true);
    if (tabTimeout.current) clearTimeout(tabTimeout.current);
    tabTimeout.current = setTimeout(() => {
      const nextList = nextTab === "now" ? nowPlaying : upcoming;
      setTab(nextTab);
      setIndex(0);
      setSwitching(false);
      if (nextList[0]) setActive(nextList[0], true);
    }, TAB_SWITCH_MS);
  };

  const genres = active
    ? (active.genre_ids || [])
        .map((id) => genreMap[id])
        .filter(Boolean)
        .slice(0, 3)
        .join(", ")
    : "";
  const year = active?.release_date ? active.release_date.slice(0, 4) : "";
  const heroTitle = active ? active.title : "Loading";
  const showRating = tab === "now" && !!active;

  return (
    <>
      <HeroBackdrop
        baseBg={baseBg}
        overlayBg={overlayBg}
        overlayVisible={overlayVisible}
        overlayInstant={overlayInstant}
      />
      <HeroCopy
        movieId={active?.id ?? null}
        title={heroTitle}
        logoUrl={activeExtras?.logoUrl ?? null}
        showRating={showRating}
        rating={active?.vote_average ?? 0}
        year={year}
        runtimeLabel={formatRuntime(activeExtras?.runtime)}
        genres={genres}
      />
      <MovieCarousel
        movies={list}
        activeIndex={index}
        tab={tab}
        switching={switching}
        onSelectIndex={goTo}
        onSelectTab={selectTab}
      />
    </>
  );
}
