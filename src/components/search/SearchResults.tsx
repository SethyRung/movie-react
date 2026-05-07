import { MovieCard, MovieCardSkeleton } from "@/components/movie/MovieCard";
import { MovieGrid } from "@/components/movie/MovieGrid";
import type { Movie } from "@/services/movie/validation";
import type { DiscoveryMovie } from "@/services/discovery/validation";

export type SearchResultsProps = {
  movies?: Movie[] | DiscoveryMovie[];
  isLoading?: boolean;
  skeletonCount?: number;
};

export function SearchResults({ movies, isLoading, skeletonCount = 12 }: SearchResultsProps) {
  if (isLoading) {
    return (
      <MovieGrid>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </MovieGrid>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <MovieGrid>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </MovieGrid>
  );
}
