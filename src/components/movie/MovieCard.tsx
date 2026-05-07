import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/SafeImage";
import { movieAPI } from "@/services";
import type { Movie } from "@/services/movie/validation";
import type { DiscoveryMovie } from "@/services/discovery/validation";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export type MovieCardProps = {
  movie: Movie | DiscoveryMovie;
  className?: string;
};

export function MovieCard({ movie, className }: MovieCardProps) {
  const queryClient = useQueryClient();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const posterUrl = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced || !cardRef.current) return;

      const img = cardRef.current.querySelector("[data-card-image]");
      if (!img) return;

      const onEnter = () => {
        gsap.to(img, { scale: 1.08, duration: 0.4, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
      };

      cardRef.current.addEventListener("mouseenter", onEnter);
      cardRef.current.addEventListener("mouseleave", onLeave);

      return () => {
        cardRef.current?.removeEventListener("mouseenter", onEnter);
        cardRef.current?.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: cardRef },
  );

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["movie", "details", movie.id],
      queryFn: () => movieAPI.movie.getMovieDetails(movie.id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link
      ref={cardRef}
      to={`/movies/${movie.id}`}
      className={`group block w-full ${className || ""}`}
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        {posterUrl ? (
          <SafeImage
            data-card-image
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        {typeof movie.vote_average === "number" && movie.vote_average > 0 && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            {movie.vote_average.toFixed(1)}
          </Badge>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {movie.title}
        </h3>
        {year && <p className="text-xs text-muted-foreground">{year}</p>}
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-[2/3] rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
    </div>
  );
}
