import { useEffect, useState } from "react";
import MovieCard from "@/features/movies/components/MovieCard";
import { movieAPI } from "../../services";
import { isSuccessResponse } from "../../services/base/ServiceResponse";
import type { DiscoveryMovie, DiscoveryPaginatedResponse } from "@/services/discovery/validation";

export default function Index() {
  const [movieList, setMovieList] = useState<DiscoveryPaginatedResponse>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const loadData = async () => {
      const response = await movieAPI.discovery.getPopularMovies({ page });
      if (isSuccessResponse(response)) {
        if (!movieList) {
          setTimeout(() => setMovieList(response.data), 0);
        } else {
          const newData = {
            ...response.data,
            results: [...movieList.results, ...response.data.results],
          };
          setTimeout(() => setMovieList(newData), 0);
        }
      }
    };

    loadData();
  }, [page, movieList]);

  return (
    <div className="w-full p-4 md:px-16 lg:px-52 grid gap-4 grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))]">
      {movieList?.results.map((movie: DiscoveryMovie) => (
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
      <div className="my-6 col-start-1 col-end-[-1]">
        <button
          className="mx-auto px-4 h-10 rounded text-grey-200 hover:text-white flex items-center justify-center gap-2 text-sm md:text-base transition-all"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
