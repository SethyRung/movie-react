import { useQuery } from "@tanstack/react-query";
import { discoveryService } from "@/services";
import { useMovieStore } from "../stores/movieStore";
import { ServiceResponse } from "@/services";
import { DiscoveryPaginatedResponse } from "@/services/discovery/validation";
import { Movie } from "@/types/api.types";

export function useMovies(category: "popular" | "now-playing" | "upcoming", page: number = 1) {
  const { setMovies, setLoading, setError, setTotalPages, setCurrentPage } = useMovieStore();

  return useQuery({
    queryKey: ["movies", category, page],
    queryFn: async () => {
      setLoading(true);
      try {
        let response: ServiceResponse<DiscoveryPaginatedResponse>;

        switch (category) {
          case "now-playing":
            response = await discoveryService.getNowPlayingMovies({ page });
            break;
          case "upcoming":
            response = await discoveryService.getUpcomingMovies({ page });
            break;
          case "popular":
          default:
            response = await discoveryService.getPopularMovies({ page });
            break;
        }

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || "Failed to fetch movies");
        }

        const moviesData = response.data.results;

        if (page === 1) {
          setMovies(
            moviesData.map((movie) => ({
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path || undefined,
              backdrop_path: movie.backdrop_path || undefined,
              overview: movie.overview || "",
              release_date: movie.release_date || "",
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              popularity: movie.popularity || 0,
              original_language: movie.original_language || "",
              original_title: movie.original_title || "",
              genre_ids: movie.genre_ids || [],
              adult: movie.adult || false,
              video: movie.video || false,
            })),
          );
        } else {
          setMovies((prev: Movie[]) => [
            ...prev,
            ...moviesData.map((movie) => ({
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path || undefined,
              backdrop_path: movie.backdrop_path || undefined,
              overview: movie.overview || "",
              release_date: movie.release_date || "",
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              popularity: movie.popularity || 0,
              original_language: movie.original_language || "",
              original_title: movie.original_title || "",
              genre_ids: movie.genre_ids || [],
              adult: movie.adult || false,
              video: movie.video || false,
            })),
          ]);
        }

        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(page);

        // Transform to legacy format for compatibility
        return {
          results: moviesData,
          page: response.data.page,
          total_pages: response.data.total_pages,
          total_results: response.data.total_results,
        };
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch movies");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
}

export function usePopularMovies(page: number = 1) {
  return useMovies("popular", page);
}

export function useNowPlayingMovies(page: number = 1) {
  return useMovies("now-playing", page);
}

export function useUpcomingMovies(page: number = 1) {
  return useMovies("upcoming", page);
}
