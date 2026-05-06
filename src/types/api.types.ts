export interface ApiError {
  status_message: string;
  status_code: number;
}

export interface ApiSuccess<T> {
  data: T;
  status: number;
  statusText: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface MovieListResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path?: string;
}

export interface MovieCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface MovieVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | "Behind the Scenes" | "Bloopers";
  official: boolean;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}
