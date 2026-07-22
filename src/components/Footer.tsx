import WebsiteByMark from "./WebsiteByMark";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>&copy; 2026 CITADEL CINEMA</span>
      <a href="#" className={styles.websiteBy}>
        WEBSITE BY
        <WebsiteByMark />
      </a>
    </footer>
  );
}
