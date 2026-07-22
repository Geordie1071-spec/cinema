import type { ReactNode } from "react";
import styles from "./PageShell.module.css";

interface PageShellProps {
  children: ReactNode;
  scrollable?: boolean;
}

export default function PageShell({
  children,
  scrollable = false,
}: PageShellProps) {
  return (
    <div
      className={`${styles.page} ${scrollable ? styles.scrollable : ""}`.trim()}
    >
      {children}
    </div>
  );
}
