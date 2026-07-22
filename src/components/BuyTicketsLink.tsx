import Link from "next/link";
import styles from "./BuyTicketsLink.module.css";

interface BuyTicketsLinkProps {
  href?: string;
  className?: string;
}

export default function BuyTicketsLink({
  href = "/",
  className,
}: BuyTicketsLinkProps) {
  return (
    <Link href={href} className={`${styles.link} ${className ?? ""}`.trim()}>
      Buy tickets <span className={styles.arrow}>&#8599;</span>
    </Link>
  );
}
