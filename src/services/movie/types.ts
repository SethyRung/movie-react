// Re-export all types from validation
export type {
  Movie,
  MovieDetails,
  CastMember,
  CrewMember,
  MovieCredits,
  MovieImage,
  MovieImages,
  MovieVideo,
  MovieVideos,
  MovieKeyword,
  MovieKeywords,
  PaginatedMovieResponse,
  CompleteMovieData,
} from "./validation";

// Additional service-specific types
export interface MovieSearchOptions {
  page?: number;
  language?: string;
  includeAdult?: boolean;
  year?: number;
  primaryReleaseYear?: number;
}

export interface MovieDetailsOptions {
  language?: string;
  appendToResponse?: string;
}

export interface MovieCreditsOptions {
  language?: string;
}

export interface MovieImagesOptions {
  language?: string[];
  includeImageLanguage?: string[];
}

export interface MovieVideosOptions {
  language?: string;
}

export interface CompleteMovieDataOptions {
  language?: string;
  includeCredits?: boolean;
  includeImages?: boolean;
  includeVideos?: boolean;
  includeKeywords?: boolean;
}

export interface MovieServiceOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: {
    ttl?: number;
    key?: string;
    invalidateOnMutation?: boolean;
  };
}

// Service method parameter types
export type GetMovieDetailsParams = {
  movieId: number;
} & MovieDetailsOptions;

export type GetMovieCreditsParams = {
  movieId: number;
} & MovieCreditsOptions;

export type GetMovieImagesParams = {
  movieId: number;
} & MovieImagesOptions;

export type GetMovieVideosParams = {
  movieId: number;
} & MovieVideosOptions;

export type GetCompleteMovieDataParams = {
  movieId: number;
} & CompleteMovieDataOptions;

export type SearchMoviesParams = {
  query: string;
} & MovieSearchOptions;

export type GetSimilarMoviesParams = {
  movieId: number;
} & {
  page?: number;
  language?: string;
};

export type GetMovieRecommendationsParams = {
  movieId: number;
} & {
  page?: number;
  language?: string;
};
