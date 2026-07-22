import styles from "./BuyTicketsLink.module.css";

interface BuyTicketsLinkProps {
  href?: string;
  className?: string;
}

export default function BuyTicketsLink({
  href = "#",
  className,
}: BuyTicketsLinkProps) {
  return (
    <a
      href={href}
      className={`${styles.link} ${className ?? ""}`.trim()}
    >
      Buy tickets <span className={styles.arrow}>&#8599;</span>
    </a>
  );
}
