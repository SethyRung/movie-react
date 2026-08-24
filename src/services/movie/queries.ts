import { request } from "@/services/tmdb";
import { MovieValidationSchemas } from "./validation";
import type { CompleteMovieData, PaginatedMovieResponse } from "./validation";

const DEFAULT_LANG = "en-US";

export type CompleteMovieDataOptions = {
  language?: string;
  includeCredits?: boolean;
  includeImages?: boolean;
  includeVideos?: boolean;
  includeKeywords?: boolean;
};

export async function getCompleteMovieData(
  id: number,
  options: CompleteMovieDataOptions = {},
): Promise<CompleteMovieData> {
  const {
    language = DEFAULT_LANG,
    includeCredits = true,
    includeImages = true,
    includeVideos = true,
    includeKeywords = false,
  } = options;

  const appendParts: string[] = [];
  if (includeCredits) appendParts.push("credits");
  if (includeImages) appendParts.push("images");
  if (includeVideos) appendParts.push("videos");
  if (includeKeywords) appendParts.push("keywords");

  return request(
    {
      path: `/movie/${id}`,
      params: { language, append_to_response: appendParts.join(",") },
    },
    MovieValidationSchemas.CompleteMovieData,
  );
}

export async function getSimilarMovies(
  id: number,
  page = 1,
  language = DEFAULT_LANG,
): Promise<PaginatedMovieResponse> {
  return request(
    { path: `/movie/${id}/similar`, params: { page, language } },
    MovieValidationSchemas.PaginatedMovieResponse,
  );
}

export async function getMovieRecommendations(
  id: number,
  page = 1,
  language = DEFAULT_LANG,
): Promise<PaginatedMovieResponse> {
  return request(
    { path: `/movie/${id}/recommendations`, params: { page, language } },
    MovieValidationSchemas.PaginatedMovieResponse,
  );
}

export type SearchMoviesOptions = {
  page?: number;
  language?: string;
  includeAdult?: boolean;
  year?: number;
  primaryReleaseYear?: number;
};

export async function searchMovies(
  query: string,
  options: SearchMoviesOptions = {},
): Promise<PaginatedMovieResponse> {
  const { page = 1, language, includeAdult, year, primaryReleaseYear } = options;
  const params: Record<string, string | number | boolean | undefined> = { query, page };
  if (language) params.language = language;
  if (includeAdult !== undefined) params.include_adult = includeAdult;
  if (year) params.year = year;
  if (primaryReleaseYear) params.primary_release_year = primaryReleaseYear;

  return request({ path: "/search/movie", params }, MovieValidationSchemas.PaginatedMovieResponse);
}
