import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { SafeImage } from "@/components/SafeImage";
import type { DiscoveryMovie } from "@/services/discovery/validation";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export type MovieHeroProps = {
  movie?: DiscoveryMovie;
  backdropPath?: string | null;
  isLoading?: boolean;
};

export function MovieHero({ movie, backdropPath, isLoading }: MovieHeroProps) {
  if (isLoading || !movie) {
    return (
      <div className="relative w-full h-[60vh] min-h-100 max-h-175 overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0" />
      </div>
    );
  }

  const bgUrl = backdropPath
    ? `${BACKDROP_BASE}${backdropPath}`
    : movie.backdrop_path
      ? `${BACKDROP_BASE}${movie.backdrop_path}`
      : null;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  return (
    <div className="relative w-full h-[60vh] min-h-100 max-h-175 overflow-hidden">
      {bgUrl && (
        <SafeImage
          src={bgUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
          fallbackClassName="absolute inset-0 w-full h-full"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              {year && (
                <Badge variant="outline" className="text-xs">
                  {year}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                <Icon icon="lucide:star" className="w-3 h-3 mr-1" />
                {movie.vote_average.toFixed(1)}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-3">
              {movie.title}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-6">
              {movie.overview}
            </p>
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link to={`/movies/${movie.id}`}>
                  <Icon icon="lucide:info" className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
