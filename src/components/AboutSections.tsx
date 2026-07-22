"use client";

import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import { ABOUT_SECTIONS } from "@/lib/about-sections";
import BuyTicketsLink from "./BuyTicketsLink";
import styles from "./AboutSections.module.css";

type SectionVarStyle = CSSProperties & { "--rv"?: number };

function wordStyle(delay: number): CSSProperties {
  return { transitionDelay: `${delay.toFixed(3)}s` };
}

function toWords(str: string, base: number, step: number) {
  return str.split(" ").map((text, i) => ({
    text,
    style: wordStyle(base + i * step),
  }));
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

const SECTION_DATA = ABOUT_SECTIONS.map((s) => ({
  n: s.n,
  kicker: s.kicker,
  headingWords: toWords(s.heading, 0, 0.05),
  bodyWords: toWords(s.body, 0.12, 0.022),
}));

export default function AboutSections() {
  const [scrollTop, setScrollTop] = useState(0);
  const [vh, setVh] = useState(0);
  const scrollElRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const scrollRef = useCallback((el: HTMLDivElement | null) => {
    scrollElRef.current = el;
    if (!el) return;
    setVh(el.clientHeight);
    setScrollTop(el.scrollTop);
  }, []);

  const handleScroll = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = scrollElRef.current;
      if (!el) return;
      setScrollTop(el.scrollTop);
      setVh(el.clientHeight);
    });
  };

  const effectiveVh =
    vh || (typeof window !== "undefined" ? window.innerHeight : 900);
  const active = Math.round(scrollTop / effectiveVh);

  const goSection = (i: number) => {
    scrollElRef.current?.scrollTo({
      top: i * scrollElRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  // Offset by +1 so the active section's bar starts filled (section 0 = 1),
  // and the final section reaches full color instead of staying empty.
  const fills = useMemo(
    () =>
      SECTION_DATA.map((_, i) =>
        clamp(scrollTop / effectiveVh - i + 1, 0, 1)
      ),
    [scrollTop, effectiveVh]
  );

  const lastIndex = SECTION_DATA.length - 1;

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={styles.scroller}
      >
        {SECTION_DATA.map((sec, i) => (
          <section
            key={sec.n}
            className={styles.section}
            style={{ "--rv": i === active ? 1 : 0 } as SectionVarStyle}
          >
            <div className={styles.sectionInner}>
              <div className={styles.kickerRow}>
                <span>{sec.n}</span>
                <span className={styles.kickerLine} />
                <span>{sec.kicker}</span>
              </div>
              <h2 className={styles.heading}>
                {sec.headingWords.map((w, j) => (
                  <span key={j} className={styles.word} style={w.style}>
                    {w.text}
                  </span>
                ))}
              </h2>
              <p className={styles.body}>
                {sec.bodyWords.map((w, j) => (
                  <span key={j} className={styles.word} style={w.style}>
                    {w.text}
                  </span>
                ))}
              </p>
              {i === lastIndex ? (
                <BuyTicketsLink className={styles.cta} />
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <div className={styles.progress}>
        {SECTION_DATA.map((sec, i) => (
          <button
            key={sec.n}
            type="button"
            aria-label={`Go to section ${sec.n}: ${sec.kicker}`}
            onClick={() => goSection(i)}
            className={styles.progressBar}
          >
            <div
              className={styles.progressFill}
              style={{ transform: `scaleX(${fills[i].toFixed(3)})` }}
            />
          </button>
        ))}
      </div>
    </>
  );
}
