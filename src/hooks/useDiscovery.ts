import { useQuery } from "@tanstack/react-query";
import {
  discoverList,
  getDiscoveryLists,
  getMoviesByGenre,
  type DiscoveryLists,
} from "@/services/discovery/queries";
import type { DiscoveryPaginatedResponse } from "@/services/discovery/validation";

const discoveryKeys = {
  all: ["discovery"] as const,
  popular: (page: number) => [...discoveryKeys.all, "popular", page] as const,
  nowPlaying: (page: number) => [...discoveryKeys.all, "nowPlaying", page] as const,
  upcoming: (page: number) => [...discoveryKeys.all, "upcoming", page] as const,
  topRated: (page: number) => [...discoveryKeys.all, "topRated", page] as const,
  byGenre: (genreId: number, page: number) =>
    [...discoveryKeys.all, "genre", genreId, page] as const,
  lists: () => [...discoveryKeys.all, "lists"] as const,
};

export { discoveryKeys };

export function usePopularMovies(page = 1) {
  return useQuery<DiscoveryPaginatedResponse>({
    queryKey: discoveryKeys.popular(page),
    queryFn: () => discoverList("popular", page),
  });
}

export function useNowPlayingMovies(page = 1) {
  return useQuery<DiscoveryPaginatedResponse>({
    queryKey: discoveryKeys.nowPlaying(page),
    queryFn: () => discoverList("nowPlaying", page),
  });
}

export function useUpcomingMovies(page = 1) {
  return useQuery<DiscoveryPaginatedResponse>({
    queryKey: discoveryKeys.upcoming(page),
    queryFn: () => discoverList("upcoming", page),
  });
}

export function useTopRatedMovies(page = 1) {
  return useQuery<DiscoveryPaginatedResponse>({
    queryKey: discoveryKeys.topRated(page),
    queryFn: () => discoverList("topRated", page),
  });
}

export function useMoviesByGenre(genreId: number, page = 1) {
  return useQuery<DiscoveryPaginatedResponse>({
    queryKey: discoveryKeys.byGenre(genreId, page),
    queryFn: () => getMoviesByGenre(genreId, page),
    enabled: genreId > 0,
  });
}

export function useDiscoveryLists() {
  return useQuery<DiscoveryLists>({
    queryKey: discoveryKeys.lists(),
    queryFn: () => getDiscoveryLists(),
  });
}
