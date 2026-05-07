import { useQuery } from "@tanstack/react-query";
import { movieAPI } from "@/services";
import type { MovieDetails } from "@/services/movie/validation";
import type { ServiceResponse } from "@/services/base/ServiceResponse";

const searchKeys = {
  all: ["search"] as const,
  movies: (query: string, page: number) => [...searchKeys.all, "movies", query, page] as const,
};

export function useSearchMovies(query: string, page = 1) {
  return useQuery<
    ServiceResponse<{
      results: MovieDetails[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  >({
    queryKey: searchKeys.movies(query, page),
    queryFn: () => movieAPI.movie.searchMovies(query, { page }),
    enabled: query.trim().length > 0,
  });
}
