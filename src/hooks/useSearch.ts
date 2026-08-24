import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/services/movie/queries";
import type { PaginatedMovieResponse } from "@/services/movie/validation";

const searchKeys = {
  all: ["search"] as const,
  movies: (query: string, page: number) => [...searchKeys.all, "movies", query, page] as const,
};

export function useSearchMovies(query: string, page = 1) {
  return useQuery<PaginatedMovieResponse>({
    queryKey: searchKeys.movies(query, page),
    queryFn: () => searchMovies(query, { page }),
    enabled: query.trim().length > 0,
  });
}
