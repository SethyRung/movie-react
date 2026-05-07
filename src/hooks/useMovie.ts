import { useQuery } from "@tanstack/react-query";
import { movieAPI } from "@/services";
import type {
  MovieDetails,
  MovieCredits,
  MovieImages,
  MovieVideos,
  MovieKeywords,
  CompleteMovieData,
} from "@/services/movie/validation";
import type { ServiceResponse } from "@/services/base/ServiceResponse";

const movieKeys = {
  all: ["movie"] as const,
  details: (id: number) => [...movieKeys.all, "details", id] as const,
  credits: (id: number) => [...movieKeys.all, "credits", id] as const,
  images: (id: number) => [...movieKeys.all, "images", id] as const,
  videos: (id: number) => [...movieKeys.all, "videos", id] as const,
  keywords: (id: number) => [...movieKeys.all, "keywords", id] as const,
  complete: (id: number) => [...movieKeys.all, "complete", id] as const,
  similar: (id: number, page: number) => [...movieKeys.all, "similar", id, page] as const,
  recommendations: (id: number, page: number) =>
    [...movieKeys.all, "recommendations", id, page] as const,
};

export function useMovieDetails(id: number) {
  return useQuery<ServiceResponse<MovieDetails>>({
    queryKey: movieKeys.details(id),
    queryFn: () => movieAPI.movie.getMovieDetails(id),
    enabled: id > 0,
  });
}

export function useMovieCredits(id: number) {
  return useQuery<ServiceResponse<MovieCredits>>({
    queryKey: movieKeys.credits(id),
    queryFn: () => movieAPI.movie.getMovieCredits(id),
    enabled: id > 0,
  });
}

export function useMovieImages(id: number) {
  return useQuery<ServiceResponse<MovieImages>>({
    queryKey: movieKeys.images(id),
    queryFn: () => movieAPI.movie.getMovieImages(id),
    enabled: id > 0,
  });
}

export function useMovieVideos(id: number) {
  return useQuery<ServiceResponse<MovieVideos>>({
    queryKey: movieKeys.videos(id),
    queryFn: () => movieAPI.movie.getMovieVideos(id),
    enabled: id > 0,
  });
}

export function useMovieKeywords(id: number) {
  return useQuery<ServiceResponse<MovieKeywords>>({
    queryKey: movieKeys.keywords(id),
    queryFn: () => movieAPI.movie.getMovieKeywords(id),
    enabled: id > 0,
  });
}

export function useCompleteMovieData(id: number) {
  return useQuery<ServiceResponse<CompleteMovieData>>({
    queryKey: movieKeys.complete(id),
    queryFn: () =>
      movieAPI.movie.getCompleteMovieData(id, {
        includeCredits: true,
        includeImages: true,
        includeVideos: true,
        includeKeywords: false,
      }),
    enabled: id > 0,
  });
}

export function useSimilarMovies(id: number, page = 1) {
  return useQuery<
    ServiceResponse<{
      results: MovieDetails[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  >({
    queryKey: movieKeys.similar(id, page),
    queryFn: () => movieAPI.movie.getSimilarMovies(id, { page }),
    enabled: id > 0,
  });
}

export function useMovieRecommendations(id: number, page = 1) {
  return useQuery<
    ServiceResponse<{
      results: MovieDetails[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  >({
    queryKey: movieKeys.recommendations(id, page),
    queryFn: () => movieAPI.movie.getMovieRecommendations(id, { page }),
    enabled: id > 0,
  });
}
