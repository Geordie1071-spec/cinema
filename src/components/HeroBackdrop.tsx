import styles from "./HeroBackdrop.module.css";

interface HeroBackdropProps {
  baseBg: string;
  overlayBg: string | null;
  overlayVisible: boolean;
  overlayInstant?: boolean;
}

export default function HeroBackdrop({
  baseBg,
  overlayBg,
  overlayVisible,
  overlayInstant = false,
}: HeroBackdropProps) {
  return (
    <>
      <div
        className={styles.layer}
        style={baseBg ? { backgroundImage: `url(${baseBg})` } : undefined}
      />
      <div
        className={`${styles.layer} ${styles.overlay} ${
          overlayInstant ? styles.overlayInstant : ""
        } ${overlayVisible ? styles.overlayVisible : ""}`}
        style={
          overlayBg ? { backgroundImage: `url(${overlayBg})` } : undefined
        }
        aria-hidden
      />
      <div className={styles.gradientH} />
      <div className={styles.gradientV} />
    </>
  );
}
