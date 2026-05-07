// Re-export all types from validation
export type { DiscoveryMovie, DiscoveryPaginatedResponse, MainMovieResponse } from "./validation";

import type { DiscoveryPaginatedResponse as DiscoveryPaginatedResponseType } from "./validation";

// Additional service-specific types
export interface PopularMoviesOptions {
  page?: number;
  language?: string;
  region?: string;
}

export interface NowPlayingMoviesOptions {
  page?: number;
  language?: string;
  region?: string;
}

export interface UpcomingMoviesOptions {
  page?: number;
  language?: string;
  region?: string;
}

export interface TopRatedMoviesOptions {
  page?: number;
  language?: string;
  region?: string;
}

export interface MainMovieOptions {
  language?: string;
  region?: string;
  includeImages?: boolean;
}

export interface DiscoverMoviesOptions {
  page?: number;
  language?: string;
  region?: string;
  sort_by?:
    | "popularity.asc"
    | "popularity.desc"
    | "release_date.asc"
    | "release_date.desc"
    | "revenue.asc"
    | "revenue.desc"
    | "primary_release_date.asc"
    | "primary_release_date.desc"
    | "original_title.asc"
    | "original_title.desc"
    | "vote_average.asc"
    | "vote_average.desc"
    | "vote_count.asc"
    | "vote_count.desc";
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  release_date_gte?: string;
  release_date_lte?: string;
  with_release_type?: number;
  year?: number;
  vote_count_gte?: number;
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_companies?: string;
  with_companies_and?: string;
  with_original_language?: string;
  without_companies?: string;
  with_networks?: string;
  with_networks_and?: string;
  with_watch_providers?: string;
  watch_region?: string;
  with_watch_monetization_types?: "flatrate" | "free" | "ads" | "rent" | "buy";
  with_status?:
    | "rumored"
    | "planned"
    | "in_production"
    | "post_production"
    | "released"
    | "canceled";
}

export interface MoviesByGenreOptions {
  page?: number;
  language?: string;
  sort_by?:
    | "popularity.desc"
    | "release_date.desc"
    | "revenue.desc"
    | "primary_release_date.desc"
    | "vote_average.desc"
    | "vote_count.desc";
  include_adult?: boolean;
  include_video?: boolean;
}

export interface GetDiscoveryListsOptions {
  language?: string;
  region?: string;
  includePopular?: boolean;
  includeNowPlaying?: boolean;
  includeUpcoming?: boolean;
  includeTopRated?: boolean;
}

export interface DiscoveryLists {
  popular?: DiscoveryPaginatedResponseType;
  nowPlaying?: DiscoveryPaginatedResponseType;
  upcoming?: DiscoveryPaginatedResponseType;
  topRated?: DiscoveryPaginatedResponseType;
}

// Service method parameter types
export type GetPopularMoviesParams = PopularMoviesOptions;
export type GetNowPlayingMoviesParams = NowPlayingMoviesOptions;
export type GetUpcomingMoviesParams = UpcomingMoviesOptions;
export type GetTopRatedMoviesParams = TopRatedMoviesOptions;
export type GetMainMovieParams = MainMovieOptions;
export type DiscoverMoviesParams = DiscoverMoviesOptions;
export type GetMoviesByGenreParams = {
  genreId: number;
} & MoviesByGenreOptions;
export type GetDiscoveryListsParams = GetDiscoveryListsOptions;
