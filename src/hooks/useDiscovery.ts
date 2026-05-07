import { useQuery } from "@tanstack/react-query";
import { movieAPI } from "@/services";
import type {
  DiscoveryPaginatedResponse,
  MainMovieResponse,
} from "@/services/discovery/validation";
import type { ServiceResponse } from "@/services/base/ServiceResponse";

const discoveryKeys = {
  all: ["discovery"] as const,
  popular: (page: number) => [...discoveryKeys.all, "popular", page] as const,
  nowPlaying: (page: number) => [...discoveryKeys.all, "nowPlaying", page] as const,
  upcoming: (page: number) => [...discoveryKeys.all, "upcoming", page] as const,
  topRated: (page: number) => [...discoveryKeys.all, "topRated", page] as const,
  main: () => [...discoveryKeys.all, "main"] as const,
  byGenre: (genreId: number, page: number) =>
    [...discoveryKeys.all, "genre", genreId, page] as const,
  lists: () => [...discoveryKeys.all, "lists"] as const,
};

export function usePopularMovies(page = 1) {
  return useQuery<ServiceResponse<DiscoveryPaginatedResponse>>({
    queryKey: discoveryKeys.popular(page),
    queryFn: () => movieAPI.discovery.getPopularMovies({ page }),
  });
}

export function useNowPlayingMovies(page = 1) {
  return useQuery<ServiceResponse<DiscoveryPaginatedResponse>>({
    queryKey: discoveryKeys.nowPlaying(page),
    queryFn: () => movieAPI.discovery.getNowPlayingMovies({ page }),
  });
}

export function useUpcomingMovies(page = 1) {
  return useQuery<ServiceResponse<DiscoveryPaginatedResponse>>({
    queryKey: discoveryKeys.upcoming(page),
    queryFn: () => movieAPI.discovery.getUpcomingMovies({ page }),
  });
}

export function useTopRatedMovies(page = 1) {
  return useQuery<ServiceResponse<DiscoveryPaginatedResponse>>({
    queryKey: discoveryKeys.topRated(page),
    queryFn: () => movieAPI.discovery.getTopRatedMovies({ page }),
  });
}

export function useMainMovie() {
  return useQuery<ServiceResponse<MainMovieResponse>>({
    queryKey: discoveryKeys.main(),
    queryFn: () => movieAPI.discovery.getMainMovie(),
  });
}

export function useMoviesByGenre(genreId: number, page = 1) {
  return useQuery<ServiceResponse<DiscoveryPaginatedResponse>>({
    queryKey: discoveryKeys.byGenre(genreId, page),
    queryFn: () => movieAPI.discovery.getMoviesByGenre(genreId, { page }),
    enabled: genreId > 0,
  });
}

export function useDiscoveryLists() {
  return useQuery<
    ServiceResponse<{
      popular?: DiscoveryPaginatedResponse;
      nowPlaying?: DiscoveryPaginatedResponse;
      upcoming?: DiscoveryPaginatedResponse;
      topRated?: DiscoveryPaginatedResponse;
    }>
  >({
    queryKey: discoveryKeys.lists(),
    queryFn: () => movieAPI.discovery.getDiscoveryLists({ includeTopRated: true }),
  });
}
