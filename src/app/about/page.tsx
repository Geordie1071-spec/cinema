import type { Metadata } from "next";
import AppChrome from "@/components/AppChrome";
import AboutSections from "@/components/AboutSections";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us — Citadel Cinema",
  description:
    "Gozo's home of cinema — in the heart of Victoria, a few metres from Independence Square.",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <AppChrome>
        <AboutSections />
      </AppChrome>
    </div>
  );
}
