import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services";
import { useMovieStore } from "../stores/movieStore";
import { ExtendedMovie } from "../types/movie.types";

export function useMovieDetails(movieId: number) {
  const { setCurrentMovie, setLoading, setError } = useMovieStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await movieService.getCompleteMovieData(movieId, {
          includeCredits: true,
          includeImages: true,
          includeVideos: true,
          includeKeywords: false,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || "Movie not found");
        }

        const movieData = response.data;

        setCurrentMovie({
          ...(movieData as unknown as ExtendedMovie),
          genres: movieData.genres || [],
        });

        // Prefetch individual queries for existing components that expect them
        queryClient.prefetchQuery({
          queryKey: ["movie", movieId, "credits"],
          queryFn: async () => {
            return movieData.credits || { cast: [], crew: [] };
          },
        });

        queryClient.prefetchQuery({
          queryKey: ["movie", movieId, "images"],
          queryFn: async () => {
            return movieData.images || { backdrops: [], posters: [] };
          },
        });

        queryClient.prefetchQuery({
          queryKey: ["movie", movieId, "videos"],
          queryFn: async () => {
            return movieData.videos || { results: [] };
          },
        });

        return movieData;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch movie details");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "credits"],
    queryFn: async () => {
      const response = await movieService.getMovieCredits(movieId);
      if (!response.success || !response.data) {
        return { cast: [], crew: [] }; // Return default structure if error
      }
      return response.data;
    },
    enabled: !!movieId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useMovieImages(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "images"],
    queryFn: async () => {
      const response = await movieService.getMovieImages(movieId);
      if (!response.success || !response.data) {
        return { backdrops: [], posters: [] }; // Return default structure if error
      }
      return response.data;
    },
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId, "videos"],
    queryFn: async () => {
      const response = await movieService.getMovieVideos(movieId);
      if (!response.success || !response.data) {
        return { results: [] }; // Return default structure if error
      }
      return response.data;
    },
    enabled: !!movieId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
}
