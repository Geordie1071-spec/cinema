"use client";

import { useEffect, useRef } from "react";
import type { Movie } from "@/lib/types";
import PosterCard from "./PosterCard";
import styles from "./MovieCarousel.module.css";

export type MovieTab = "now" | "upcoming";

interface MovieCarouselProps {
  movies: Movie[];
  activeIndex: number;
  tab: MovieTab;
  switching: boolean;
  onSelectIndex: (index: number) => void;
  onSelectTab: (tab: MovieTab) => void;
}

export default function MovieCarousel({
  movies,
  activeIndex,
  tab,
  switching,
  onSelectIndex,
  onSelectTab,
}: MovieCarouselProps) {
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const card = cardRefs.current[activeIndex];
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, tab, movies]);

  return (
    <section className={styles.section}>
      <div className={styles.stripWrap}>
        <div
          className={`${styles.strip} ${switching ? styles.switching : ""}`}
        >
          {movies.map((movie, i) => (
            <PosterCard
              key={movie.id}
              movie={movie}
              active={i === activeIndex}
              onSelect={() => onSelectIndex(i)}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
      <div className={styles.tabs}>
        <button
          type="button"
          onClick={() => onSelectTab("now")}
          className={`${styles.tab} ${tab === "now" ? styles.tabActive : ""}`}
        >
          NOW PLAYING
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("upcoming")}
          className={`${styles.tab} ${
            tab === "upcoming" ? styles.tabActive : ""
          }`}
        >
          UPCOMING
        </button>
      </div>
    </section>
  );
}
