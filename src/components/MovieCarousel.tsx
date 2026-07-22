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
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    scrollLeft: number;
    pointerId: number | null;
  }>({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: null,
  });

  useEffect(() => {
    if (dragRef.current.active) return;
    const card = cardRefs.current[activeIndex];
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, tab, movies]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
    };
    el.setPointerCapture(e.pointerId);
    el.classList.add(styles.dragging);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 6) drag.moved = true;
    el.scrollLeft = drag.scrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active) return;
    if (drag.pointerId != null) {
      try {
        el.releasePointerCapture(drag.pointerId);
      } catch {
        /* already released */
      }
    }
    el.classList.remove(styles.dragging);
    drag.active = false;

    // Snap to nearest poster and select it after a drag.
    if (drag.moved) {
      const cards = cardRefs.current.filter(Boolean) as HTMLButtonElement[];
      if (!cards.length) return;
      const wrapRect = el.getBoundingClientRect();
      const center = wrapRect.left + wrapRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const mid = r.left + r.width / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      onSelectIndex(best);
    }
  };

  return (
    <section className={styles.section}>
      <div
        ref={wrapRef}
        className={styles.stripWrap}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={`${styles.strip} ${switching ? styles.switching : ""}`}
        >
          {movies.map((movie, i) => (
            <PosterCard
              key={movie.id}
              movie={movie}
              active={i === activeIndex}
              onSelect={() => {
                if (dragRef.current.moved) return;
                onSelectIndex(i);
              }}
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
