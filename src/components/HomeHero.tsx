"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovieExtras } from "@/lib/tmdb-client";
import { backdropUrl, formatRuntime } from "@/lib/movies";
import type { GenreMap, Movie } from "@/lib/types";
import HeroBackdrop from "./HeroBackdrop";
import HeroCopy from "./HeroCopy";
import MovieCarousel, { type MovieTab } from "./MovieCarousel";

const REVEAL_MS = 320;
const TAB_SWITCH_MS = 180;

export interface MovieExtras {
  runtime: number | null;
  logoUrl: string | null;
}

interface HomeHeroProps {
  nowPlaying: Movie[];
  upcoming: Movie[];
  genreMap: GenreMap;
  initialExtras: MovieExtras | null;
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function HomeHero({
  nowPlaying,
  upcoming,
  genreMap,
  initialExtras,
}: HomeHeroProps) {
  const [tab, setTab] = useState<MovieTab>("now");
  const [active, setActiveMovie] = useState<Movie | null>(
    nowPlaying[0] ?? null
  );
  const [runtime, setRuntime] = useState<number | null>(
    initialExtras?.runtime ?? null
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(
    initialExtras?.logoUrl ?? null
  );
  const [index, setIndex] = useState(0);
  const [baseBg, setBaseBg] = useState(() =>
    backdropUrl(nowPlaying[0]?.backdrop_path ?? null)
  );
  const [incomingBg, setIncomingBg] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [switching, setSwitching] = useState(false);

  const revealTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<number | null>(nowPlaying[0]?.id ?? null);
  const incomingBgRef = useRef<string | null>(null);
  const genRef = useRef(0);

  const list = tab === "now" ? nowPlaying : upcoming;

  const setActive = useCallback(
    (movie: Movie | null, instant = false, extras?: MovieExtras | null) => {
      if (!movie) return;
      if (!instant && activeIdRef.current === movie.id) return;
      activeIdRef.current = movie.id;
      const gen = ++genRef.current;
      const backdrop = backdropUrl(movie.backdrop_path);

      setActiveMovie(movie);

      if (extras) {
        setRuntime(extras.runtime);
        setLogoUrl(extras.logoUrl);
      } else {
        setRuntime(null);
        setLogoUrl(null);
      }

      if (revealTimeout.current) clearTimeout(revealTimeout.current);

      const finishCrossfade = () => {
        if (gen !== genRef.current) return;
        setBaseBg(backdrop);
        incomingBgRef.current = null;
        setIncomingBg(null);
        setRevealing(false);
        setResetting(false);
      };

      const startCrossfade = async () => {
        if (gen !== genRef.current) return;

        if (instant || !backdrop) {
          incomingBgRef.current = null;
          setBaseBg(backdrop);
          setIncomingBg(null);
          setRevealing(false);
          setResetting(false);
          return;
        }

        await preloadImage(backdrop);
        if (gen !== genRef.current) return;

        if (incomingBgRef.current) {
          setBaseBg(incomingBgRef.current);
        }

        incomingBgRef.current = backdrop;
        setResetting(true);
        setRevealing(false);
        setIncomingBg(backdrop);

        requestAnimationFrame(() => {
          if (gen !== genRef.current) return;
          setResetting(false);
          requestAnimationFrame(() => {
            if (gen !== genRef.current) return;
            setRevealing(true);
            revealTimeout.current = setTimeout(finishCrossfade, REVEAL_MS);
          });
        });
      };

      void startCrossfade();

      if (!extras) {
        fetchMovieExtras(movie.id)
          .then((next) => {
            if (activeIdRef.current !== movie.id) return;
            setRuntime(next.runtime);
            setLogoUrl(next.logoUrl);
          })
          .catch(() => {});
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (revealTimeout.current) clearTimeout(revealTimeout.current);
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
      if (nextList[0]) {
        const extras =
          nextTab === "now" && nextList[0].id === nowPlaying[0]?.id
            ? initialExtras
            : null;
        setActive(nextList[0], true, extras);
      }
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
        incomingBg={incomingBg}
        revealing={revealing}
        resetting={resetting}
      />
      <HeroCopy
        title={heroTitle}
        logoUrl={logoUrl}
        showRating={showRating}
        rating={active?.vote_average ?? 0}
        year={year}
        runtimeLabel={formatRuntime(runtime)}
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
