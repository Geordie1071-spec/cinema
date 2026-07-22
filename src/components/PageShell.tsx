import type { ReactNode } from "react";
import styles from "./PageShell.module.css";

export default function PageShell({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
