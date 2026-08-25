import type { DiscoveryMovie, DiscoveryPaginatedResponse } from "@/services/discovery/validation";
import type { CastMember, CompleteMovieData, MovieVideo } from "@/services/movie/validation";

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

export function castMember(overrides: Partial<CastMember> = {}): CastMember {
  return {
    id: 6193,
    credit_id: "52fe4230c3a36847f800ad03",
    name: "Leonardo DiCaprio",
    original_name: "Leonardo DiCaprio",
    character: "Dom Cobb",
    profile_path: "/leo.jpg",
    order: 0,
    ...overrides,
  };
}

export function movieVideo(overrides: Partial<MovieVideo> = {}): MovieVideo {
  return {
    id: "533ec654c3a36854480003eb",
    key: "YoHD9XEInc0",
    name: "Official Trailer",
    official: true,
    published_at: "2010-05-10T00:00:00.000Z",
    site: "YouTube",
    size: 1080,
    type: "Trailer",
    ...overrides,
  };
}

export function completeMovie(overrides: Partial<CompleteMovieData> = {}): CompleteMovieData {
  return {
    id: 27205,
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing technology.",
    poster_path: "/inception-poster.jpg",
    backdrop_path: "/inception-backdrop.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    vote_count: 35000,
    runtime: 148,
    tagline: "Your mind is the scene of the crime.",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
    ],
    production_companies: [{ id: 9996, name: "Warner Bros. Pictures", origin_country: "US" }],
    credits: {
      cast: [castMember()],
      crew: [],
    },
    videos: {
      results: [movieVideo()],
    },
    images: {
      backdrops: [],
      posters: [],
      logos: [],
    },
    ...overrides,
  };
}
