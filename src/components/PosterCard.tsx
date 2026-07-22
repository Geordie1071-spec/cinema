import { posterUrl } from "@/lib/movies";
import type { Movie } from "@/lib/types";
import styles from "./PosterCard.module.css";

interface PosterCardProps {
  movie: Movie;
  active: boolean;
  onSelect: () => void;
  cardRef?: (el: HTMLButtonElement | null) => void;
}

export default function PosterCard({
  movie,
  active,
  onSelect,
  cardRef,
}: PosterCardProps) {
  return (
    <button
      ref={cardRef}
      type="button"
      title={movie.title}
      aria-label={movie.title}
      aria-pressed={active}
      onClick={onSelect}
      className={`${styles.card} ${active ? styles.active : ""}`}
      style={
        movie.poster_path
          ? { backgroundImage: `url(${posterUrl(movie.poster_path)})` }
          : undefined
      }
    />
  );
}
