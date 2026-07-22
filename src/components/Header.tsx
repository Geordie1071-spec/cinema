import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "./FacebookIcon";
import styles from "./Header.module.css";
import logo from "../../public/assets/logo.png";

interface HeaderProps {
  onToggleMenu: () => void;
}

export default function Header({ onToggleMenu }: HeaderProps) {
  return (
    <header className={styles.header}>
      <FacebookIcon />
      <Link href="/" className={styles.logoLink}>
        <Image
          src={logo}
          alt="Citadel Cinema"
          className={styles.logo}
          priority
        />
      </Link>
      <div className={styles.menuButtonWrap}>
        <button
          type="button"
          onClick={onToggleMenu}
          className={styles.menuButton}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
