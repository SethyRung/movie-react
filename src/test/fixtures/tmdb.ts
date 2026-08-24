import type { DiscoveryMovie, DiscoveryPaginatedResponse } from "@/services/discovery/validation";

export function discoveryMovie(overrides: Partial<DiscoveryMovie> = {}): DiscoveryMovie {
  return {
    id: 27205,
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing technology.",
    poster_path: "/inception-poster.jpg",
    backdrop_path: "/inception-backdrop.jpg",
    release_date: "2010-07-16",
    genre_ids: [28, 878, 12],
    original_language: "en",
    original_title: "Inception",
    popularity: 98.4,
    video: false,
    vote_average: 8.4,
    vote_count: 35000,
    ...overrides,
  };
}

export function popularPage(
  overrides: Partial<DiscoveryPaginatedResponse> = {},
): DiscoveryPaginatedResponse {
  return {
    results: [discoveryMovie()],
    page: 1,
    total_pages: 10,
    total_results: 200,
    ...overrides,
  };
}
