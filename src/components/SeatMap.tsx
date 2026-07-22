"use client";

import { useRef } from "react";
import { SEAT_ROWS, SEATS_PER_ROW, type SeatId } from "@/lib/seating";
import styles from "./SeatMap.module.css";

interface SeatMapProps {
  occupied: Set<SeatId>;
  selected: SeatId[];
  onToggle: (id: SeatId) => void;
}

const DRAG_THRESHOLD = 8;

export default function SeatMap({
  occupied,
  selected,
  onToggle,
}: SeatMapProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
    if (drag.dragging && drag.pointerId != null) {
      try {
        el.releasePointerCapture(drag.pointerId);
      } catch {
        /* already released */
      }
    }
    el.classList.remove(styles.dragging);
    const wasDragging = drag.dragging;
    drag.tracking = false;
    drag.dragging = false;
    drag.pointerId = null;
    if (wasDragging) {
      window.setTimeout(() => {
        dragRef.current.suppressClick = false;
      }, 0);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="group"
      aria-label="Seat map"
    >
      <div className={styles.map}>
        {SEAT_ROWS.map((row) => (
          <div key={row} className={styles.row}>
            <span className={styles.rowLabel}>{row}</span>
            <div className={styles.rowSeats}>
              {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                const num = i + 1;
                const id = `${row}${num}` as SeatId;
                const isTaken = occupied.has(id);
                const isSelected = selected.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={isTaken}
                    aria-pressed={isSelected}
                    aria-label={`Seat ${id}${
                      isTaken ? " taken" : isSelected ? " selected" : ""
                    }`}
                    onClick={() => {
                      if (
                        dragRef.current.suppressClick ||
                        dragRef.current.dragging
                      ) {
                        return;
                      }
                      onToggle(id);
                    }}
                    className={`${styles.seat} ${
                      isTaken
                        ? styles.taken
                        : isSelected
                          ? styles.picked
                          : styles.free
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <span className={styles.rowLabel}>{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
