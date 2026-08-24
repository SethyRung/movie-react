import { useQuery } from "@tanstack/react-query";
import {
  getCompleteMovieData,
  getMovieRecommendations,
  getSimilarMovies,
} from "@/services/movie/queries";
import type { CompleteMovieData, PaginatedMovieResponse } from "@/services/movie/validation";

const movieKeys = {
  all: ["movie"] as const,
  complete: (id: number) => [...movieKeys.all, "complete", id] as const,
  similar: (id: number, page: number) => [...movieKeys.all, "similar", id, page] as const,
  recommendations: (id: number, page: number) =>
    [...movieKeys.all, "recommendations", id, page] as const,
};

export { movieKeys };

export function useCompleteMovieData(id: number) {
  return useQuery<CompleteMovieData>({
    queryKey: movieKeys.complete(id),
    queryFn: () =>
      getCompleteMovieData(id, {
        includeCredits: true,
        includeImages: true,
        includeVideos: true,
        includeKeywords: false,
      }),
    enabled: id > 0,
  });
}

export function useSimilarMovies(id: number, page = 1) {
  return useQuery<PaginatedMovieResponse>({
    queryKey: movieKeys.similar(id, page),
    queryFn: () => getSimilarMovies(id, page),
    enabled: id > 0,
  });
}

export function useMovieRecommendations(id: number, page = 1) {
  return useQuery<PaginatedMovieResponse>({
    queryKey: movieKeys.recommendations(id, page),
    queryFn: () => getMovieRecommendations(id, page),
    enabled: id > 0,
  });
}
