import { useQuery } from "@tanstack/react-query";
import { discoveryService } from "@/services";
import { useMovieStore } from "../stores/movieStore";
import type { ServiceResponse } from "@/services";
import type { MainMovieResponse } from "@/services/discovery/validation";

export function useMainMovie() {
  const { setLoading, setError } = useMovieStore();

  return useQuery({
    queryKey: ["main-movie"],
    queryFn: async () => {
      setLoading(true);
      try {
        const response: ServiceResponse<MainMovieResponse> = await discoveryService.getMainMovie({
          language: "en-US",
          includeImages: true,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || "No movies found");
        }

        // Transform to legacy format for compatibility
        return {
          popular: {
            results: response.data.popular.results,
            page: response.data.popular.page,
            total_pages: response.data.popular.total_pages,
            total_results: response.data.popular.total_results,
          },
          images: response.data.images,
        };
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch main movie");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
