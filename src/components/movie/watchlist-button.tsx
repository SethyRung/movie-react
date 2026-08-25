"use client";

import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist, type WatchlistMovie } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

export type WatchlistButtonProps = {
  movie: WatchlistMovie;
  variant?: "icon" | "label";
  className?: string;
};

export function WatchlistButton({ movie, variant = "icon", className }: WatchlistButtonProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);
  const label = saved ? "Saved" : "Watchlist";

  return (
    <Button
      type="button"
      variant={saved ? "default" : variant === "icon" ? "secondary" : "outline"}
      size={variant === "icon" ? "icon" : "lg"}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      aria-pressed={saved}
      className={cn(
        variant === "icon" && "size-11",
        variant === "label" &&
          (saved
            ? "bg-hero-foreground text-hero hover:bg-hero-foreground/90"
            : "border-hero-foreground/30 bg-transparent text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"),
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWatchlist({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ?? null,
          vote_average: movie.vote_average ?? 0,
          release_date: movie.release_date ?? null,
        });
      }}
    >
      {saved ? <BookmarkCheckIcon /> : <BookmarkIcon />}
      {variant === "label" ? label : null}
    </Button>
  );
}
