import { BaseService } from "../base/BaseService";
import type { ServiceResponse, ServiceError } from "../base/ServiceResponse";
import { withApiKey } from "../../utils/axios";
import { MovieValidationSchemas } from "./validation";
import type {
  MovieDetails,
  MovieCredits,
  MovieImages,
  MovieVideos,
  MovieKeywords,
  CompleteMovieData,
} from "./validation";

// Import RequestParams type from BaseService
type RequestParams = Record<string, string | number | boolean | undefined | null>;

// Type for movie batch error
type MovieBatchError = {
  movieId: number;
  error: ServiceError | unknown;
};

export class MovieService extends BaseService {
  protected readonly serviceName = "movie";

  constructor() {
    super(withApiKey);
  }

  /**
   * Get detailed information about a specific movie
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to movie details
   */
  async getMovieDetails(
    movieId: number,
    options: { language?: string; appendToResponse?: string } = {},
  ): Promise<ServiceResponse<MovieDetails>> {
    const params = new URLSearchParams();

    if (options.language) {
      params.append("language", options.language);
    }

    if (options.appendToResponse) {
      params.append("append_to_response", options.appendToResponse);
    }

    return this.get(
      `/movie/${movieId}`,
      Object.fromEntries(params),
      {
        cache: this.createCacheOptions(30 * 60 * 1000), // 30 minutes
        timeout: 15000, // 15 seconds for detailed requests
      },
      MovieValidationSchemas.MovieDetails,
    );
  }

  /**
   * Get the cast and crew for a specific movie
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to movie credits
   */
  async getMovieCredits(
    movieId: number,
    options: { language?: string } = {},
  ): Promise<ServiceResponse<MovieCredits>> {
    const params = new URLSearchParams();

    if (options.language) {
      params.append("language", options.language);
    }

    return this.get(
      `/movie/${movieId}/credits`,
      Object.fromEntries(params),
      {
        cache: this.createCacheOptions(60 * 60 * 1000), // 1 hour (cast/crew changes rarely)
      },
      MovieValidationSchemas.MovieCredits,
    );
  }

  /**
   * Get the images (posters, backdrops, etc.) for a specific movie
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to movie images
   */
  async getMovieImages(
    movieId: number,
    options: { language?: string[]; includeImageLanguage?: string[] } = {},
  ): Promise<ServiceResponse<MovieImages>> {
    const params = new URLSearchParams();

    if (options.language && options.language.length > 0) {
      params.append("language", options.language.join(","));
    }

    if (options.includeImageLanguage && options.includeImageLanguage.length > 0) {
      params.append("include_image_language", options.includeImageLanguage.join(","));
    }

    return this.get(
      `/movie/${movieId}/images`,
      Object.fromEntries(params),
      {
        cache: this.createCacheOptions(24 * 60 * 60 * 1000), // 24 hours (images rarely change)
      },
      MovieValidationSchemas.MovieImages,
    );
  }

  /**
   * Get the videos (trailers, teasers, clips) for a specific movie
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to movie videos
   */
  async getMovieVideos(
    movieId: number,
    options: { language?: string } = {},
  ): Promise<ServiceResponse<MovieVideos>> {
    const params = new URLSearchParams();

    if (options.language) {
      params.append("language", options.language);
    }

    return this.get(
      `/movie/${movieId}/videos`,
      Object.fromEntries(params),
      {
        cache: this.createCacheOptions(6 * 60 * 60 * 1000), // 6 hours
      },
      MovieValidationSchemas.MovieVideos,
    );
  }

  /**
   * Get the keywords associated with a specific movie
   * @param movieId The TMDB movie ID
   * @returns Promise resolving to movie keywords
   */
  async getMovieKeywords(movieId: number): Promise<ServiceResponse<MovieKeywords>> {
    return this.get(
      `/movie/${movieId}/keywords`,
      {},
      {
        cache: this.createCacheOptions(24 * 60 * 60 * 1000), // 24 hours
      },
      MovieValidationSchemas.MovieKeywords,
    );
  }

  /**
   * Get complete movie data in a single call (details + credits + images + videos + keywords)
   * This is an optimized method that reduces multiple API calls
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to complete movie data
   */
  async getCompleteMovieData(
    movieId: number,
    options: {
      language?: string;
      includeCredits?: boolean;
      includeImages?: boolean;
      includeVideos?: boolean;
      includeKeywords?: boolean;
    } = {},
  ): Promise<ServiceResponse<CompleteMovieData>> {
    const {
      language = "en-US",
      includeCredits = true,
      includeImages = true,
      includeVideos = true,
      includeKeywords = false, // Keywords are less commonly used
    } = options;

    // Build append_to_response parameter for efficient data fetching
    const appendParts: string[] = [];
    if (includeCredits) appendParts.push("credits");
    if (includeImages) appendParts.push("images");
    if (includeVideos) appendParts.push("videos");
    if (includeKeywords) appendParts.push("keywords");

    const appendToResponse = appendParts.join(",");

    return this.get(
      `/movie/${movieId}`,
      {
        language,
        append_to_response: appendToResponse,
      },
      {
        cache: this.createCacheOptions(30 * 60 * 1000), // 30 minutes
        timeout: 20000, // 20 seconds for comprehensive request
      },
      MovieValidationSchemas.CompleteMovieData,
    );
  }

  /**
   * Get multiple movies in parallel (batch request)
   * @param movieIds Array of TMDB movie IDs
   * @param options Request configuration options
   * @returns Promise resolving to array of movie data
   */
  async getMultipleMovies(
    movieIds: number[],
    options: { language?: string } = {},
  ): Promise<ServiceResponse<MovieDetails[]>> {
    if (movieIds.length === 0) {
      return {
        data: [],
        error: null,
        isLoading: false,
        fromCache: false,
        success: true,
      };
    }

    const promises = movieIds.map((id) =>
      this.getMovieDetails(id, options).then((response) => ({
        id,
        ...response,
      })),
    );

    try {
      const results = await Promise.allSettled(promises);

      const successfulMovies: MovieDetails[] = [];
      const errors: MovieBatchError[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.success && result.value.data) {
          successfulMovies.push(result.value.data);
        } else {
          errors.push({
            movieId: movieIds[index],
            error: result.status === "rejected" ? result.reason : result.value.error,
          });
        }
      });

      if (errors.length > 0) {
        console.warn(`Failed to fetch ${errors.length} out of ${movieIds.length} movies:`, errors);
      }

      return {
        data: successfulMovies,
        error:
          successfulMovies.length === 0
            ? {
                code: "ALL_REQUESTS_FAILED",
                message: "All movie requests failed",
                originalError: errors,
              }
            : null,
        isLoading: false,
        fromCache: false,
        success: successfulMovies.length > 0,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: "BATCH_REQUEST_ERROR",
          message: "Failed to process batch movie request",
          originalError: error,
        },
        isLoading: false,
        fromCache: false,
        success: false,
      };
    }
  }

  /**
   * Search for movies by title
   * @param query Search query
   * @param options Request configuration options
   * @returns Promise resolving to search results
   */
  async searchMovies(
    query: string,
    options: {
      page?: number;
      language?: string;
      includeAdult?: boolean;
      year?: number;
      primaryReleaseYear?: number;
    } = {},
  ): Promise<
    ServiceResponse<{
      results: MovieDetails[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  > {
    const params: RequestParams = {
      query,
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;
    if (options.includeAdult !== undefined) params.include_adult = options.includeAdult;
    if (options.year) params.year = options.year;
    if (options.primaryReleaseYear) params.primary_release_year = options.primaryReleaseYear;

    return this.getPaginated(
      "/search/movie",
      params,
      {
        cache: this.createCacheOptions(15 * 60 * 1000), // 15 minutes for search results
      },
      MovieValidationSchemas.MovieDetails,
    );
  }

  /**
   * Get movies similar to a specific movie
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to similar movies
   */
  async getSimilarMovies(
    movieId: number,
    options: { page?: number; language?: string } = {},
  ): Promise<
    ServiceResponse<{
      results: MovieDetails[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  > {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;

    return this.getPaginated(
      `/movie/${movieId}/similar`,
      params,
      {
        cache: this.createCacheOptions(2 * 60 * 60 * 1000), // 2 hours
      },
      MovieValidationSchemas.MovieDetails,
    );
  }

  /**
   * Get recommendations for a specific movie
   * @param movieId The TMDB movie ID
   * @param options Request configuration options
   * @returns Promise resolving to recommended movies
   */
  async getMovieRecommendations(
    movieId: number,
    options: { page?: number; language?: string } = {},
  ): Promise<
    ServiceResponse<{
      results: MovieDetails[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  > {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;

    return this.getPaginated(
      `/movie/${movieId}/recommendations`,
      params,
      {
        cache: this.createCacheOptions(2 * 60 * 60 * 1000), // 2 hours
      },
      MovieValidationSchemas.MovieDetails,
    );
  }

  /**
   * Clear movie-related cache entries
   * @param movieId Optional specific movie ID to clear cache for
   */
  clearMovieCache(movieId?: number): void {
    if (movieId) {
      this.invalidateCache(`/movie/${movieId}`);
    } else {
      this.invalidateCache("/movie/");
      this.invalidateCache("/search/movie");
    }
  }

  /**
   * Get cache statistics for the movie service
   * @returns Cache statistics
   */
  getCacheStats() {
    return super.getCacheStats();
  }
}
