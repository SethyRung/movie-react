import { BaseService } from "../base/BaseService";
import type { ServiceResponse, ServiceError } from "../base/ServiceResponse";
import { api } from "@/utils/axios";
import { z } from "zod";
import { DiscoveryValidationSchemas } from "./validation";
import type { DiscoveryPaginatedResponse, MainMovieResponse } from "./validation";

// Import RequestParams type from BaseService
type RequestParams = Record<string, string | number | boolean | undefined | null>;

// Type for movie images
type MovieImage = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1?: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
};

// Type for discovery list result
type DiscoveryListResult = {
  type: "popular" | "nowPlaying" | "upcoming" | "topRated";
  result: ServiceResponse<DiscoveryPaginatedResponse>;
};

// Type for discovery error
type DiscoveryError = {
  type: string;
  error: ServiceError | unknown;
};

export class DiscoveryService extends BaseService {
  protected readonly serviceName = "discovery";

  constructor() {
    super(api);
  }

  /**
   * Get a list of the current popular movies on TMDB
   * @param options Request configuration options
   * @returns Promise resolving to popular movies
   */
  async getPopularMovies(
    options: {
      page?: number;
      language?: string;
      region?: string;
    } = {},
  ): Promise<ServiceResponse<DiscoveryPaginatedResponse>> {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;
    if (options.region) params.region = options.region;

    return this.get(
      "/movie/popular",
      params,
      {
        cache: this.createCacheOptions(10 * 60 * 1000), // 10 minutes for popular movies
      },
      DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
    );
  }

  /**
   * Get a list of movies that are currently in theatres
   * @param options Request configuration options
   * @returns Promise resolving to now playing movies
   */
  async getNowPlayingMovies(
    options: {
      page?: number;
      language?: string;
      region?: string;
    } = {},
  ): Promise<ServiceResponse<DiscoveryPaginatedResponse>> {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;
    if (options.region) params.region = options.region;

    return this.get(
      "/movie/now_playing",
      params,
      {
        cache: this.createCacheOptions(5 * 60 * 1000), // 5 minutes for now playing (changes frequently)
      },
      DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
    );
  }

  /**
   * Get a list of movies that are being released soon
   * @param options Request configuration options
   * @returns Promise resolving to upcoming movies
   */
  async getUpcomingMovies(
    options: {
      page?: number;
      language?: string;
      region?: string;
    } = {},
  ): Promise<ServiceResponse<DiscoveryPaginatedResponse>> {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;
    if (options.region) params.region = options.region;

    return this.get(
      "/movie/upcoming",
      params,
      {
        cache: this.createCacheOptions(15 * 60 * 1000), // 15 minutes for upcoming movies
      },
      DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
    );
  }

  /**
   * Get the top rated movies on TMDB
   * @param options Request configuration options
   * @returns Promise resolving to top rated movies
   */
  async getTopRatedMovies(
    options: {
      page?: number;
      language?: string;
      region?: string;
    } = {},
  ): Promise<ServiceResponse<DiscoveryPaginatedResponse>> {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;
    if (options.region) params.region = options.region;

    return this.get(
      "/movie/top_rated",
      params,
      {
        cache: this.createCacheOptions(24 * 60 * 60 * 1000), // 24 hours for top rated (changes rarely)
      },
      DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
    );
  }

  /**
   * Get the main movie data (popular movies + images for the first result)
   * This replaces the main-movie.get.ts functionality
   * @param options Request configuration options
   * @returns Promise resolving to main movie response
   */
  async getMainMovie(
    options: {
      language?: string;
      region?: string;
      includeImages?: boolean;
    } = {},
  ): Promise<ServiceResponse<MainMovieResponse>> {
    const { language = "en-US", region, includeImages = true } = options;

    const params: RequestParams = {
      language,
      page: 1,
    };

    if (region) params.region = region;

    try {
      // Get popular movies
      const popularResponse = await this.get(
        "/movie/popular",
        params,
        {
          cache: this.createCacheOptions(10 * 60 * 1000), // 10 minutes
        },
        DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
      );

      if (!popularResponse.success || !popularResponse.data) {
        return {
          data: null,
          error: popularResponse.error || {
            code: "NO_POPULAR_MOVIES",
            message: "Failed to fetch popular movies",
          },
          isLoading: false,
          fromCache: popularResponse.fromCache,
          success: false,
        };
      }

      // Get images for the first movie if requested and movies exist
      let images: { backdrops: MovieImage[]; posters: MovieImage[] } = {
        backdrops: [],
        posters: [],
      };
      if (includeImages && popularResponse.data.results.length > 0) {
        const firstMovie = popularResponse.data.results[0];

        const imagesResponse = await this.get(
          `/movie/${firstMovie.id}/images`,
          {},
          {
            cache: this.createCacheOptions(24 * 60 * 60 * 1000), // 24 hours for images
          },
          z.object({
            backdrops: z.array(
              z.object({
                aspect_ratio: z.number(),
                file_path: z.string(),
                height: z.number(),
                iso_639_1: z.string().nullable().optional(),
                vote_average: z.number(),
                vote_count: z.number(),
                width: z.number(),
              }),
            ),
            posters: z.array(
              z.object({
                aspect_ratio: z.number(),
                file_path: z.string(),
                height: z.number(),
                iso_639_1: z.string().nullable().optional(),
                vote_average: z.number(),
                vote_count: z.number(),
                width: z.number(),
              }),
            ),
          }),
        );

        if (imagesResponse.success && imagesResponse.data) {
          images = imagesResponse.data;
        }
      }

      const mainMovieResponse: MainMovieResponse = {
        popular: popularResponse.data,
        images,
      };

      return {
        data: mainMovieResponse,
        error: null,
        isLoading: false,
        fromCache: popularResponse.fromCache,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: "MAIN_MOVIE_ERROR",
          message: "Failed to fetch main movie data",
          originalError: error,
        },
        isLoading: false,
        fromCache: false,
        success: false,
      };
    }
  }

  /**
   * Discover movies by various filters
   * @param options Discovery filters and configuration
   * @returns Promise resolving to discovered movies
   */
  async discoverMovies(
    options: {
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
    } = {},
  ): Promise<ServiceResponse<DiscoveryPaginatedResponse>> {
    const params: RequestParams = {
      page: options.page ?? 1,
    };

    // Add all optional parameters that are not undefined
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params[key] = value;
      }
    });

    return this.get(
      "/discover/movie",
      params,
      {
        cache: this.createCacheOptions(30 * 60 * 1000), // 30 minutes for discovery results
        timeout: 15000, // 15 seconds for complex discovery queries
      },
      DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
    );
  }

  /**
   * Get movies by genre
   * @param genreId The TMDB genre ID
   * @param options Request configuration options
   * @returns Promise resolving to movies by genre
   */
  async getMoviesByGenre(
    genreId: number,
    options: {
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
    } = {},
  ): Promise<ServiceResponse<DiscoveryPaginatedResponse>> {
    const params: RequestParams = {
      with_genres: genreId.toString(),
      page: options.page ?? 1,
    };

    if (options.language) params.language = options.language;
    if (options.sort_by) params.sort_by = options.sort_by;
    if (options.include_adult !== undefined) params.include_adult = options.include_adult;
    if (options.include_video !== undefined) params.include_video = options.include_video;

    return this.get(
      "/discover/movie",
      params,
      {
        cache: this.createCacheOptions(20 * 60 * 1000), // 20 minutes for genre results
      },
      DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
    );
  }

  /**
   * Get multiple discovery lists in parallel (popular, now playing, upcoming)
   * @param options Request configuration options
   * @returns Promise resolving to multiple discovery lists
   */
  async getDiscoveryLists(
    options: {
      language?: string;
      region?: string;
      includePopular?: boolean;
      includeNowPlaying?: boolean;
      includeUpcoming?: boolean;
      includeTopRated?: boolean;
    } = {},
  ): Promise<
    ServiceResponse<{
      popular?: DiscoveryPaginatedResponse;
      nowPlaying?: DiscoveryPaginatedResponse;
      upcoming?: DiscoveryPaginatedResponse;
      topRated?: DiscoveryPaginatedResponse;
    }>
  > {
    const {
      language = "en-US",
      region,
      includePopular = true,
      includeNowPlaying = true,
      includeUpcoming = true,
      includeTopRated = false,
    } = options;

    const promises: Promise<DiscoveryListResult>[] = [];

    if (includePopular) {
      promises.push(
        this.getPopularMovies({ language, region }).then((result) => ({ type: "popular", result })),
      );
    }

    if (includeNowPlaying) {
      promises.push(
        this.getNowPlayingMovies({ language, region }).then((result) => ({
          type: "nowPlaying",
          result,
        })),
      );
    }

    if (includeUpcoming) {
      promises.push(
        this.getUpcomingMovies({ language, region }).then((result) => ({
          type: "upcoming",
          result,
        })),
      );
    }

    if (includeTopRated) {
      promises.push(
        this.getTopRatedMovies({ language, region }).then((result) => ({
          type: "topRated",
          result,
        })),
      );
    }

    try {
      const results = await Promise.allSettled(promises);

      const discoveryLists: Record<string, DiscoveryPaginatedResponse> = {};
      const errors: DiscoveryError[] = [];

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const { type, result: serviceResult } = result.value;
          if (serviceResult.success && serviceResult.data) {
            discoveryLists[type] = serviceResult.data;
          } else {
            errors.push({
              type,
              error: serviceResult.error,
            });
          }
        } else {
          errors.push({
            type: "unknown",
            error: result.reason,
          });
        }
      });

      if (errors.length > 0) {
        console.warn(`Failed to fetch ${errors.length} discovery lists:`, errors);
      }

      return {
        data: discoveryLists,
        error:
          Object.keys(discoveryLists).length === 0
            ? {
                code: "ALL_DISCOVERY_REQUESTS_FAILED",
                message: "All discovery list requests failed",
                originalError: errors,
              }
            : null,
        isLoading: false,
        fromCache: false,
        success: Object.keys(discoveryLists).length > 0,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: "DISCOVERY_BATCH_ERROR",
          message: "Failed to process discovery batch request",
          originalError: error,
        },
        isLoading: false,
        fromCache: false,
        success: false,
      };
    }
  }

  /**
   * Clear discovery-related cache entries
   */
  clearDiscoveryCache(): void {
    this.invalidateCache("/movie/popular");
    this.invalidateCache("/movie/now_playing");
    this.invalidateCache("/movie/upcoming");
    this.invalidateCache("/movie/top_rated");
    this.invalidateCache("/discover/movie");
  }

  /**
   * Get cache statistics for the discovery service
   * @returns Cache statistics
   */
  getCacheStats() {
    return super.getCacheStats();
  }
}
