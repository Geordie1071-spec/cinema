import styles from "./RatingRing.module.css";

interface RatingRingProps {
  rating: number;
}

export default function RatingRing({ rating }: RatingRingProps) {
  const pct = Math.round(rating * 10);
  const label = rating.toFixed(1);

  return (
    <div
      className={styles.ring}
      style={{
        background: `conic-gradient(oklch(0.78 0.17 155) ${pct}%, rgba(243,241,236,0.15) ${pct}% 100%)`,
      }}
      aria-label={`Rating ${label}`}
    >
      <div className={styles.inner}>{label}</div>
    </div>
  );
}
