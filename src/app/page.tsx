import AppChrome from "@/components/AppChrome";
import HomeHero from "@/components/HomeHero";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <AppChrome>
        <HomeHero />
      </AppChrome>
    </div>
  );
}
