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

const DRAG_THRESHOLD = 8;

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
    tracking: boolean;
    dragging: boolean;
    startX: number;
    scrollLeft: number;
    pointerId: number | null;
    suppressClick: boolean;
  }>({
    tracking: false,
    dragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: null,
    suppressClick: false,
  });

  useEffect(() => {
    if (dragRef.current.dragging) return;
    const card = cardRefs.current[activeIndex];
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, tab, movies]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button / touch. Don't capture yet so clicks still reach cards.
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = wrapRef.current;
    if (!el) return;
    dragRef.current = {
      tracking: true,
      dragging: false,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
      suppressClick: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const drag = dragRef.current;
    if (!el || !drag.tracking) return;

    const dx = e.clientX - drag.startX;

    if (!drag.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      drag.dragging = true;
      drag.suppressClick = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add(styles.dragging);
    }

    el.scrollLeft = drag.scrollLeft - dx;
    e.preventDefault();
  };

  const endDrag = () => {
    const el = wrapRef.current;
    const drag = dragRef.current;
    if (!el || !drag.tracking) return;

    const wasDragging = drag.dragging;
    if (wasDragging && drag.pointerId != null) {
      try {
        el.releasePointerCapture(drag.pointerId);
      } catch {
        /* already released */
      }
    }
    el.classList.remove(styles.dragging);
    drag.tracking = false;
    drag.dragging = false;
    drag.pointerId = null;

    if (!wasDragging) return;

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

    // Keep suppressing the synthetic click that follows a drag.
    window.setTimeout(() => {
      dragRef.current.suppressClick = false;
    }, 0);
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
                if (dragRef.current.suppressClick || dragRef.current.dragging) {
                  return;
                }
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
