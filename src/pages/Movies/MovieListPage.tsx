import { useCallback, useState } from "react";
import { MovieCard } from "@features/movies";
import { usePopularMovies } from "@features/movies/hooks";
import { useMovieStore } from "@features/movies";
import type { Movie } from "@/types/api.types";

export default function MovieListPage() {
  const [page, setPage] = useState<number>(1);
  const { movies } = useMovieStore();

  // Use custom hook for fetching popular movies
  const { isLoading } = usePopularMovies(page);

  const handleLoadMore = useCallback(() => {
    if (!isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  }, [page, isLoading]);

  return (
    <div className="w-full p-4 md:px-16 lg:px-52 grid gap-4 grid-cols-[repeat(auto-fit,minmax(208px,1fr))]">
      {movies.map((movie: Movie) => (
        <div className="w-full bg-tertiary-500" key={movie.id}>
          <MovieCard
            id={movie.id}
            images={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            title={movie.original_title}
            release={movie.release_date}
            rating={movie?.vote_average.toFixed(2)}
            language={movie.original_language.toLocaleUpperCase()}
          />
        </div>
      ))}

      <div className="my-6 col-start-1 -col-end-1">
        <button
          className={`mx-auto px-4 h-10 rounded text-grey-200 hover:text-white flex items-center justify-center gap-2 text-sm md:text-base transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
