import styles from "./HeroBackdrop.module.css";

interface HeroBackdropProps {
  baseBg: string;
  incomingBg: string | null;
  revealing: boolean;
  resetting: boolean;
}

export default function HeroBackdrop({
  baseBg,
  incomingBg,
  revealing,
  resetting,
}: HeroBackdropProps) {
  return (
    <>
      <div
        className={styles.layer}
        style={baseBg ? { backgroundImage: `url(${baseBg})` } : undefined}
      />
      <div
        className={`${styles.layer} ${styles.incoming} ${
          resetting ? styles.reset : ""
        } ${revealing ? styles.revealing : ""}`}
        style={
          incomingBg ? { backgroundImage: `url(${incomingBg})` } : undefined
        }
        aria-hidden
      />
      <div className={styles.gradientH} />
      <div className={styles.gradientV} />
    </>
  );
}
