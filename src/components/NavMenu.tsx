import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import styles from "./NavMenu.module.css";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function NavMenu({ open, onClose }: NavMenuProps) {
  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close menu"
      >
        &times;
      </button>
      <nav className={styles.nav}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={styles.navLink}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
