import { MovieCard, type MovieCardMovie } from "@/components/movie/movie-card";
import { MovieGrid } from "@/components/movie/movie-grid";

export type SearchResultsProps = {
  movies?: MovieCardMovie[];
  isLoading?: boolean;
  skeletonCount?: number;
};

function MovieCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-muted aspect-2/3 animate-pulse rounded-sm motion-reduce:animate-none" />
      <div className="bg-muted h-4 w-3/4 animate-pulse rounded-sm motion-reduce:animate-none" />
      <div className="bg-muted h-3 w-1/3 animate-pulse rounded-sm motion-reduce:animate-none" />
    </div>
  );
}

export function SearchResults({ movies, isLoading, skeletonCount = 12 }: SearchResultsProps) {
  if (isLoading) {
    return (
      <MovieGrid>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </MovieGrid>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <MovieGrid>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} className="w-full" />
      ))}
    </MovieGrid>
  );
}
